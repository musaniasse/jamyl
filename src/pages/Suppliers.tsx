import React, { useState } from 'react';
import { useInventory, Supplier } from '../context/InventoryContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle } from
'../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { toast } from 'sonner';
export function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } =
  useInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    contact: '',
    email: '',
    phone: ''
  });
  const handleOpenDialog = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData(supplier);
    } else {
      setEditingSupplier(null);
      setFormData({
        name: '',
        contact: '',
        email: '',
        phone: ''
      });
    }
    setIsDialogOpen(true);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, formData as Omit<Supplier, 'id'>);
      toast.success('Fournisseur mis à jour');
    } else {
      addSupplier(formData as Omit<Supplier, 'id'>);
      toast.success('Fournisseur ajouté');
    }
    setIsDialogOpen(false);
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer ce fournisseur ?')) {
      deleteSupplier(id);
      toast.success('Fournisseur supprimé');
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Fournisseurs
        </h1>
        <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Ajouter un fournisseur
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead className="hidden sm:table-cell">Contact</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden sm:table-cell">Téléphone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) =>
            <TableRow key={supplier.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{supplier.name}</span>
                    <span className="sm:hidden text-xs text-muted-foreground">
                      {supplier.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {supplier.contact}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                    {supplier.email}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex items-center">
                    <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                    {supplier.phone}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenDialog(supplier)}>
                  
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(supplier.id)}>
                  
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ?
              'Modifier le fournisseur' :
              'Ajouter un fournisseur'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'entreprise</Label>
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
              <Label htmlFor="contact">Nom du contact</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: e.target.value
                })
                }
                required />
              
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value
                })
                }
                required />
              
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value
                })
                }
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