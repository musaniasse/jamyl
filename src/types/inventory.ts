export type Category = {
  id: string;
  name: string;
};

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  supplierId: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  unit: string;
};

export type MovementType = 'IN' | 'OUT';

export type Movement = {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  date: string;
  reason: string;
  unitPrice?: number;
  supplierId?: string;
  client?: string;
};