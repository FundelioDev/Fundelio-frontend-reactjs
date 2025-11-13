import { httpService } from "./http";

export const userApi = {
  getMe: () => httpService.get("/auth/me"),

  updateEmail: (payload) =>
    httpService.put("/users/update-email", payload),

    verifyChangeEmail(payload) {
    return httpService.post('/users/verify-change-email', payload, {
      requireToken: true,
    });
  },

  updateProfile: (payload) =>
    httpService.patch("/users/update-profile", payload),

  uploadAvatar: (formData) =>
    httpService.post("/files/upload", formData, {
      requireToken: true,
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updatePassword: (payload) =>
    httpService.put("/users/update-password", payload),
};