import { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useShipments } from '../context/ShipmentContext';
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
import { Calculator, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import type { ShipmentItem } from '../types/inventory';

const currency = (value: number) =>
value.toLocaleString('fr-FR', {
  style: 'currency',
  currency: 'XOF',
  maximumFractionDigits: 0
});

interface DraftItem {
  productId: string;
  quantity: number;
  unitPurchasePrice: number;
}

const emptyFees = {
  dpiFees: 0,
  bankFees: 0,
  franceTransportFees: 0,
  maritimeFees: 0,
  customsFees: 0,
  exploitationDocFees: 0,
  airFees: 0,
  pickupToPortFees: 0,
  gpToHomeFees: 0
};

const feeLabels: { key: keyof typeof emptyFees; label: string }[] = [
  { key: 'dpiFees', label: 'Frais de DPI' },
  { key: 'bankFees', label: 'Frais bancaires' },
  { key: 'franceTransportFees', label: 'Frais transport en France' },
  { key: 'maritimeFees', label: 'Frais maritime' },
  { key: 'customsFees', label: 'Frais de dédouanement' },
  { key: 'exploitationDocFees', label: "Frais document d'exploitation" },
  { key: 'airFees', label: 'Frais aérien' },
  { key: 'pickupToPortFees', label: 'Livraison ramassage → port France' },
  { key: 'gpToHomeFees', label: 'Livraison point GP → domicile' }
];

export function CostCalculator() {
  const { products } = useInventory();
  const { shipments, addShipment, deleteShipment } = useShipments();

  const [reference, setReference] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [fees, setFees] = useState(emptyFees);
  const [items, setItems] = useState<DraftItem[]>([
    { productId: '', quantity: 1, unitPurchasePrice: 0 }
  ]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const totalFees = Object.values(fees).reduce((acc, v) => acc + (v || 0), 0);
  const totalPurchaseValue = items.reduce(
    (acc, it) => acc + (it.quantity || 0) * (it.unitPurchasePrice || 0),
    0
  );
  const totalCost = totalFees + totalPurchaseValue;

  const computedItems: ShipmentItem[] = items
    .filter((it) => it.productId && it.quantity > 0)
    .map((it) => {
      const product = products.find((p) => p.id === it.productId);
      const itemValue = it.quantity * it.unitPurchasePrice;
      const share = totalPurchaseValue > 0 ? itemValue / totalPurchaseValue : 0;
      const allocatedFees = totalFees * share;
      const costPricePerUnit = it.quantity > 0 ? (itemValue + allocatedFees) / it.quantity : 0;
      return {
        productId: it.productId,
        productName: product?.name || 'Inconnu',
        quantity: it.quantity,
        unitPurchasePrice: it.unitPurchasePrice,
        totalPurchaseValue: itemValue,
        allocatedFees,
        costPricePerUnit
      };
    });

  const handleFeeChange = (key: keyof typeof emptyFees, value: string) => {
    setFees((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handleItemChange = (index: number, patch: Partial<DraftItem>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    handleItemChange(index, {
      productId,
      unitPurchasePrice: product ? product.purchasePrice : 0
    });
  };

  const addItemRow = () => {
    setItems((prev) => [...prev, { productId: '', quantity: 1, unitPurchasePrice: 0 }]);
  };

  const removeItemRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setReference('');
    setDate(new Date().toISOString().slice(0, 10));
    setFees(emptyFees);
    setItems([{ productId: '', quantity: 1, unitPurchasePrice: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) {
      toast.error('Veuillez renseigner une référence pour ce lot.');
      return;
    }
    if (computedItems.length === 0) {
      toast.error('Veuillez ajouter au moins un article valide.');
      return;
    }

    try {
      await addShipment({
        reference,
        date,
        fees,
        items: computedItems,
        totalFees,
        totalPurchaseValue,
        totalCost
      });
      toast.success('Calcul de revient enregistré avec succès');
      resetForm();
    } catch (err) {
      toast.error("Une erreur est survenue lors de l'enregistrement.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteShipment(deleteTargetId);
      toast.success("Entrée d'historique supprimée");
    } catch (err) {
      toast.error('Une erreur est survenue lors de la suppression.');
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prix de revient</h1>
        <p className="text-muted-foreground mt-1">
          Calculez le coût de revient réel de vos marchandises en répartissant les frais d'un lot entre les articles concernés.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" /> Nouveau calcul
          </CardTitle>
          <CardDescription>
            Les frais du lot sont répartis entre les articles au prorata de leur valeur d'achat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reference">Référence du lot</Label>
                <Input
                  id="reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ex : Expédition Chine - Janvier 2026"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Frais du lot (F CFA)</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {feeLabels.map(({ key, label }) => (
                  <div className="space-y-2" key={key}>
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      type="number"
                      min="0"
                      step="1"
                      value={fees[key]}
                      onChange={(e) => handleFeeChange(key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Total des frais : <span className="font-medium text-foreground">{currency(totalFees)}</span>
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Articles du lot</h3>
                <Button type="button" variant="outline" size="sm" onClick={addItemRow}>
                  <Plus className="mr-2 h-4 w-4" /> Ajouter un article
                </Button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="grid gap-3 sm:grid-cols-[1fr_120px_140px_auto] items-end border rounded-md p-3">
                    <div className="space-y-2">
                      <Label>Produit</Label>
                      <Select
                        value={item.productId}
                        onValueChange={(v) => handleProductSelect(index, v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un produit" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Quantité</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, { quantity: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prix d'achat unit.</Label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={item.unitPurchasePrice}
                        onChange={(e) =>
                          handleItemChange(index, { unitPurchasePrice: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItemRow(index)}
                      disabled={items.length === 1}
                      aria-label="Retirer cet article">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {computedItems.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">Aperçu du calcul</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead className="text-right">Qté</TableHead>
                        <TableHead className="text-right">Valeur d'achat</TableHead>
                        <TableHead className="text-right">Part des frais</TableHead>
                        <TableHead className="text-right">Revient unitaire</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {computedItems.map((it, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{it.productName}</TableCell>
                          <TableCell className="text-right">{it.quantity}</TableCell>
                          <TableCell className="text-right">{currency(it.totalPurchaseValue)}</TableCell>
                          <TableCell className="text-right">{currency(it.allocatedFees)}</TableCell>
                          <TableCell className="text-right font-bold">{currency(it.costPricePerUnit)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={2} className="font-medium">Total</TableCell>
                        <TableCell className="text-right font-medium">{currency(totalPurchaseValue)}</TableCell>
                        <TableCell className="text-right font-medium">{currency(totalFees)}</TableCell>
                        <TableCell className="text-right font-bold">{currency(totalCost)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                <X className="mr-2 h-4 w-4" /> Réinitialiser
              </Button>
              <Button type="submit">
                <Calculator className="mr-2 h-4 w-4" /> Enregistrer le calcul
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des calculs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead className="text-right">Articles</TableHead>
                  <TableHead className="text-right">Frais totaux</TableHead>
                  <TableHead className="text-right">Coût total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Aucun calcul enregistré pour le moment.
                    </TableCell>
                  </TableRow>
                ) : (
                  shipments.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(s.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="font-medium">{s.reference}</TableCell>
                      <TableCell className="text-right">{s.items.length}</TableCell>
                      <TableCell className="text-right">{currency(s.totalFees)}</TableCell>
                      <TableCell className="text-right font-medium">{currency(s.totalCost)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTargetId(s.id)}
                          aria-label="Supprimer">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteTargetId !== null}
        title="Supprimer ce calcul ?"
        description="Cette entrée d'historique sera définitivement supprimée. Cette action est irréversible."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="destructive"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}