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
};

export type Tenant = {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};
