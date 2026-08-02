import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Truck,
  Tags,
  PackagePlus,
  PackageMinus } from
'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem } from
'../ui/Sidebar';
type ViewType =
'dashboard' |
'products' |
'stockEntry' |
'stockExit' |
'movements' |
'suppliers' |
'categories';
interface AppSidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}
export function AppSidebar({ activeView, setActiveView }: AppSidebarProps) {
  const menuItems = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: LayoutDashboard
  },
  {
    id: 'products',
    label: 'Produits',
    icon: Package
  },
  {
    id: 'stockEntry',
    label: "Fiche d'entrée",
    icon: PackagePlus
  },
  {
    id: 'stockExit',
    label: 'Fiche de sortie',
    icon: PackageMinus
  },
  {
    id: 'movements',
    label: 'Mouvements',
    icon: ArrowLeftRight
  },
  {
    id: 'suppliers',
    label: 'Fournisseurs',
    icon: Truck
  },
  {
    id: 'categories',
    label: 'Catégories',
    icon: Tags
  }] as
  const;
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-xl font-bold text-primary">StockPro</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) =>
              <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                  isActive={activeView === item.id}
                  onClick={() => setActiveView(item.id)}
                  className="w-full justify-start">
                  
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>);

}