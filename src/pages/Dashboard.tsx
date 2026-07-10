import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useInventory } from '../context/InventoryContext';
import {
  Package,
  AlertTriangle,
  Euro,
  ArrowUpRight,
  ArrowDownRight } from
'lucide-react';
import { ChartContainer, ChartTooltipContent } from '../components/ui/Chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer } from
'recharts';
export function Dashboard() {
  const { products, movements, categories } = useInventory();
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock).length;
  const totalValue = products.reduce(
    (acc, p) => acc + p.stock * p.purchasePrice,
    0
  );
  // Prepare chart data
  const stockByCategory = categories.map((c) => {
    const categoryProducts = products.filter((p) => p.categoryId === c.id);
    const totalStock = categoryProducts.reduce((acc, p) => acc + p.stock, 0);
    return {
      name: c.name,
      stock: totalStock
    };
  });
  const chartConfig = {
    stock: {
      label: 'Stock',
      color: 'var(--chart-1)'
    }
  };
  const recentMovements = [...movements].
  sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).
  slice(0, 5);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Produits
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">références actives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {lowStockProducts}
            </div>
            <p className="text-xs text-muted-foreground">
              produits sous le seuil
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valeur du Stock
            </CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalValue.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground">prix d'achat total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Stock par Catégorie</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={stockByCategory}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false} />
                
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`} />
                
                <Tooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="stock"
                  fill="var(--color-stock)"
                  radius={[4, 4, 0, 0]} />
                
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Mouvements Récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentMovements.map((movement) => {
                const product = products.find(
                  (p) => p.id === movement.productId
                );
                return (
                  <div key={movement.id} className="flex items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border ${movement.type === 'IN' ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`}>
                      
                      {movement.type === 'IN' ?
                      <ArrowDownRight className="h-4 w-4 text-green-600" /> :

                      <ArrowUpRight className="h-4 w-4 text-red-600" />
                      }
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {product?.name || 'Produit inconnu'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(movement.date).toLocaleDateString('fr-FR')} -{' '}
                        {movement.reason}
                      </p>
                    </div>
                    <div
                      className={`ml-auto font-medium ${movement.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                      
                      {movement.type === 'IN' ? '+' : '-'}
                      {movement.quantity}
                    </div>
                  </div>);

              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

}