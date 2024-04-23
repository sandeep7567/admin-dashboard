import { CreateUserData, Credentials } from "../types";
import { api } from "./client";

// Auth service
export const login = async (credentials: Credentials) =>
  await api.post(`/auth/login`, credentials);

export const self = async () => await api.get(`/auth/self`);

export const logout = async () => await api.post(`/auth/logout`);

export const getUsers = async () => await api.get(`/users`);

export const getTenants = async () => await api.get(`/tenants`);

export const createUser = async (user: CreateUserData) =>
  await api.post(`/users`, user);
