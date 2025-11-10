import { httpService } from "./http";

export const userApi = {
  getMe: () => httpService.get("/auth/me", { requireToken: true }),

  updateEmail: (payload) =>
    httpService.put("/users/update-email", payload, { requireToken: true }),

  verifyChangeEmail: (token) =>
    httpService.post("/users/verify-change-email", { token }, { requireToken: false }),

  updateProfile: (payload) =>
    httpService.patch("/users/update-profile", payload, { requireToken: true }),

  uploadAvatar: (formData) =>
    httpService.post("/files/upload", formData, {
      requireToken: true,
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
