import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { api } from '../api/client';
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

const generateId = () => Math.random().toString(36).substr(2, 9);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement initial de toutes les données
  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);
        const [cats, sups, prods, movs] = await Promise.all([
          api.get<Category[]>('/categories'),
          api.get<Supplier[]>('/suppliers'),
          api.get<Product[]>('/products'),
          api.get<Movement[]>('/movements')
        ]);
        setCategories(cats);
        setSuppliers(sups);
        setProducts(prods);
        setMovements(movs);
        setError(null);
      } catch (err) {
        setError("Impossible de charger les données. Vérifie que json-server tourne (npm run api).");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // --- Catégories ---
  const addCategory = async (category: Omit<Category, 'id'>) => {
    const created = await api.post<Category>('/categories', { ...category, id: generateId() });
    setCategories(prev => [...prev, created]);
  };

  const updateCategory = async (id: string, category: Omit<Category, 'id'>) => {
    const updated = await api.patch<Category>(`/categories/${id}`, category);
    setCategories(prev => prev.map(c => (c.id === id ? updated : c)));
  };

  const deleteCategory = async (id: string) => {
    await api.delete(`/categories/${id}`);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // --- Fournisseurs ---
  const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    const created = await api.post<Supplier>('/suppliers', { ...supplier, id: generateId() });
    setSuppliers(prev => [...prev, created]);
  };

  const updateSupplier = async (id: string, supplier: Omit<Supplier, 'id'>) => {
    const updated = await api.patch<Supplier>(`/suppliers/${id}`, supplier);
    setSuppliers(prev => prev.map(s => (s.id === id ? updated : s)));
  };

  const deleteSupplier = async (id: string) => {
    await api.delete(`/suppliers/${id}`);
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  // --- Produits ---
  const addProduct = async (product: Omit<Product, 'id'>) => {
    const created = await api.post<Product>('/products', { ...product, id: generateId() });
    setProducts(prev => [...prev, created]);
  };

  const updateProduct = async (id: string, product: Omit<Product, 'id'>) => {
    const updated = await api.patch<Product>(`/products/${id}`, product);
    setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
  };

  const deleteProduct = async (id: string) => {
    await api.delete(`/products/${id}`);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // --- Mouvements (+ mise à jour du stock associé) ---
  const addMovement = async (movement: Omit<Movement, 'id' | 'date'>) => {
    const newMovement = { ...movement, id: generateId(), date: new Date().toISOString() };
    const createdMovement = await api.post<Movement>('/movements', newMovement);
    setMovements(prev => [createdMovement, ...prev]);

    const product = products.find(p => p.id === movement.productId);
    if (product) {
      const stockChange = movement.type === 'IN' ? movement.quantity : -movement.quantity;
      const updatedProduct = await api.patch<Product>(`/products/${product.id}`, {
        stock: product.stock + stockChange
      });
      setProducts(prev => prev.map(p => (p.id === product.id ? updatedProduct : p)));
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