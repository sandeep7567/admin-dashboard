import { Credentials } from "../types";
import { api } from "./client";

// Auth service
export const login = async (credentials: Credentials) =>
  await api.post(`/auth/login`, credentials);

export const self = async () => await api.get(`/auth/self`);

export const logout = async () => await api.post(`/auth/logout`);
