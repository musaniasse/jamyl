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
import { PackagePlus } from 'lucide-react';
import { toast } from 'sonner';
const currency = (value: number) =>
value.toLocaleString('fr-FR', {
  style: 'currency',
  currency: 'EUR'
});
export function StockEntry() {
  const { products, suppliers, movements, addMovement } = useInventory();
  const [formData, setFormData] = useState({
    productId: '',
    supplierId: '',
    quantity: 1,
    unitPrice: 0,
    date: new Date().toISOString().slice(0, 10)
  });
  const amount = (formData.quantity || 0) * (formData.unitPrice || 0);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !formData.supplierId) {
      toast.error('Veuillez sélectionner un produit et un fournisseur.');
      return;
    }
    addMovement({
      productId: formData.productId,
      supplierId: formData.supplierId,
      type: 'IN',
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      reason: 'Entrée de stock (fiche)'
    });
    toast.success("Fiche d'entrée enregistrée avec succès");
    setFormData({
      productId: '',
      supplierId: '',
      quantity: 1,
      unitPrice: 0,
      date: new Date().toISOString().slice(0, 10)
    });
  };
  const stockEntries = movements.
  filter((m) => m.type === 'IN').
  sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalEntries = stockEntries.reduce(
    (acc, m) => acc + (m.unitPrice || 0) * m.quantity,
    0
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Fiche d'entrée de stock
        </h1>
        <p className="text-muted-foreground mt-1">
          Enregistrez une réception de marchandise auprès d'un fournisseur.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackagePlus className="h-5 w-5" /> Nouvelle entrée
          </CardTitle>
          <CardDescription>
            Le montant est calculé automatiquement (quantité × prix unitaire).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product">Produit</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    productId: v
                  })
                  }>
                  
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) =>
                    <SelectItem key={p.id} value={p.id}>
                        {p.name}
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
                  
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder="Sélectionner un fournisseur" />
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
                <Label htmlFor="unitPrice">Prix unitaire (€)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
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
                <Label htmlFor="amount">Montant</Label>
                <Input
                  id="amount"
                  value={currency(amount)}
                  readOnly
                  className="font-medium bg-muted" />
                
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                <PackagePlus className="mr-2 h-4 w-4" /> Enregistrer l'entrée
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des entrées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Fournisseur
                  </TableHead>
                  <TableHead className="text-right">Qté</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">
                    Prix U.
                  </TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockEntries.length === 0 ?
                <TableRow>
                    <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8">
                    
                      Aucune entrée enregistrée pour le moment.
                    </TableCell>
                  </TableRow> :

                stockEntries.map((m) => {
                  const product = products.find((p) => p.id === m.productId);
                  const supplier = suppliers.find(
                    (s) => s.id === m.supplierId
                  );
                  const lineAmount = (m.unitPrice || 0) * m.quantity;
                  return (
                    <TableRow key={m.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(m.date).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{product?.name || 'Inconnu'}</span>
                            <span className="md:hidden text-xs text-muted-foreground">
                              {supplier?.name || '—'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {supplier?.name || '—'}
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
                      </TableRow>);

                })
                }
                {stockEntries.length > 0 &&
                <TableRow className="bg-muted/50">
                    <TableCell colSpan={3} className="md:hidden font-medium">
                      Total
                    </TableCell>
                    <TableCell
                    colSpan={5}
                    className="hidden md:table-cell font-medium">
                    
                      Total des entrées valorisées
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {currency(totalEntries)}
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>);

}