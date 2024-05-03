import { CreateTenantData, CreateUserData, Credentials } from "../types";
import { api } from "./client";

export const AUTH_SERVICE = "/api/auth";
export const CATALOG_SERVICE = "/api/catalog";

// Auth service
export const login = async (credentials: Credentials) =>
  await api.post(`${AUTH_SERVICE}/auth/login`, credentials);

export const self = async () => await api.get(`${AUTH_SERVICE}/auth/self`);

export const logout = async () => await api.post(`${AUTH_SERVICE}/auth/logout`);

export const getUsers = async (queryString: string) =>
  await api.get(`${AUTH_SERVICE}/users?${queryString}`);

export const getTenants = async (queryString: string) =>
  await api.get(`${AUTH_SERVICE}/tenants?${queryString}`);

export const createUser = async (user: CreateUserData) =>
  await api.post(`${AUTH_SERVICE}/users`, user);

export const createTenant = async (tenant: CreateTenantData) =>
  await api.post(`${AUTH_SERVICE}/tenants`, tenant);

export const updateUser = async (user: CreateUserData, id: string) =>
  await api.patch(`${AUTH_SERVICE}/users/${id}`, user);

export const deleteUser = async (id: string) =>
  await api.delete(`${AUTH_SERVICE}/users/${id}`);

export const updateTenant = async (
  tenant: CreateTenantData,
  tenantId: string
) => await api.patch(`${AUTH_SERVICE}/tenants/${tenantId}`, tenant);

export const deleteTenant = async (tenantId: string) =>
  await api.delete(`${AUTH_SERVICE}/tenants/${tenantId}`);

// Catalog service
export const getCategories = async () =>
  await api.get(`${CATALOG_SERVICE}/categories`);

export const getProducts = async (queryString: string) =>
  await api.get(`${CATALOG_SERVICE}/products?${queryString}`);

export const createProduct = async (product: FormData) =>
  await api.post(`${CATALOG_SERVICE}/products`, product, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getCategory = async (categoryId: string) =>
  await api.get(`${CATALOG_SERVICE}/categories/${categoryId}`);

export const updateProduct = async (product: FormData, productId: string) =>
  await api.put(`${CATALOG_SERVICE}/products/${productId}`, product, {
    headers: { "Content-Type": "multipart/form-data" },
  });
