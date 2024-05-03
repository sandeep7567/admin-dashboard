export type Credentials = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  tenant: Tenant | null;
};

export type CreateUserData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  tenantId: number;
};

export type Tenant = {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTenantData = {
  name: string;
  address: string;
};

export type QueryParams = {
  currentPage: number;
  perPage: number;
  q?: string;
  role?: string;
  isPublish?: boolean;
  tenantId?: number;
};

export type FieldData = {
  name: string[];
  value?: string;
};

export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "additional";
    availableOptions: string[];
  };
}

export interface Attribute {
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  availableOptions: string[];
}

export type Category = {
  _id: string;
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
};

export type ProductAttribute = {
  name: string;
  value: string | boolean;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  isPublish: boolean;
  image: string;
  priceConfiguration: PriceConfiguration;
  attributes: ProductAttribute[];
  category: Category;
  createdAt: string;
};

export type ImageField = {
  file: File;
};

export type CreateProductData = Product & { image: ImageField };
