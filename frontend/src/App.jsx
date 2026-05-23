import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useShipmentStore } from './store/useShipmentStore';
import ShipmentForm from './components/ShipmentForm';
import ShipmentTable from './components/ShipmentTable';
import DisruptionModal from './components/DisruptionModal';
import Login from './components/Login';
import AnalyticsPanel from './components/AnalyticsPanel';
import { Ship, AlertTriangle, CheckCircle, Activity, LogOut } from 'lucide-react';

function Dashboard() {
  const { error, success, clearStatus, fetchAnalytics, analytics } = useShipmentStore();
  const [activeShipment, setActiveShipment] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();

  // Fetch analytics on mount if user is Admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAnalytics();
    }
  }, [user, fetchAnalytics]);

  // Automatically clear success/error notifications after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        clearStatus();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, clearStatus]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Header Area */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Ship className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Smart Harbor
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Multi-Agent Logistics Assistant
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Activity className="w-3.5 h-3.5 mr-1.5" />
              Stateless AI Nodes Online
            </span>

            {user && (
              <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-semibold text-slate-200">{user.name}</span>
                  <span className="text-[9px] font-medium text-slate-450 uppercase tracking-widest">{user.role}</span>
                </div>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="bg-slate-800/65 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 p-2 rounded-lg text-slate-450 hover:text-slate-200 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Supervisor Analytics Panel */}
        {user && user.role === 'admin' && (
          <AnalyticsPanel analytics={analytics} />
        )}
        
        {/* Error / Success Banners */}
        {error && (
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 flex items-start space-x-3 shadow-lg shadow-rose-950/20 animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm">System Issue Detected</h3>
              <p className="text-xs text-rose-400/90 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-start space-x-3 shadow-lg shadow-emerald-950/20 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm">Operation Successful</h3>
              <p className="text-xs text-emerald-400/90 mt-0.5">{success}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {user && user.role === 'admin' ? (
            <>
              {/* 2. Left Panel: Create Shipment Form */}
              <div className="lg:col-span-1">
                <ShipmentForm />
              </div>

              {/* 3. Right Panel: Shipments List & Table */}
              <div className="lg:col-span-2 space-y-6">
                <ShipmentTable onAnalyze={setActiveShipment} />
              </div>
            </>
          ) : (
            /* Operators view shipment table full-width */
            <div className="lg:col-span-3 space-y-6">
              <ShipmentTable onAnalyze={setActiveShipment} />
            </div>
          )}
        </div>
      </main>

      {/* 4. Interactive Disruption Analysis Modal */}
      <DisruptionModal 
        activeShipment={activeShipment} 
        onClose={() => setActiveShipment(null)} 
      />

      {/* 5. Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-sm w-full rounded-2xl border border-slate-800/80 shadow-2xl p-6 relative z-10 backdrop-blur-md bg-slate-900/40 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 mb-4">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Confirm Logout</h3>
            <p className="text-xs text-slate-400 mb-6">
              Are you sure you want to log out of the Smart Harbor Logistics Assistant?
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-slate-800 hover:bg-slate-750 border border-slate-700/60 text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs transition flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition shadow-lg shadow-rose-500/10 flex-1"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="text-sm text-slate-400">Loading Secure Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
