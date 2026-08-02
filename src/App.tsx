import { useState } from 'react';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger } from
'./components/ui/Sidebar';
import { AppSidebar } from './components/layout/AppSidebar';
import { SplashScreen } from './components/SplashScreen';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { StockEntry } from './pages/StockEntry';
import { StockExit } from './pages/StockExit';
import { Movements } from './pages/Movements';
import { Suppliers } from './pages/Suppliers';
import { Categories } from './pages/Categories';
import { InventoryProvider } from './context/InventoryContext.js';
import { Toaster } from './components/ui/Sonner';
import { useScreenInit } from './useScreenInit.js';
type ViewType =
'dashboard' |
'products' |
'stockEntry' |
'stockExit' |
'movements' |
'suppliers' |
'categories';
type AppPhase = 'splash' | 'auth' | 'app';
function AppShell() {
  const screenInit = useScreenInit();
  const [activeView, setActiveView] = useState<ViewType>(
    screenInit?.activeView as ViewType || 'dashboard'
  );
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'stockEntry':
        return <StockEntry />;
      case 'stockExit':
        return <StockExit />;
      case 'movements':
        return <Movements />;
      case 'suppliers':
        return <Suppliers />;
      case 'categories':
        return <Categories />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar activeView={activeView} setActiveView={setActiveView} />
        <SidebarInset className="flex w-full flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4 md:px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-base font-semibold">Gestion de Stock</h1>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {renderView()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>);

}
function AppContent() {
  const screenInit = useScreenInit();
  const [phase, setPhase] = useState<AppPhase>(
    screenInit?.phase as AppPhase || 'splash'
  );
  return (
    <>
      {phase === 'splash' && <SplashScreen onFinish={() => setPhase('auth')} />}
      {phase === 'auth' && <Login onLogin={() => setPhase('app')} />}
      {phase === 'app' && <AppShell />}
      <Toaster position="top-right" />
    </>);

}
export function App() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>);

}