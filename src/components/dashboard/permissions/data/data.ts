import { ModuleType } from '../../roles/data/data';

interface Option {
  label: string;
  value: string;
}

export const httpMethods = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'PATCH', label: 'PATCH' },
] as const;

export const modules: Option[] = [
  { label: 'Users', value: 'users' },
  { label: 'Roles', value: 'roles' },
  { label: 'Products', value: 'products' },
  { label: 'Categories', value: 'categories' },
  { label: 'Orders', value: 'orders' },
  { label: 'Customers', value: 'customers' },
];
