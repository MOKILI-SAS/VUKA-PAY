import React from 'react';
import { useApp } from '../../context/AppContext';
import { StockRequest } from '../../types';
import { Package, Check, X, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const StockRequestsView: React.FC = () => {
  const { stockRequests, approveStockRequest, rejectStockRequest } = useApp();

  const pendingRequests = stockRequests.filter(r => r.status === 'PENDING');
  const pastRequests = stockRequests.filter(r => r.status !== 'PENDING');

  return (
    <div className="space-y-6">
      
      {/* Overview Notice */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-[#FFB300]" />
            <span>Demandes d'Approvisionnement & Réassort</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Validation obligatoire avant déblocage de stock additionnel aux stands exposants
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
          {pendingRequests.length} en attente
        </span>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length === 0 ? (
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-500 text-xs">
          Toutes les demandes de réassort ont été traitées.
        </div>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-3xl bg-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{req.standName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-[#FFB300]">
                    {req.id}
                  </span>
                </div>
                <div className="text-sm font-black text-[#FF5722] mt-1">
                  +{req.requestedQuantity} unités • {req.productName}
                </div>
                <p className="text-xs text-slate-400 mt-1 italic">
                  « {req.reason} »
                </p>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Reçue à : {new Date(req.requestedAt).toLocaleTimeString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => approveStockRequest(req.id)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Approuver</span>
                </button>

                <button
                  onClick={() => rejectStockRequest(req.id)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-red-500/20 border border-slate-700 text-slate-300 hover:text-red-400 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <X className="w-4 h-4" />
                  <span>Refuser</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Processed History */}
      {pastRequests.length > 0 && (
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase">
            Demandes Récentes Traitées ({pastRequests.length})
          </div>
          <div className="space-y-2">
            {pastRequests.slice(0, 5).map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-300">
                    {req.standName} — +{req.requestedQuantity} {req.productName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Traité par : {req.processedByAdmin}
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  req.status === 'APPROVED' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {req.status === 'APPROVED' ? 'Validé' : 'Rejeté'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
