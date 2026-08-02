import * as React from 'react';

// --- Card ---
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>>;
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>;

// --- Table ---
export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>>;
export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>>;
export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>>;
export const TableFooter: React.FC<React.HTMLAttributes<HTMLTableSectionElement>>;
export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>>;
export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>>;
export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>>;
export const TableCaption: React.FC<React.HTMLAttributes<HTMLTableCaptionElement>>;

// --- Button ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}
export const Button: React.FC<ButtonProps>;

// --- Input ---
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>>;

// --- Label ---
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>>;

// --- Select (Radix-style composable) ---
export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children?: React.ReactNode;
}
export const Select: React.FC<SelectProps>;
export const SelectTrigger: React.FC<React.HTMLAttributes<HTMLButtonElement> & { id?: string }>;
export const SelectValue: React.FC<{ placeholder?: string }>;
export const SelectContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const SelectItem: React.FC<React.HTMLAttributes<HTMLDivElement> & { value: string }>;

// --- Sidebar ---
export interface SidebarProviderProps {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export const SidebarProvider: React.FC<SidebarProviderProps>;
export const Sidebar: React.FC<React.HTMLAttributes<HTMLDivElement> & { collapsible?: string; variant?: string }>;
export const SidebarInset: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const SidebarTrigger: React.FC<React.HTMLAttributes<HTMLButtonElement>>;
export const SidebarContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const SidebarHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const SidebarFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const SidebarGroup: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const SidebarGroupLabel: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const SidebarGroupContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const SidebarMenu: React.FC<React.HTMLAttributes<HTMLUListElement>>;
export const SidebarMenuItem: React.FC<React.HTMLAttributes<HTMLLIElement>>;
export interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string;
}
export const SidebarMenuButton: React.FC<SidebarMenuButtonProps>;

// --- Sonner (Toaster) ---
export interface ToasterProps {
  theme?: 'light' | 'dark' | 'system';
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  richColors?: boolean;
  closeButton?: boolean;
  duration?: number;
  className?: string;
}
export const Toaster: React.FC<ToasterProps>;

// --- Dialog ---
export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}
export const Dialog: React.FC<DialogProps>;
export const DialogTrigger: React.FC<React.HTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>;
export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
export const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>>;
export const DialogClose: React.FC<React.HTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>;

// --- Badge ---
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}
export const Badge: React.FC<BadgeProps>;

// --- Chart ---
export interface ChartConfig {
  [key: string]: {
    label?: React.ReactNode;
    color?: string;
    icon?: React.ComponentType;
  };
}
export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: React.ReactElement;
}

export const ChartContainer: React.FC<ChartContainerProps>;
export const ChartTooltipContent: React.FC<Record<string, unknown>>;
export const ChartTooltip: React.FC<Record<string, unknown>>;
export const ChartLegend: React.FC<Record<string, unknown>>;
export const ChartLegendContent: React.FC<Record<string, unknown>>;
