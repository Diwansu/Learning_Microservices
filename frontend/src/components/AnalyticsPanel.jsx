import React from 'react';
import { BarChart3, AlertOctagon, DollarSign, Layers, Flame, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AnalyticsPanel({ analytics }) {
  if (!analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-900/40 rounded-2xl border border-slate-800/60" />
        ))}
      </div>
    );
  }

  const { totalShipments, disruptedShipments, totalExtraCost, severityBreakdown } = analytics;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-6 duration-500">
      
      {/* Total Manifests */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-850/80 bg-slate-900/40 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-blue-500/30 hover:shadow-blue-950/10">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/5 blur-xl transition-all group-hover:bg-blue-500/10" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-450">
              Total Manifests
            </p>
            <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
              {totalShipments}
            </h3>
          </div>
          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition duration-300">
            <BarChart3 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Disrupted Manifests */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-850/80 bg-slate-900/40 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-amber-500/30 hover:shadow-amber-950/10">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-500/5 blur-xl transition-all group-hover:bg-amber-500/10" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-450">
              Active Disruptions
            </p>
            <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-amber-400">
              {disruptedShipments}
            </h3>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition duration-300">
            <AlertOctagon className="h-6 w-6 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Cumulative Overhead Cost */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-850/80 bg-slate-900/40 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-emerald-500/30 hover:shadow-emerald-950/10">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl transition-all group-hover:bg-emerald-500/10" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-450">
              Disruption Overhead Cost
            </p>
            <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-400">
              {formatCurrency(totalExtraCost)}
            </h3>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition duration-300">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Severity Breakdown */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-850/80 bg-slate-900/40 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-indigo-500/30 hover:shadow-indigo-950/10">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/5 blur-xl transition-all group-hover:bg-indigo-500/10" />
        <div className="flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-450">
              Severity Distribution
            </p>
            <div className="rounded-xl bg-indigo-500/10 p-1.5 text-indigo-400 border border-indigo-500/20">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1 text-[11px] font-medium pt-1">
            {/* Critical */}
            <div className="flex flex-col items-center flex-1 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <div className="flex items-center space-x-0.5">
                <Flame className="w-3 h-3 text-rose-500" />
                <span>Crit</span>
              </div>
              <span className="text-sm font-bold mt-0.5">{severityBreakdown?.Critical || 0}</span>
            </div>
            
            {/* High */}
            <div className="flex flex-col items-center flex-1 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <div className="flex items-center space-x-0.5">
                <AlertCircle className="w-3 h-3 text-orange-500" />
                <span>High</span>
              </div>
              <span className="text-sm font-bold mt-0.5">{severityBreakdown?.High || 0}</span>
            </div>

            {/* Medium */}
            <div className="flex flex-col items-center flex-1 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <div className="flex items-center space-x-0.5">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                <span>Med</span>
              </div>
              <span className="text-sm font-bold mt-0.5">{severityBreakdown?.Medium || 0}</span>
            </div>

            {/* Low */}
            <div className="flex flex-col items-center flex-1 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-450">
              <div className="flex items-center space-x-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-550" />
                <span>Low</span>
              </div>
              <span className="text-sm font-bold mt-0.5">{severityBreakdown?.Low || 0}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
