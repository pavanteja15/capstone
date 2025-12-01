import { UserResponse } from "../types/user";
import { UserState } from "../store/userSlice";

const normalizeAccountType = (value?: string): UserState["accountType"] =>
  value?.toUpperCase() === "BUSINESS" ? "BUSINESS" : "USER";

export const normalizeUserPayload = (
  data: UserResponse | null | undefined,
  fallback: UserState
): Partial<UserState> => {
  const fallbackUsername = fallback.username || fallback.name || "";
  const apiUsername = data?.username ?? (data as any)?.name ?? data?.name;

  return {
    userId: data?.userId ?? fallback.userId,
    name: data?.name ?? fallback.name ?? apiUsername ?? fallbackUsername,
    username: apiUsername ?? fallbackUsername,
    email: data?.email ?? fallback.email,
    mobile: data?.mobile ?? fallback.mobile,
    bio: data?.bio ?? data?.description ?? fallback.bio,
    profilePath: data?.profilePath ?? (data as any)?.profilePicUrl ?? fallback.profilePath,
    accountType: normalizeAccountType(data?.accountType ?? fallback.accountType),
    businessName: data?.businessName ?? fallback.businessName,
    websiteUrl: data?.websiteUrl ?? fallback.websiteUrl,
    description: data?.description ?? fallback.description,
  };
};

export const mapMediaPath = (
  path?: string | null,
  apiBase = "http://localhost:8765"
): string | undefined => {
  if (!path) {
    return undefined;
  }
  if (path.startsWith("http")) {
    return path;
  }
  if (path.startsWith("/assets")) {
    return path;
  }
  const normalized = path.replace(/\\/g, "/");
  if (normalized.includes(":")) {
    const uploadsIndex = normalized.indexOf("/uploads/");
    if (uploadsIndex !== -1) {
      const relative = normalized.substring(uploadsIndex).replace(/^\//, "");
      return `${apiBase}/${relative}`;
    }
    return undefined;
  }
  return `${apiBase}/${normalized.replace(/^\//, "")}`;
};
