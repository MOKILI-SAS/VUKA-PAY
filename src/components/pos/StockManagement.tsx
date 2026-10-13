import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, Stand } from '../../types';
import { formatUSD } from '../../utils/formatters';
import { 
  Package, 
  AlertTriangle, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface StockManagementProps {
  stand: Stand;
  menuItems: MenuItem[];
}

export const StockManagement: React.FC<StockManagementProps> = ({ stand, menuItems }) => {
  const { stockRequests, requestStockReorder, setCurrentRole } = useApp();

  const [selectedProduct, setSelectedProduct] = useState<string>(menuItems[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(20);
  const [reason, setReason] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Filtrer les demandes de ce stand
  const standRequests = stockRequests.filter(r => r.standId === stand.id);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || quantity <= 0) return;

    requestStockReorder(
      stand.id,
      selectedProduct,
      quantity,
      reason || 'Réassort régulier suite aux ventes de l’après-midi.'
    );

    setIsSubmitted(true);
    setReason('');
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Strict Security Alert Box */}
      <div className="p-4 rounded-2xl bg-[#FFF3CC] border border-[#FFC21A]/30 text-[#14110F] text-xs flex items-start gap-3">
        <Lock className="w-5 h-5 text-[#FFC21A] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#14110F] text-sm block mb-1 font-poppins">
            Gouvernance Stricte des Stocks (Cahier des Charges CFW6)
          </span>
          <p className="leading-relaxed text-[#4A443D]">
            Pour garantir l'exactitude des comptes et le modèle solidaire (10% reversés à la Fondation Congolicious), les exposants ne peuvent pas modifier leur stock unilatéralement. Toute demande de réassort doit être soumise et approuvée par le Super Administrateur.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Col: Current Inventory */}
        <div className="p-6 rounded-3xl bg-[#1E1A17] border border-[#2A2420] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white flex items-center gap-2 font-poppins">
              <Package className="w-4 h-4 text-[#FFC21A]" />
              <span>Inventaire en Temps Réel</span>
            </h4>
            <span className="text-[11px] font-mono text-[#9C9488]">
              Stand #{stand.number.toString().padStart(2, '0')}
            </span>
          </div>

          <div className="space-y-3">
            {menuItems.map((item) => {
              const stockRatio = (item.currentStock / item.initialStock) * 100;
              const isLow = item.currentStock <= 10;
              const isDepleted = item.currentStock === 0;

              return (
                <div 
                  key={item.id} 
                  className="p-3.5 rounded-2xl bg-[#14110F] border border-[#2A2420] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white font-poppins">{item.name}</div>
                      <div className="text-xs text-[#9C9488] font-mono">{formatUSD(item.priceUSD)}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-base font-black font-mono ${
                        isDepleted ? 'text-[#C62828]' : isLow ? 'text-[#FFC21A]' : 'text-[#167A42]'
                      }`}>
                        {item.currentStock} / {item.initialStock}
                      </div>
                      <div className="text-[10px] text-[#9C9488] font-semibold">
                        {isDepleted ? 'RUPTURE' : isLow ? 'STOCK FAIBLE' : 'DISPONIBLE'}
                      </div>
                    </div>
                  </div>

                  {/* Stock Level Bar */}
                  <div className="w-full h-1.5 rounded-full bg-[#2A2420] overflow-hidden">
                    <div 
                      className={`h-full ${
                        isDepleted ? 'bg-[#C62828]' : isLow ? 'bg-[#FFC21A]' : 'bg-[#167A42]'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, stockRatio))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Request Form & Pending Requests */}
        <div className="space-y-6">
          
          {/* Submission Form */}
          <div className="p-6 rounded-3xl bg-[#1E1A17] border border-[#2A2420] shadow-xl space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2 font-poppins">
              <PlusCircle className="w-4 h-4 text-[#FF6A2B]" />
              <span>Soumettre une Demande de Réassort</span>
            </h4>

            {isSubmitted && (
              <div className="p-3 rounded-2xl bg-[#167A42]/10 border border-[#167A42]/20 text-[#167A42] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Demande envoyée au Super Admin avec statut « EN ATTENTE ».</span>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#9C9488] mb-1 uppercase tracking-wider">
                  Produit à réapprovisionner *
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14110F] border border-[#2A2420] text-white text-xs focus:outline-none focus:border-[#FF6A2B]"
                >
                  {menuItems.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Reste: {m.currentStock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9C9488] mb-1 uppercase tracking-wider">
                  Quantité demandée *
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14110F] border border-[#2A2420] text-white font-mono text-xs focus:outline-none focus:border-[#FF6A2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9C9488] mb-1 uppercase tracking-wider">
                  Motif / Justification pour l'administration
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Pic de fréquentation entre 19h et 22h, approvisionnement cuisine prêt."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14110F] border border-[#2A2420] text-white text-xs placeholder-[#9C9488] focus:outline-none focus:border-[#FF6A2B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Envoyer la demande d'approbation</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#14110F]" />
              </button>
            </form>
          </div>

          {/* Pending Requests List */}
          <div className="p-6 rounded-3xl bg-[#1E1A17] border border-[#2A2420] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 font-poppins">
                <Clock className="w-4 h-4 text-[#9C9488]" />
                <span>Statut de vos demandes</span>
              </h4>
              <button
                onClick={() => setCurrentRole('SUPER_ADMIN')}
                className="text-[10px] font-bold text-[#FF6A2B] hover:underline inline-flex items-center gap-1"
              >
                <span>Aller valider en Admin</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {standRequests.length === 0 ? (
              <div className="text-xs text-[#9C9488] italic py-2">
                Aucune demande en cours pour ce stand.
              </div>
            ) : (
              <div className="space-y-2">
                {standRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-2xl bg-[#14110F] border border-[#2A2420] text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">
                        +{req.requestedQuantity} x {req.productName}
                      </div>
                      <div className="text-[10px] text-[#9C9488] font-mono mt-0.5">
                        {req.reason}
                      </div>
                    </div>

                    <div>
                      {req.status === 'PENDING' && (
                        <span className="px-2.5 py-1 rounded-full bg-[#FFF3CC] text-[#14110F] border border-[#FFC21A]/30 font-bold text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#FFC21A]" />
                          <span>En attente Admin</span>
                        </span>
                      )}
                      {req.status === 'APPROVED' && (
                        <span className="px-2.5 py-1 rounded-full bg-[#167A42]/10 text-[#167A42] border border-[#167A42]/20 font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#167A42]" />
                          <span>Approuvé (+{req.requestedQuantity})</span>
                        </span>
                      )}
                      {req.status === 'REJECTED' && (
                        <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-[#C62828] border border-red-500/20 font-bold text-[10px] flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          <span>Refusé</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
