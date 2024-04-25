import { CreateTenantData, CreateUserData, Credentials } from "../types";
import { api } from "./client";

// Auth service
export const login = async (credentials: Credentials) =>
  await api.post(`/auth/login`, credentials);

export const self = async () => await api.get(`/auth/self`);

export const logout = async () => await api.post(`/auth/logout`);

export const getUsers = async (queryString: string) =>
  await api.get(`/users?${queryString}`);

export const getTenants = async (queryString: string) =>
  await api.get(`/tenants?${queryString}`);

export const createUser = async (user: CreateUserData) =>
  await api.post(`/users`, user);

export const createTenant = async (tenant: CreateTenantData) =>
  await api.post(`/tenants`, tenant);

export const updateUser = async (user: CreateUserData, id: string) =>
  await api.patch(`/users/${id}`, user);

export const deleteUser = async (id: string) =>
  await api.delete(`/users/${id}`);
