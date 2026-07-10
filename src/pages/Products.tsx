import React, { useState } from 'react';
import { useInventory, Product } from '../context/InventoryContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger } from
'../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'../components/ui/Select';
import { toast } from 'sonner';
export function Products() {
  const {
    products,
    categories,
    suppliers,
    addProduct,
    updateProduct,
    deleteProduct
  } = useInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    categoryId: '',
    supplierId: '',
    purchasePrice: 0,
    sellingPrice: 0,
    stock: 0,
    minStock: 0,
    unit: 'pièce'
  });
  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: '',
        categoryId: '',
        supplierId: '',
        purchasePrice: 0,
        sellingPrice: 0,
        stock: 0,
        minStock: 0,
        unit: 'pièce'
      });
    }
    setIsDialogOpen(true);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData as Omit<Product, 'id'>);
      toast.success('Produit mis à jour avec succès');
    } else {
      addProduct(formData as Omit<Product, 'id'>);
      toast.success('Produit ajouté avec succès');
    }
    setIsDialogOpen(false);
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct(id);
      toast.success('Produit supprimé');
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Produits
        </h1>
        <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden md:table-cell">SKU</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead className="hidden sm:table-cell">Catégorie</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="hidden md:table-cell">Prix Achat</TableHead>
              <TableHead className="hidden sm:table-cell">Prix Vente</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const category = categories.find(
                (c) => c.id === product.categoryId
              );
              const isLowStock = product.stock <= product.minStock;
              return (
                <TableRow key={product.id}>
                  <TableCell className="hidden md:table-cell font-medium">
                    {product.sku}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {category?.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={isLowStock ? 'destructive' : 'secondary'}>
                      {product.stock} {product.unit}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.purchasePrice.toFixed(2)} €
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {product.sellingPrice.toFixed(2)} €
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(product)}>
                      
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}>
                      
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>);

            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value
                  })
                  }
                  required />
                
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU / Référence</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    sku: e.target.value
                  })
                  }
                  required />
                
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    categoryId: v
                  })
                  }>
                  
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) =>
                    <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Fournisseur</Label>
                <Select
                  value={formData.supplierId}
                  onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    supplierId: v
                  })
                  }>
                  
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) =>
                    <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Prix d'achat (€)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    purchasePrice: parseFloat(e.target.value)
                  })
                  }
                  required />
                
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Prix de vente (€)</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    sellingPrice: parseFloat(e.target.value)
                  })
                  }
                  required />
                
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock actuel</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: parseInt(e.target.value)
                  })
                  }
                  required
                  disabled={!!editingProduct} />
                
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Seuil d'alerte</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    minStock: parseInt(e.target.value)
                  })
                  }
                  required />
                
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}>
                
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>);

}