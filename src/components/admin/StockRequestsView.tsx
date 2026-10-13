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
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-poppins">
            <Package className="w-5 h-5 text-[#FFC21A]" />
            <span>Demandes d'Approvisionnement & Réassort</span>
          </h3>
          <p className="text-xs text-[#9C9488] mt-0.5">
            Validation obligatoire avant déblocage de stock additionnel aux stands exposants
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#FFF3CC] text-[#14110F] border border-[#FFC21A]/30 font-bold">
          {pendingRequests.length} en attente
        </span>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#1E1A17] border border-[#2A2420] text-center text-[#9C9488] text-xs">
          Toutes les demandes de réassort ont été traitées.
        </div>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-3xl bg-[#1E1A17] border border-[#FFC21A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-poppins">{req.standName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#14110F] text-[#FFC21A] border border-[#2A2420]">
                    {req.id}
                  </span>
                </div>
                <div className="text-sm font-black text-[#FF6A2B] mt-1 font-poppins">
                  +{req.requestedQuantity} unités • {req.productName}
                </div>
                <p className="text-xs text-[#9C9488] mt-1 italic">
                  « {req.reason} »
                </p>
                <div className="text-[10px] text-[#9C9488] font-mono mt-1">
                  Reçue à : {new Date(req.requestedAt).toLocaleTimeString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => approveStockRequest(req.id)}
                  className="px-4 py-2.5 rounded-xl bg-[#167A42] hover:bg-[#126436] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Approuver</span>
                </button>

                <button
                  onClick={() => rejectStockRequest(req.id)}
                  className="px-4 py-2.5 rounded-xl bg-[#14110F] hover:bg-red-500/20 border border-[#2A2420] text-[#9C9488] hover:text-[#C62828] font-bold text-xs flex items-center gap-1.5 transition"
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
        <div className="pt-4 border-t border-[#2A2420] space-y-3">
          <div className="text-xs font-bold text-[#9C9488] uppercase">
            Demandes Récentes Traitées ({pastRequests.length})
          </div>
          <div className="space-y-2">
            {pastRequests.slice(0, 5).map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-2xl bg-[#14110F] border border-[#2A2420] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#F5F3EF]">
                    {req.standName} — +{req.requestedQuantity} {req.productName}
                  </div>
                  <div className="text-[10px] text-[#9C9488] font-mono">
                    Traité par : {req.processedByAdmin}
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  req.status === 'APPROVED' 
                    ? 'bg-[#167A42]/10 text-[#167A42] border border-[#167A42]/20' 
                    : 'bg-red-500/10 text-[#C62828] border border-red-500/20'
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
