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

export interface ShipmentFees {
  dpiFees: number;
  bankFees: number;
  franceTransportFees: number;
  maritimeFees: number;
  customsFees: number;
  exploitationDocFees: number;
  airFees: number;
  pickupToPortFees: number;
  gpToHomeFees: number;
}

export interface ShipmentItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPurchasePrice: number;
  totalPurchaseValue: number;
  allocatedFees: number;
  costPricePerUnit: number;
}

export interface Shipment {
  id: string;
  reference: string;
  date: string;
  fees: ShipmentFees;
  items: ShipmentItem[];
  totalFees: number;
  totalPurchaseValue: number;
  totalCost: number;
}