export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface StoredUser {
  profile: UserProfile;
  salt: string;
  passwordHash: string;
}

function isStoredUser(value: unknown): value is StoredUser {
  if (typeof value !== "object" || value === null || !("profile" in value)) {
    return false;
  }
  const profile = value.profile;
  return (
    typeof profile === "object" &&
    profile !== null &&
    "id" in profile &&
    "name" in profile &&
    "email" in profile &&
    typeof profile.id === "string" &&
    typeof profile.name === "string" &&
    typeof profile.email === "string" &&
    "salt" in value &&
    typeof value.salt === "string" &&
    "passwordHash" in value &&
    typeof value.passwordHash === "string"
  );
}

const USERS_KEY = "event-app-users";
const SESSION_KEY = "event-app-session";
const DEMO_ACCOUNT = {
  name: "Demo User",
  email: "demo@dev.dev",
  password: "1234567890",
};

function readUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];

  const users: unknown = JSON.parse(raw);
  if (!Array.isArray(users) || !users.every(isStoredUser)) {
    throw new Error("Saved account data is invalid. Clear local site data and try again.");
  }
  return users;
}

function createSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const digest = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 310_000,
      hash: "SHA-256",
    },
    passwordKey,
    256,
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function saveSession(profile: UserProfile): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
}

export function loadSavedSession(): UserProfile | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  const value: unknown = JSON.parse(raw);
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    !("name" in value) ||
    !("email" in value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.email !== "string"
  ) {
    throw new Error("Saved session data is invalid. Sign in again.");
  }
  return { id: value.id, name: value.name, email: value.email };
}

export async function registerDemoUser(
  name: string,
  email: string,
  password: string,
): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();

  if (users.some((user) => user.profile.email === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const profile: UserProfile = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
  };
  const salt = createSalt();
  const passwordHash = await hashPassword(password, salt);

  localStorage.setItem(
    USERS_KEY,
    JSON.stringify([...users, { profile, salt, passwordHash } satisfies StoredUser]),
  );
  saveSession(profile);
  return profile;
}

export async function loginDemoUser(
  email: string,
  password: string,
): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  let users = readUsers();
  let user = users.find(
    (savedUser) => savedUser.profile.email === normalizedEmail,
  );

  if (
    !user &&
    normalizedEmail === DEMO_ACCOUNT.email &&
    password === DEMO_ACCOUNT.password
  ) {
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      name: DEMO_ACCOUNT.name,
      email: DEMO_ACCOUNT.email,
    };
    const salt = createSalt();
    const passwordHash = await hashPassword(DEMO_ACCOUNT.password, salt);
    const demoUser: StoredUser = { profile, salt, passwordHash };

    users = [...users, demoUser];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    user = demoUser;
  }

  if (!user || (await hashPassword(password, user.salt)) !== user.passwordHash) {
    throw new Error("Email or password is incorrect.");
  }

  saveSession(user.profile);
  return user.profile;
}

export function clearSavedSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
