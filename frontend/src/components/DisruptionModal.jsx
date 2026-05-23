import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AlertTriangle, 
  MapPin, 
  ArrowRight, 
  DollarSign, 
  Clock, 
  Loader2, 
  CheckCircle, 
  Copy 
} from 'lucide-react';
import { useShipmentStore } from '../store/useShipmentStore';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function DisruptionModal({ activeShipment, onClose }) {
  const { triggerDisruption } = useShipmentStore();
  const { authHeaders, user } = useAuth();

  const [triggerReason, setTriggerReason] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localError, setLocalError] = useState('');

  // Fetch prior disruption if exists
  useEffect(() => {
    if (!activeShipment) return;

    setTriggerReason('');
    setAnalysisResult(null);
    setCopied(false);
    setLocalError('');

    const fetchPriorDisruption = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/disruptions/${activeShipment._id}`);
        if (res.data) {
          setAnalysisResult(res.data);
        }
      } catch (err) {
        // 404 is normal if no disruption is logged yet
        console.log('No prior disruption details found for this shipment.');
      }
    };

    fetchPriorDisruption();
  }, [activeShipment]);

  if (!activeShipment) return null;

  const handleAnalyzeDisruption = async (e) => {
    e.preventDefault();
    if (!triggerReason) {
      setLocalError('Please specify a disruption reason.');
      return;
    }

    setAnalyzing(true);
    setLocalError('');

    try {
      const disruption = await triggerDisruption(activeShipment._id, triggerReason, authHeaders);
      setAnalysisResult(disruption);
    } catch (err) {
      setLocalError(err.message || 'Analysis failed. Make sure both backends are running.');
    } finally {
      setAnalyzing(false);
    }
  };

  const copyEmail = () => {
    if (analysisResult?.draftedEmail) {
      navigator.clipboard.writeText(analysisResult.draftedEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 flex flex-col my-8 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100">
              Log Disruption Event: {activeShipment.shipmentNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-semibold transition"
          >
            ✕ Close
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          
          {/* Local error banner within modal */}
          {localError && (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 flex items-start space-x-3 shadow-lg shadow-rose-950/20 animate-in fade-in duration-300">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Analysis Issue Detected</h3>
                <p className="text-xs text-rose-400/90 mt-0.5">{localError}</p>
              </div>
            </div>
          )}

          {/* Route Summary Badge */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Origin: <strong>{activeShipment.origin}</strong></span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600" />
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Destination: <strong>{activeShipment.destination}</strong></span>
            </div>
            <div className="h-4 w-px bg-slate-800"></div>
            <div>
              Status: {getStatusBadge(activeShipment.status)}
            </div>
          </div>

          {/* Trigger Input Form */}
          {!analysisResult && !analyzing && (
            user && user.role === 'admin' ? (
              <form onSubmit={handleAnalyzeDisruption} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    What is the disruption cause?
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Typhoon Lekima causing heavy wind advisory and port container crane shutdown."
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition"
                    value={triggerReason}
                    onChange={e => setTriggerReason(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-semibold rounded-xl py-3 text-sm shadow-lg shadow-amber-500/10 transition active:scale-[0.99] flex items-center justify-center space-x-2"
                >
                  <span>Activate Multi-Agent Graph</span>
                </button>
              </form>
            ) : (
              <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-305 text-center space-y-2 backdrop-blur-md shadow-lg shadow-amber-950/10 animate-in fade-in zoom-in-95 duration-300">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto animate-pulse" />
                <h4 className="font-bold text-sm text-amber-300">Disruption Report Pending</h4>
                <p className="text-xs text-amber-400/80 leading-relaxed max-w-md mx-auto">
                  No disruption report has been generated yet for this shipment. A Supervising Administrator must initiate the AI analysis.
                </p>
              </div>
            )
          )}

          {/* Analyzing Loading State */}
          {analyzing && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-200">AI Agents Executing Graph...</p>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Agent 1 (Researcher) is calculating severity. Agent 2 (Router) is generating alternative paths. Agent 3 (Communicator) is drafting emails.
                </p>
              </div>
            </div>
          )}

          {/* Results Presentation */}
          {analysisResult && !analyzing && (
            <div className="space-y-6">
              
              {/* Research Output (Agent 1) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2"></span>
                  Agent 1: Researcher Summary ({analysisResult.severity} Severity)
                </h4>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 leading-relaxed">
                  {analysisResult.aiResearchSummary}
                </div>
              </div>

              {/* Router Output (Agent 2) */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>
                  Agent 2: Alternative Routing Recommendations
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.alternativeRoutes && analysisResult.alternativeRoutes.map((route, i) => (
                    <div key={i} className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700/60 transition">
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
                          Option {i + 1}: {route.mode}
                        </span>
                        <p className="text-xs text-slate-300 leading-normal">
                          {route.path}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs">
                        <span className="flex items-center text-emerald-400 font-medium">
                          <DollarSign className="w-3.5 h-3.5 mr-0.5" />
                          +${route.extra_cost.toLocaleString()}
                        </span>
                        <span className="flex items-center text-slate-400 font-medium">
                          <Clock className="w-3.5 h-3.5 mr-0.5 text-slate-500" />
                          {route.time_days} Days
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Communicator Output (Agent 3) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>
                    Agent 3: Client Notification Draft
                  </h4>
                  <button
                    onClick={copyEmail}
                    className="inline-flex items-center text-xs text-blue-400 hover:text-blue-300 transition font-medium focus:outline-none"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        Copy Draft
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {analysisResult.draftedEmail}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900/60 border-t border-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-2 rounded-xl text-xs transition"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
}
