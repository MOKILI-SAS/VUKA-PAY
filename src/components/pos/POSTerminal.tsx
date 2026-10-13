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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-[28px] bg-white border border-[#E5E0D8] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#14110F] flex items-center justify-center text-[#FFC21A] font-black text-xl shadow-sm font-poppins">
            #{activeStand.number}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#14110F] font-poppins">{activeStand.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FBF6EE] text-[#4A443D] border border-[#E5E0D8]">
                {activeStand.category}
              </span>
            </div>
            <p className="text-xs text-[#9C9488] font-mono mt-0.5">
              Responsable : {activeStand.ownerName} • {activeStand.ownerPhoneMpesa}
            </p>
          </div>
        </div>

        {/* Stand Selector Dropdown & Mode Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9C9488] font-bold">Stand :</span>
            <select
              value={activeStand.id}
              onChange={(e) => {
                setActiveStandId(e.target.value);
                clearCart();
              }}
              className="px-3 py-2 rounded-xl bg-[#FBF6EE] border border-[#E5E0D8] text-xs text-[#14110F] font-bold focus:outline-none focus:border-[#FF6A2B]"
            >
              {stands.map(s => (
                <option key={s.id} value={s.id}>
                  Stand #{s.number.toString().padStart(2, '0')} — {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stand Stats */}
          <div className="px-3.5 py-1.5 rounded-xl bg-[#FFE3D3] border border-[#FF6A2B]/20 text-xs">
            <span className="text-[#4A443D] font-medium">CA Stand : </span>
            <span className="font-mono font-black text-[#FF6A2B]">{formatUSD(activeStand.totalSalesUSD)}</span>
            <span className="text-[#9C9488] text-[10px] ml-1 font-bold">({activeStand.transactionsCount} vts)</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: POS / Stocks / Historique */}
      <div className="flex items-center gap-2 border-b border-[#E5E0D8] pb-3">
        <button
          onClick={() => setActiveTab('POS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
            activeTab === 'POS'
              ? 'bg-[#FF6A2B] text-[#14110F] shadow-sm font-black'
              : 'text-[#4A443D] hover:text-[#14110F] bg-white border border-[#E5E0D8]'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Caisse Vente (Touch POS)</span>
        </button>

        <button
          onClick={() => setActiveTab('STOCKS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
            activeTab === 'STOCKS'
              ? 'bg-[#FFC21A] text-[#14110F] shadow-sm font-black'
              : 'text-[#4A443D] hover:text-[#14110F] bg-white border border-[#E5E0D8]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Stocks & Réassorts</span>
        </button>

        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
            activeTab === 'HISTORY'
              ? 'bg-[#14110F] text-white font-bold'
              : 'text-[#4A443D] hover:text-[#14110F] bg-white border border-[#E5E0D8]'
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
              <h3 className="text-base font-black text-[#111827] flex items-center gap-2">
                <span>Menu du Stand</span>
                <span className="text-xs text-slate-500 font-normal">({menuItems.length} articles configurés)</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Touchez un article pour l'ajouter</span>
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
                    className={`relative p-5 rounded-[24px] text-left transition-all border flex flex-col justify-between ${
                      isOutOfStock
                        ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                        : inCart
                        ? 'bg-white border-2 border-[#FF6A2B] shadow-md scale-[1.01]'
                        : 'bg-white border-[#E5E0D8] hover:border-[#FF6A2B]/40 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5F3EF] text-[#4A443D] uppercase">
                          {item.category}
                        </span>
                        
                        {/* Stock indicator */}
                        <span className={`text-[11px] font-mono font-bold ${
                          item.currentStock <= 5 ? 'text-[#C62828]' : 'text-[#9C9488]'
                        }`}>
                          {item.currentStock > 0 ? `${item.currentStock} restants` : 'RUPTURE'}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-[#14110F] leading-snug mb-1 font-poppins">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#9C9488] line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E5E0D8]">
                      <div>
                        <div className="text-lg font-black text-[#14110F] font-mono">
                          {formatUSD(item.priceUSD)}
                        </div>
                        <div className="text-[10px] text-[#FF6A2B] font-mono font-bold">
                          ≈ {formatCDF(item.priceUSD)}
                        </div>
                      </div>

                      {inCart ? (
                        <div className="px-3 py-1 rounded-full bg-[#FF6A2B] text-[#14110F] font-black text-xs">
                          {inCart.quantity}x
                        </div>
                      ) : (
                        <div className="p-2 rounded-full bg-[#F5F3EF] text-[#14110F] hover:bg-[#FF6A2B] hover:text-[#14110F] transition">
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
          <div className="p-6 rounded-[28px] bg-white border border-[#E5E0D8] shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#FF6A2B]" />
                <h3 className="text-base font-black text-[#14110F] font-poppins">Commande en cours</h3>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-[#9C9488] hover:text-[#C62828] flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vider</span>
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-[#9C9488] text-xs font-medium">
                Panier vide. Touchez un produit du stand pour commencer.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Cart list */}
                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div 
                      key={item.product.id}
                      className="p-3 rounded-2xl bg-[#FBF6EE] border border-[#E5E0D8] flex items-center justify-between text-xs"
                    >
                      <div className="truncate max-w-[140px]">
                        <div className="font-bold text-[#14110F] truncate">{item.product.name}</div>
                        <div className="text-[10px] text-[#9C9488] font-mono">
                          {formatUSD(item.product.priceUSD)} / u
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="w-6 h-6 rounded-full bg-white border border-[#E5E0D8] text-[#14110F] hover:bg-[#F5F3EF] flex items-center justify-center font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-black text-[#14110F] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item.product)}
                          className="w-6 h-6 rounded-full bg-white border border-[#E5E0D8] text-[#14110F] hover:bg-[#F5F3EF] flex items-center justify-center font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Split */}
                <div className="pt-4 border-t border-[#E5E0D8] space-y-2 text-xs">
                  <div className="flex justify-between text-[#4A443D] font-medium">
                    <span>Total Commande :</span>
                    <span className="text-[#14110F] font-mono font-black text-base">{formatUSD(totalAmountUSD)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#FF6A2B] font-mono font-bold">
                    <span>Équivalent Francs Congolais :</span>
                    <span>{formatCDF(totalAmountUSD)}</span>
                  </div>

                  {/* Split Preview */}
                  <div className="p-3 rounded-2xl bg-[#FBF6EE] border border-[#E5E0D8] text-[11px] space-y-1">
                    <div className="flex items-center gap-1 text-[#FF6A2B] font-black">
                      <Heart className="w-3 h-3 text-[#FF6A2B] fill-[#FF6A2B]" />
                      <span>Régularisation Solidaire CFW6 :</span>
                    </div>
                    <div className="flex justify-between text-[#4A443D] font-medium">
                      <span>• Net Reversé au Stand (90%) :</span>
                      <span className="text-[#14110F] font-mono font-bold">{formatUSD(netStand90USD)}</span>
                    </div>
                    <div className="flex justify-between text-[#4A443D] font-medium">
                      <span>• Fondation Congolicious (10%) :</span>
                      <span className="text-[#FF6A2B] font-mono font-bold">{formatUSD(commission10USD)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Trigger Button */}
                <button
                  onClick={() => setScannerOpen(true)}
                  className="w-full py-4 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-sm uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <CreditCard className="w-4 h-4 text-[#14110F]" />
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
        <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#14110F] font-poppins">Ventes enregistrées sur ce stand</h3>
            <span className="text-xs text-[#FF6A2B] font-mono font-bold">
              Total : {formatUSD(activeStand.totalSalesUSD)}
            </span>
          </div>

          {standTransactions.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs font-medium">
              Aucune vente sur ce stand pour le moment.
            </div>
          ) : (
            <div className="space-y-2">
              {standTransactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-[#111827] flex items-center gap-2">
                      <span>{tx.id}</span>
                      {tx.offlineGenerated && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                          Offline Local
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {new Date(tx.timestamp).toLocaleTimeString()} • {tx.paymentMethod}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-[#111827] font-mono">{formatUSD(tx.amountUSD)}</div>
                    <div className="text-[10px] text-slate-500">
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
