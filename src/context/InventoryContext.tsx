import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '../api/supabaseClient';
import type { Category, Supplier, Product, Movement } from '../types/inventory';

interface InventoryContextType {
  categories: Category[];
  suppliers: Supplier[];
  products: Product[];
  movements: Movement[];
  loading: boolean;
  error: string | null;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
  updateSupplier: (id: string, supplier: Omit<Supplier, 'id'>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addMovement: (movement: Omit<Movement, 'id' | 'date'>) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// --- Mappers: DB (snake_case) <-> App (camelCase) ---

const productFromDb = (row: any): Product => ({
  id: row.id,
  name: row.name,
  sku: row.sku,
  categoryId: row.category_id,
  supplierId: row.supplier_id,
  purchasePrice: Number(row.purchase_price),
  sellingPrice: Number(row.selling_price),
  stock: row.stock,
  minStock: row.min_stock,
  unit: row.unit
});

const productToDb = (product: Omit<Product, 'id'>) => ({
  name: product.name,
  sku: product.sku,
  category_id: product.categoryId,
  supplier_id: product.supplierId,
  purchase_price: product.purchasePrice,
  selling_price: product.sellingPrice,
  stock: product.stock,
  min_stock: product.minStock,
  unit: product.unit
});

const movementFromDb = (row: any): Movement => ({
  id: row.id,
  productId: row.product_id,
  type: row.type,
  quantity: row.quantity,
  date: row.date,
  reason: row.reason,
  unitPrice: row.unit_price ? Number(row.unit_price) : undefined,
  supplierId: row.supplier_id ?? undefined,
  client: row.client ?? undefined
});

const movementToDb = (movement: Omit<Movement, 'id' | 'date'>) => ({
  product_id: movement.productId,
  type: movement.type,
  quantity: movement.quantity,
  reason: movement.reason,
  unit_price: movement.unitPrice,
  supplier_id: movement.supplierId,
  client: movement.client
});

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);
        const [catsRes, supsRes, prodsRes, movsRes] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('suppliers').select('*'),
          supabase.from('products').select('*'),
          supabase.from('movements').select('*').order('date', { ascending: false })
        ]);

        if (catsRes.error) throw catsRes.error;
        if (supsRes.error) throw supsRes.error;
        if (prodsRes.error) throw prodsRes.error;
        if (movsRes.error) throw movsRes.error;

        setCategories(catsRes.data as Category[]);
        setSuppliers(supsRes.data as Supplier[]);
        setProducts((prodsRes.data ?? []).map(productFromDb));
        setMovements((movsRes.data ?? []).map(movementFromDb));
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données depuis Supabase. Vérifie ta connexion et tes clés API.");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // --- Catégories ---
  const addCategory = async (category: Omit<Category, 'id'>) => {
    const { data, error } = await supabase.from('categories').insert(category).select().single();
    if (error) throw error;
    setCategories(prev => [...prev, data as Category]);
  };

  const updateCategory = async (id: string, category: Omit<Category, 'id'>) => {
    const { data, error } = await supabase.from('categories').update(category).eq('id', id).select().single();
    if (error) throw error;
    setCategories(prev => prev.map(c => (c.id === id ? (data as Category) : c)));
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // --- Fournisseurs ---
  const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    const { data, error } = await supabase.from('suppliers').insert(supplier).select().single();
    if (error) throw error;
    setSuppliers(prev => [...prev, data as Supplier]);
  };

  const updateSupplier = async (id: string, supplier: Omit<Supplier, 'id'>) => {
    const { data, error } = await supabase.from('suppliers').update(supplier).eq('id', id).select().single();
    if (error) throw error;
    setSuppliers(prev => prev.map(s => (s.id === id ? (data as Supplier) : s)));
  };

  const deleteSupplier = async (id: string) => {
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) throw error;
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  // --- Produits ---
  const addProduct = async (product: Omit<Product, 'id'>) => {
    const { data, error } = await supabase.from('products').insert(productToDb(product)).select().single();
    if (error) throw error;
    setProducts(prev => [...prev, productFromDb(data)]);
  };

  const updateProduct = async (id: string, product: Omit<Product, 'id'>) => {
    const { data, error } = await supabase.from('products').update(productToDb(product)).eq('id', id).select().single();
    if (error) throw error;
    setProducts(prev => prev.map(p => (p.id === id ? productFromDb(data) : p)));
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // --- Mouvements (+ mise à jour du stock associé) ---
  const addMovement = async (movement: Omit<Movement, 'id' | 'date'>) => {
    const { data, error } = await supabase.from('movements').insert(movementToDb(movement)).select().single();
    if (error) throw error;
    const createdMovement = movementFromDb(data);
    setMovements(prev => [createdMovement, ...prev]);

    const product = products.find(p => p.id === movement.productId);
    if (product) {
      const stockChange = movement.type === 'IN' ? movement.quantity : -movement.quantity;
      const newStock = product.stock + stockChange;
      const { data: updatedProductRow, error: stockError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', product.id)
        .select()
        .single();
      if (stockError) throw stockError;
      setProducts(prev => prev.map(p => (p.id === product.id ? productFromDb(updatedProductRow) : p)));
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        categories, suppliers, products, movements, loading, error,
        addCategory, updateCategory, deleteCategory,
        addSupplier, updateSupplier, deleteSupplier,
        addProduct, updateProduct, deleteProduct,
        addMovement
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};