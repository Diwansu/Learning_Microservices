import React, { useEffect } from 'react';
import { Ship, ArrowRight, Compass, Loader2, Layers, Trash2 } from 'lucide-react';
import { useShipmentStore } from '../store/useShipmentStore';
import { useAuth } from '../context/AuthContext';

export default function ShipmentTable({ onAnalyze }) {
  const { shipments, loading, fetchShipments, deleteShipment } = useShipmentStore();
  const { user } = useAuth();

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'On Time':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            On Time
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-400"></span>
            Delayed
          </span>
        );
      case 'Critical':
      case 'High':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-400 animate-ping"></span>
            Critical
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="glass-card rounded-2xl shadow-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Layers className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-bold text-slate-100">
            Active Harbor Shipments
          </h2>
        </div>
        <button
          onClick={fetchShipments}
          className="text-xs text-slate-400 hover:text-slate-200 transition font-medium underline underline-offset-4"
        >
          Refresh Feed
        </button>
      </div>

      {loading && shipments.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm text-slate-400">Loading active manifests...</p>
        </div>
      ) : shipments.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-sm text-slate-400">No shipments found.</p>
          <p className="text-xs text-slate-500 mt-1">
            {user && user.role === 'admin' 
              ? 'Register a manifest on the left to start.' 
              : 'Wait for a Supervising Administrator to register a manifest.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/20 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-3.5">Manifest</th>
                <th className="px-6 py-3.5">Route</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {shipments.map((shipment) => (
                <tr key={shipment._id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-slate-800 p-2 rounded-lg text-slate-300">
                        <Ship className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-slate-200 block">
                          {shipment.shipmentNumber}
                        </span>
                        <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                          ID: {shipment._id.substring(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-xs text-slate-300">
                      <span className="font-medium">{shipment.origin}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-medium">{shipment.destination}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(shipment.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onAnalyze(shipment)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg hover:border-blue-400 transition"
                      >
                        <Compass className="w-3.5 h-3.5 mr-1.5" />
                        Analyze
                      </button>
                      {user && user.role === 'admin' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete shipment manifest ${shipment.shipmentNumber}?`)) {
                              deleteShipment(shipment._id);
                            }
                          }}
                          className="inline-flex items-center p-1.5 text-xs font-semibold bg-rose-600/10 hover:bg-rose-600/20 text-rose-450 border border-rose-500/20 rounded-lg hover:border-rose-400 transition"
                          title="Delete Manifest"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
