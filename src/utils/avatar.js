const API_BASE = import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, "");

export function resolveAvatar(avatar, name = "User") {
  // 1. kosong → fallback
  if (!avatar) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name,
    )}&background=6366f1&color=fff&bold=true`;
  }

  // 2. SUDAH URL → PAKE LANGSUNG
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }

  // 3. filename → prepend storage
  return `${API_BASE}/storage/avatars/${avatar}`;
}