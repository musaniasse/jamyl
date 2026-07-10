import React, { useState } from 'react';
import { useInventory, MovementType } from '../context/InventoryContext';
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
import { Plus, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle } from
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
export function Movements() {
  const { movements, products, addMovement } = useInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    type: 'IN' as MovementType,
    quantity: 1,
    reason: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMovement(formData);
    toast.success('Mouvement enregistré avec succès');
    setIsDialogOpen(false);
    setFormData({
      productId: '',
      type: 'IN',
      quantity: 1,
      reason: ''
    });
  };
  const sortedMovements = [...movements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Mouvements de Stock
        </h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="w-full sm:w-auto">
          
          <Plus className="mr-2 h-4 w-4" /> Nouveau Mouvement
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead className="text-right">Qté</TableHead>
              <TableHead className="hidden md:table-cell">Motif</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMovements.map((movement) => {
              const product = products.find((p) => p.id === movement.productId);
              return (
                <TableRow key={movement.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(movement.date).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {movement.type === 'IN' ?
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <ArrowDownRight className="mr-1 h-3 w-3" /> Entrée
                      </Badge> :

                    <Badge
                      variant="destructive"
                      className="bg-red-100 text-red-800 hover:bg-red-100">
                      
                        <ArrowUpRight className="mr-1 h-3 w-3" /> Sortie
                      </Badge>
                    }
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{product?.name || 'Inconnu'}</span>
                      <span className="sm:hidden text-xs text-muted-foreground">
                        {movement.type === 'IN' ? 'Entrée' : 'Sortie'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell
                    className={`text-right ${movement.type === 'IN' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}`}>
                    
                    {movement.type === 'IN' ? '+' : '-'}
                    {movement.quantity}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {movement.reason}
                  </TableCell>
                </TableRow>);

            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un mouvement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de mouvement</Label>
              <Select
                value={formData.type}
                onValueChange={(v: MovementType) =>
                setFormData({
                  ...formData,
                  type: v
                })
                }>
                
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">
                    Entrée (Réception, Retour...)
                  </SelectItem>
                  <SelectItem value="OUT">Sortie (Vente, Perte...)</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) =>
                  <SelectItem key={p.id} value={p.id}>
                      {p.name} (Stock: {p.stock})
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
                  quantity: parseInt(e.target.value)
                })
                }
                required />
              
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Motif</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  reason: e.target.value
                })
                }
                placeholder="Ex: Commande #123"
                required />
              
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