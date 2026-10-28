import React, { useState } from 'react';
import { Product } from '../data/flavors.ts';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const { t } = useTranslation();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 35.0;
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.15 : 0;
  const total = Math.max(0, subtotal - discount);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingUnlocked = remainingForFreeShipping === 0;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'MANA15' || promoCode.trim().length > 2) {
      setPromoApplied(true);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      alert(t('cart.checkout_alert'));
      setIsCheckingOut(false);
      onClearCart();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-lg font-extrabold uppercase tracking-tight text-neutral-900">
                {t('cart.your_cart')} ({items.reduce((c, i) => c + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-6 py-3.5 bg-neutral-50 border-b border-neutral-200/60 text-xs">
            <div className="flex items-center justify-between font-bold text-neutral-800 mb-1.5">
              <span>
                {freeShippingUnlocked
                  ? t('cart.free_shipping_unlocked')
                  : t('cart.away_from_free_shipping', { amount: remainingForFreeShipping.toFixed(2) })}
              </span>
              <span>${FREE_SHIPPING_THRESHOLD.toFixed(2)}</span>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 py-12">
                <ShoppingBag className="w-12 h-12 stroke-[1.5] mb-3 opacity-40" />
                <p className="text-base font-semibold text-neutral-700 mb-1">
                  {t('cart.empty_title')}
                </p>
                <p className="text-xs text-neutral-500 max-w-xs mb-6">
                  {t('cart.empty_desc')}
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  {t('cart.start_shopping')}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemName =
                  item.product.id === 'discovery-box'
                    ? t('shop.discovery_title')
                    : `${t(`flavors.${item.product.flavorId}.name`)} 12-Pack`;

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 items-center justify-between"
                  >
                    <img
                      src={item.product.thumb}
                      alt={item.product.name}
                      className="w-16 h-16 object-contain rounded-xl bg-white p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="text-sm font-bold text-neutral-900 truncate">
                        {itemName}
                      </h3>
                      <div className="text-xs font-semibold text-neutral-500 mb-2">
                        ${item.product.price.toFixed(2)}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-neutral-300 rounded-lg bg-white">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 hover:bg-neutral-100 text-neutral-600 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 hover:bg-neutral-100 text-neutral-600 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm font-extrabold text-neutral-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-white space-y-4">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('cart.promo_placeholder')}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs uppercase tracking-wider focus:outline-hidden focus:border-neutral-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  {t('cart.apply')}
                </button>
              </form>

              {promoApplied && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('cart.promo_applied')}</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-semibold text-neutral-900">${subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-emerald-600">
                    <span>{t('cart.discount')}</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t('cart.shipping')}</span>
                  <span className="font-semibold text-neutral-900">
                    {freeShippingUnlocked ? t('cart.free') : '$4.99'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-neutral-950 pt-2 border-t border-neutral-200">
                  <span>{t('cart.total')}</span>
                  <span>${(total + (freeShippingUnlocked ? 0 : 4.99)).toFixed(2)} CAD</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 rounded-full bg-neutral-950 text-white font-extrabold text-xs uppercase tracking-widest hover:bg-neutral-800 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <span>{isCheckingOut ? t('cart.processing') : t('cart.checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
