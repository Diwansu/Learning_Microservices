import React, { useState } from 'react';
import { PlusCircle, Loader2, ArrowRight } from 'lucide-react';
import { useShipmentStore } from '../store/useShipmentStore';

export default function ShipmentForm() {
  const { addShipment, loading, setError } = useShipmentStore();

  const [newShipment, setNewShipment] = useState({
    shipmentNumber: '',
    origin: '',
    destination: '',
    carrierEmail: '',
    clientEmail: '',
    status: 'On Time'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Quick validation
    if (!newShipment.shipmentNumber || !newShipment.origin || !newShipment.destination || !newShipment.carrierEmail || !newShipment.clientEmail) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await addShipment(newShipment);
      // Reset form on success
      setNewShipment({
        shipmentNumber: '',
        origin: '',
        destination: '',
        carrierEmail: '',
        clientEmail: '',
        status: 'On Time'
      });
    } catch (err) {
      // Error is already set in the Zustand store by addShipment
      console.error('Failed to create shipment:', err);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 shadow-xl sticky top-24">
      <div className="flex items-center space-x-2.5 mb-5">
        <PlusCircle className="w-5 h-5 text-blue-400" />
        <h2 className="text-base font-bold text-slate-100">
          Register New Shipment
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Shipment Manifest Number
          </label>
          <input
            type="text"
            required
            placeholder="e.g. SH-78281"
            className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition"
            value={newShipment.shipmentNumber}
            onChange={e => setNewShipment({...newShipment, shipmentNumber: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Origin Port
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Shenzhen"
              className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition"
              value={newShipment.origin}
              onChange={e => setNewShipment({...newShipment, origin: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Destination Port
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hamburg"
              className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition"
              value={newShipment.destination}
              onChange={e => setNewShipment({...newShipment, destination: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Carrier Email Address
          </label>
          <input
            type="email"
            required
            placeholder="e.g. carrier@maersk.com"
            className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition"
            value={newShipment.carrierEmail}
            onChange={e => setNewShipment({...newShipment, carrierEmail: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Client Email Address
          </label>
          <input
            type="email"
            required
            placeholder="e.g. client@walmart.com"
            className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition"
            value={newShipment.clientEmail}
            onChange={e => setNewShipment({...newShipment, clientEmail: e.target.value})}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Register Manifest</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
