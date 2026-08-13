import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '../api/supabaseClient';
import type { Shipment, ShipmentItem } from '../types/inventory';

interface ShipmentContextType {
  shipments: Shipment[];
  loading: boolean;
  error: string | null;
  addShipment: (shipment: Omit<Shipment, 'id'>) => Promise<void>;
  deleteShipment: (id: string) => Promise<void>;
}

const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

const shipmentFromDb = (row: any): Shipment => ({
  id: row.id,
  reference: row.reference,
  date: row.date,
  fees: {
    dpiFees: Number(row.dpi_fees),
    bankFees: Number(row.bank_fees),
    franceTransportFees: Number(row.france_transport_fees),
    maritimeFees: Number(row.maritime_fees),
    customsFees: Number(row.customs_fees),
    exploitationDocFees: Number(row.exploitation_doc_fees),
    airFees: Number(row.air_fees),
    pickupToPortFees: Number(row.pickup_to_port_fees),
    gpToHomeFees: Number(row.gp_to_home_fees)
  },
  items: row.items as ShipmentItem[],
  totalFees: Number(row.total_fees),
  totalPurchaseValue: Number(row.total_purchase_value),
  totalCost: Number(row.total_cost)
});

const shipmentToDb = (shipment: Omit<Shipment, 'id'>) => ({
  reference: shipment.reference,
  date: shipment.date,
  dpi_fees: shipment.fees.dpiFees,
  bank_fees: shipment.fees.bankFees,
  france_transport_fees: shipment.fees.franceTransportFees,
  maritime_fees: shipment.fees.maritimeFees,
  customs_fees: shipment.fees.customsFees,
  exploitation_doc_fees: shipment.fees.exploitationDocFees,
  air_fees: shipment.fees.airFees,
  pickup_to_port_fees: shipment.fees.pickupToPortFees,
  gp_to_home_fees: shipment.fees.gpToHomeFees,
  total_fees: shipment.totalFees,
  total_purchase_value: shipment.totalPurchaseValue,
  total_cost: shipment.totalCost,
  items: shipment.items
});

export const ShipmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadShipments() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('shipments')
          .select('*')
          .order('date', { ascending: false });
        if (error) throw error;
        setShipments((data ?? []).map(shipmentFromDb));
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger l'historique des calculs de revient.");
      } finally {
        setLoading(false);
      }
    }
    loadShipments();
  }, []);

  const addShipment = async (shipment: Omit<Shipment, 'id'>) => {
    const { data, error } = await supabase
      .from('shipments')
      .insert(shipmentToDb(shipment))
      .select()
      .single();
    if (error) throw error;
    setShipments(prev => [shipmentFromDb(data), ...prev]);
  };

  const deleteShipment = async (id: string) => {
    const { error } = await supabase.from('shipments').delete().eq('id', id);
    if (error) throw error;
    setShipments(prev => prev.filter(s => s.id !== id));
  };

  return (
    <ShipmentContext.Provider value={{ shipments, loading, error, addShipment, deleteShipment }}>
      {children}
    </ShipmentContext.Provider>
  );
};

export const useShipments = () => {
  const context = useContext(ShipmentContext);
  if (context === undefined) {
    throw new Error('useShipments must be used within a ShipmentProvider');
  }
  return context;
};