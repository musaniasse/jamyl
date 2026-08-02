import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription } from
'../components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'../components/ui/Select';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { PackageMinus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const currency = (value: number) =>
value.toLocaleString('fr-FR', {
  style: 'currency',
  currency: 'XOF',
  maximumFractionDigits: 0
});

const emptyForm = {
  productId: '',
  client: '',
  quantity: 1,
  unitPrice: 0,
  date: new Date().toISOString().slice(0, 10)
};

export function StockExit() {
  const { products, movements, addMovement, updateMovement, deleteMovement } = useInventory();
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === formData.productId);
  const amount = (formData.quantity || 0) * (formData.unitPrice || 0);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleProductChange = (v: string) => {
    const product = products.find((p) => p.id === v);
    setFormData({
      ...formData,
      productId: v,
      // Pré-remplit avec le prix de vente du produit (uniquement en création)
      unitPrice: !editingId && product ? product.sellingPrice : formData.unitPrice
    });
  };

  // Stock réellement disponible pour la vérification :
  // en édition, il faut "rendre" la quantité déjà sortie par ce mouvement avant de comparer
  const availableStock = (() => {
    if (!selectedProduct) return 0;
    if (editingId) {
      const original = movements.find((m) => m.id === editingId);
      if (original && original.productId === selectedProduct.id) {
        return selectedProduct.stock + original.quantity;
      }
    }
    return selectedProduct.stock;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !formData.client) {
      toast.error('Veuillez sélectionner un article et renseigner le client.');
      return;
    }
    if (selectedProduct && formData.quantity > availableStock) {
      toast.error(
        `Stock insuffisant : il reste ${availableStock} ${selectedProduct.unit} disponible${availableStock > 1 ? 's' : ''}.`
      );
      return;
    }

    try {
      if (editingId) {
        await updateMovement(editingId, {
          productId: formData.productId,
          client: formData.client,
          type: 'OUT',
          quantity: formData.quantity,
          unitPrice: formData.unitPrice,
          date: new Date(formData.date).toISOString(),
          reason: 'Sortie de stock (fiche)'
        });
        toast.success('Fiche de sortie mise à jour avec succès');
      } else {
        await addMovement({
          productId: formData.productId,
          client: formData.client,
          type: 'OUT',
          quantity: formData.quantity,
          unitPrice: formData.unitPrice,
          reason: 'Sortie de stock (fiche)'
        });
        toast.success('Fiche de sortie enregistrée avec succès');
      }
      resetForm();
    } catch (err) {
      toast.error("Une erreur est survenue lors de l'enregistrement.");
    }
  };

  const handleEdit = (movementId: string) => {
    const m = movements.find((mv) => mv.id === movementId);
    if (!m) return;
    setFormData({
      productId: m.productId,
      client: m.client || '',
      quantity: m.quantity,
      unitPrice: m.unitPrice || 0,
      date: new Date(m.date).toISOString().slice(0, 10)
    });
    setEditingId(movementId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const requestDelete = (movementId: string) => {
    setDeleteTargetId(movementId);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteMovement(deleteTargetId);
      toast.success('Sortie supprimée avec succès');
      if (editingId === deleteTargetId) resetForm();
    } catch (err) {
      toast.error("Une erreur est survenue lors de la suppression.");
    } finally {
      setDeleteTargetId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteTargetId(null);
  };

  const stockExits = movements.
  filter((m) => m.type === 'OUT').
  sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalExits = stockExits.reduce(
    (acc, m) => acc + (m.unitPrice || 0) * m.quantity,
    0
  );

  const productBeingDeleted = deleteTargetId
    ? products.find((p) => p.id === movements.find((m) => m.id === deleteTargetId)?.productId)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Fiche de sortie de stock
        </h1>
        <p className="text-muted-foreground mt-1">
          Enregistrez une vente ou une sortie de marchandise vers un client.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageMinus className="h-5 w-5" />
            {editingId ? 'Modifier la sortie' : 'Nouvelle sortie'}
          </CardTitle>
          <CardDescription>
            Le montant total est calculé automatiquement (quantité × prix
            unitaire).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product">Article</Label>
                <Select
                  value={formData.productId}
                  onValueChange={handleProductChange}>
                  
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Sélectionner un article" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) =>
                    <SelectItem key={p.id} value={p.id}>
                        {p.name} (stock : {p.stock})
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    client: e.target.value
                  })
                  }
                  placeholder="Ex : Boutique du Centre"
                  required />
                
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value) || 0
                  })
                  }
                  required />
                
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Prix unitaire (F CFA)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="1"
                  min="0"
                  value={formData.unitPrice}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    unitPrice: parseFloat(e.target.value) || 0
                  })
                  }
                  required />
                
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    date: e.target.value
                  })
                  }
                  required />
                
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Montant total</Label>
                <Input
                  id="amount"
                  value={currency(amount)}
                  readOnly
                  className="font-medium bg-muted" />
                
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {editingId &&
              <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" /> Annuler
                </Button>
              }
              <Button type="submit">
                <PackageMinus className="mr-2 h-4 w-4" />
                {editingId ? 'Mettre à jour la sortie' : 'Enregistrer la sortie'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des sorties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Article</TableHead>
                  <TableHead className="hidden md:table-cell">Client</TableHead>
                  <TableHead className="text-right">Qté</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">
                    Prix U.
                  </TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockExits.length === 0 ?
                <TableRow>
                    <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-8">
                    
                      Aucune sortie enregistrée pour le moment.
                    </TableCell>
                  </TableRow> :

                stockExits.map((m) => {
                  const product = products.find((p) => p.id === m.productId);
                  const lineAmount = (m.unitPrice || 0) * m.quantity;
                  return (
                    <TableRow key={m.id} className={editingId === m.id ? 'bg-muted/50' : undefined}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(m.date).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{product?.name || 'Inconnu'}</span>
                            <span className="md:hidden text-xs text-muted-foreground">
                              {m.client || '—'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {m.client || '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          {m.quantity}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-right">
                          {m.unitPrice != null ? currency(m.unitPrice) : '—'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {m.unitPrice != null ? currency(lineAmount) : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(m.id)}
                              aria-label="Modifier">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => requestDelete(m.id)}
                              aria-label="Supprimer">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>);

                })
                }
                {stockExits.length > 0 &&
                <TableRow className="bg-muted/50">
                    <TableCell colSpan={3} className="md:hidden font-medium">
                      Total
                    </TableCell>
                    <TableCell
                    colSpan={5}
                    className="hidden md:table-cell font-medium">
                    
                      Total des sorties valorisées
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {currency(totalExits)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                }
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteTargetId !== null}
        title="Supprimer cette sortie ?"
        description={
          productBeingDeleted
            ? `Cette action supprimera la sortie de stock pour "${productBeingDeleted.name}" et restaurera la quantité au stock. Cette action est irréversible.`
            : "Cette action supprimera la sortie de stock et restaurera la quantité au stock. Cette action est irréversible."
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="destructive"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>);

}