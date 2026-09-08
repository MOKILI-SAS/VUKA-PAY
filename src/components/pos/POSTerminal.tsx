import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, CashlessTransaction } from '../../types';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { 
  Store, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Package, 
  History, 
  Heart, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { POSScannerModal } from './POSScannerModal';
import { POSReceiptModal } from './POSReceiptModal';
import { StockManagement } from './StockManagement';

export const POSTerminal: React.FC = () => {
  const { 
    stands, 
    activeStandId, 
    setActiveStandId, 
    getStandMenuItems, 
    isOffline, 
    setIsOffline,
    transactions 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'POS' | 'STOCKS' | 'HISTORY'>('POS');
  const [cart, setCart] = useState<{ product: MenuItem; quantity: number }[]>([]);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [completedTx, setCompletedTx] = useState<CashlessTransaction | null>(null);

  const activeStand = stands.find(s => s.id === activeStandId) || stands[0];
  const menuItems = getStandMenuItems(activeStand.id);

  // Filtrer les transactions de ce stand
  const standTransactions = transactions.filter(t => t.standId === activeStand.id);

  // Cart operations
  const addToCart = (product: MenuItem) => {
    if (product.currentStock <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.currentStock) return prev;
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const clearCart = () => setCart([]);

  const totalAmountUSD = cart.reduce((sum, item) => sum + (item.product.priceUSD * item.quantity), 0);
  const commission10USD = Number((totalAmountUSD * 0.10).toFixed(2));
  const netStand90USD = Number((totalAmountUSD - commission10USD).toFixed(2));

  const handleSaleSuccess = (tx: CashlessTransaction) => {
    setScannerOpen(false);
    clearCart();
    setCompletedTx(tx);
  };

  return (
    <div className="py-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Stand Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFB300] flex items-center justify-center text-slate-950 font-black text-xl shadow-md">
            #{activeStand.number}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{activeStand.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {activeStand.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Responsable : {activeStand.ownerName} • {activeStand.ownerPhoneMpesa}
            </p>
          </div>
        </div>

        {/* Stand Selector Dropdown & Mode Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Stand :</span>
            <select
              value={activeStand.id}
              onChange={(e) => {
                setActiveStandId(e.target.value);
                clearCart();
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-bold focus:outline-none focus:border-[#FF5722]"
            >
              {stands.map(s => (
                <option key={s.id} value={s.id}>
                  Stand #{s.number.toString().padStart(2, '0')} — {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stand Stats */}
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400">CA Stand : </span>
            <span className="font-mono font-black text-[#10B981]">{formatUSD(activeStand.totalSalesUSD)}</span>
            <span className="text-slate-500 text-[10px] ml-1">({activeStand.transactionsCount} vts)</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: POS / Stocks / Historique */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('POS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'POS'
              ? 'bg-[#FF5722] text-white shadow-vuka'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Caisse Vente (Touch POS)</span>
        </button>

        <button
          onClick={() => setActiveTab('STOCKS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'STOCKS'
              ? 'bg-[#FFB300] text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Stocks & Réassorts</span>
        </button>

        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'HISTORY'
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Historique Stand ({standTransactions.length})</span>
        </button>
      </div>

      {/* POS View */}
      {activeTab === 'POS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Menu Items Grid (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Menu du Stand</span>
                <span className="text-xs text-slate-400 font-normal">({menuItems.length} articles configurés)</span>
              </h3>
              <span className="text-[11px] text-slate-400">Touchez un article pour l'ajouter</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map((item) => {
                const inCart = cart.find(c => c.product.id === item.id);
                const isOutOfStock = item.currentStock <= 0;

                return (
                  <button
                    key={item.id}
                    onClick={() => addToCart(item)}
                    disabled={isOutOfStock}
                    className={`relative p-5 rounded-3xl text-left transition-all border flex flex-col justify-between ${
                      isOutOfStock
                        ? 'bg-slate-950/40 border-slate-900 opacity-50 cursor-not-allowed'
                        : inCart
                        ? 'bg-slate-900 border-[#FF5722] shadow-vuka scale-[1.01]'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 uppercase">
                          {item.category}
                        </span>
                        
                        {/* Stock indicator */}
                        <span className={`text-[11px] font-mono font-bold ${
                          item.currentStock <= 5 ? 'text-red-400' : 'text-slate-400'
                        }`}>
                          {item.currentStock > 0 ? `${item.currentStock} restants` : 'RUPTURE'}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white leading-snug mb-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                      <div>
                        <div className="text-lg font-black text-white font-mono">
                          {formatUSD(item.priceUSD)}
                        </div>
                        <div className="text-[10px] text-[#FFB300] font-mono">
                          ≈ {formatCDF(item.priceUSD)}
                        </div>
                      </div>

                      {inCart ? (
                        <div className="px-3 py-1 rounded-xl bg-[#FF5722] text-white font-black text-xs">
                          {inCart.quantity}x
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-[#FF5722] hover:text-white transition">
                          <Plus className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cart Sidebar (1 col) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#FF5722]" />
                <h3 className="text-base font-bold text-white">Commande en cours</h3>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vider</span>
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                Panier vide. Touchez un produit du stand pour commencer.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Cart list */}
                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div 
                      key={item.product.id}
                      className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="truncate max-w-[140px]">
                        <div className="font-bold text-white truncate">{item.product.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {formatUSD(item.product.priceUSD)} / u
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-white w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item.product)}
                          className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Split */}
                <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Total Commande :</span>
                    <span className="text-white font-mono font-black text-base">{formatUSD(totalAmountUSD)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#FFB300] font-mono">
                    <span>Équivalent Francs Congolais :</span>
                    <span>{formatCDF(totalAmountUSD)}</span>
                  </div>

                  {/* Split Preview */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                    <div className="flex items-center gap-1 text-[#FF5722] font-bold">
                      <Heart className="w-3 h-3 fill-[#FF5722]" />
                      <span>Régularisation Solidaire CFW6 :</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>• Net Reversé au Stand (90%) :</span>
                      <span className="text-white font-mono font-bold">{formatUSD(netStand90USD)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>• Fondation Congolicious (10%) :</span>
                      <span className="text-[#FF5722] font-mono font-bold">{formatUSD(commission10USD)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Trigger Button */}
                <button
                  onClick={() => setScannerOpen(true)}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#FF5722] to-[#FF7A00] hover:from-[#E64A19] hover:to-[#F57C00] text-white font-black text-sm uppercase tracking-wider shadow-vuka transition flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Encaisser {formatUSD(totalAmountUSD)}</span>
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Stocks Management View */}
      {activeTab === 'STOCKS' && (
        <StockManagement stand={activeStand} menuItems={menuItems} />
      )}

      {/* History Stand View */}
      {activeTab === 'HISTORY' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Ventes enregistrées sur ce stand</h3>
            <span className="text-xs text-slate-400 font-mono font-bold">
              Total : {formatUSD(activeStand.totalSalesUSD)}
            </span>
          </div>

          {standTransactions.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              Aucune vente sur ce stand pour le moment.
            </div>
          ) : (
            <div className="space-y-2">
              {standTransactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{tx.id}</span>
                      {tx.offlineGenerated && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                          Offline Local
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {new Date(tx.timestamp).toLocaleTimeString()} • {tx.paymentMethod}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-white font-mono">{formatUSD(tx.amountUSD)}</div>
                    <div className="text-[10px] text-slate-400">
                      Net: {formatUSD(tx.merchantNetUSD)} | Fdt: {formatUSD(tx.commissionAmountUSD)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {scannerOpen && (
        <POSScannerModal
          standId={activeStand.id}
          cartItems={cart}
          totalAmountUSD={totalAmountUSD}
          onClose={() => setScannerOpen(false)}
          onSuccess={handleSaleSuccess}
        />
      )}

      {completedTx && (
        <POSReceiptModal
          transaction={completedTx}
          stand={activeStand}
          onClose={() => setCompletedTx(null)}
        />
      )}

    </div>
  );
};
