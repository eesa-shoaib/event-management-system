import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface EventItem {
  id: string;
  name: string;
  date?: string;
  time?: string;
  photos?: string;
  url?: string;
  venue?: string;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  classification: string;
  genre?: string;
}

interface TicketmasterEvent {
  id: string;
  name: string;
  url?: string;
  dates?: { start?: { localDate?: string; localTime?: string } };
  images?: Array<{ url?: string }>;
  classifications?: Array<{
    segment?: { name?: string };
    genre?: { name?: string };
  }>;
  _embedded?: {
    venues?: Array<{
      name?: string;
      address?: { line1?: string };
      city?: { name?: string };
      state?: { name?: string };
      country?: { name?: string };
    }>;
  };
}

interface TicketmasterSearchResponse {
  _embedded?: { events?: TicketmasterEvent[] };
  page?: { totalPages?: number };
}

interface EventState {
  items: EventItem[];
  activeEvent: EventItem | null;
  detailStatus: RequestStatus;
  detailError: string | null;
  detailRequestId: string | null;
  status: RequestStatus;
  error: string | null;
  page: number;
  totalPages: number;
  keyword: string;
  classification: string;
}

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";
type RejectConfig = { rejectValue: string };

interface EventFilters {
  keyword: string;
  classification: string;
  page: number;
}

const initialState: EventState = {
  items: [],
  activeEvent: null,
  detailStatus: "idle",
  detailError: null,
  detailRequestId: null,
  status: "idle",
  error: null,
  page: 0,
  totalPages: 0,
  keyword: "",
  classification: "",
};

function mapTicketmasterEvent(event: TicketmasterEvent): EventItem {
  const venue = event._embedded?.venues?.[0];
  const classification = event.classifications?.[0];

  return {
    id: event.id,
    name: event.name,
    date: event.dates?.start?.localDate,
    time: event.dates?.start?.localTime,
    photos: event.images?.[0]?.url,
    url: event.url,
    venue: venue?.name,
    city: venue?.city?.name,
    state: venue?.state?.name,
    country: venue?.country?.name,
    address: venue?.address?.line1,
    classification: classification?.segment?.name ?? "Unknown",
    genre: classification?.genre?.name,
  };
}

async function requestTicketmaster<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Ticketmaster API key is missing. Set VITE_TICKETMASTER_API_KEY and restart Vite.",
    );
  }

  const url = new URL(`https://app.ticketmaster.com/discovery/v2/${path}`);
  url.searchParams.set("apikey", apiKey);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "Event not found."
        : `Ticketmaster request failed (${response.status} ${response.statusText}).`,
    );
  }

  return (await response.json()) as T;
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const fetchEventById = createAsyncThunk<
  EventItem,
  string,
  RejectConfig
>("events/fetchEventById", async (id, { rejectWithValue }) => {
  try {
    const event = await requestTicketmaster<TicketmasterEvent>(
      `events/${encodeURIComponent(id)}.json`,
    );
    return mapTicketmasterEvent(event);
  } catch (error) {
    return rejectWithValue(errorMessage(error, "Failed to load event details."));
  }
});

export const fetchEvents = createAsyncThunk<
  { items: EventItem[]; totalPages: number },
  EventFilters,
  RejectConfig
>("events/fetchEvents", async ({ keyword, classification, page }, { rejectWithValue }) => {
  try {
    const params: Record<string, string> = {
      page: String(page),
      size: "5",
    };
    if (keyword) params.keyword = keyword;
    if (classification) params.classificationName = classification;

    const response = await requestTicketmaster<TicketmasterSearchResponse>(
      "events.json",
      params,
    );
    return {
      items: (response._embedded?.events ?? []).map(mapTicketmasterEvent),
      totalPages: response.page?.totalPages ?? 0,
    };
  } catch (error) {
    return rejectWithValue(errorMessage(error, "Failed to fetch events."));
  }
});

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setKeyword(state, action: PayloadAction<string>) {
      state.keyword = action.payload;
    },
    setClassification(state, action: PayloadAction<string>) {
      state.classification = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventById.pending, (state, action) => {
        state.detailStatus = "loading";
        state.detailError = null;
        state.activeEvent = null;
        state.detailRequestId = action.meta.requestId;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return;
        state.detailStatus = "succeeded";
        state.activeEvent = action.payload;
        state.detailRequestId = null;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return;
        state.detailStatus = "failed";
        state.detailError = action.payload ?? action.error.message ?? "Failed to load event details.";
        state.detailRequestId = null;
      })
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? "Failed to fetch events.";
      });
  },
});

export const { setKeyword, setPage, setClassification } = eventsSlice.actions;
export default eventsSlice.reducer;
