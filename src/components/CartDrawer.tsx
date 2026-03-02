import { useState, useEffect, useMemo } from "react";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import BirthDataForm from "@/components/BirthDataForm";

function detectProductType(items: { product: { node: { title: string; handle: string } } }[]): "tema-natale" | "affinita" | null {
  for (const item of items) {
    const t = (item.product.node.title + " " + item.product.node.handle).toLowerCase();
    if (t.includes("affinit")) return "affinita";
    if (t.includes("tema") || t.includes("natale")) return "tema-natale";
  }
  return null;
}

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart, updateNote, birthDataNote } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  const productType = useMemo(() => detectProductType(items), [items]);
  const needsBirthData = productType !== null;
  const hasBirthData = !!birthDataNote;

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      setIsOpen(false);
    }
  };

  const handleBirthDataComplete = async (note: string) => {
    const success = await updateNote(note);
    if (success) {
      handleCheckout();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded hover:bg-foreground/5 transition-colors">
          <ShoppingCart className="h-5 w-5 text-foreground" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[0.65rem] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-[92vw] sm:max-w-lg flex flex-col h-full bg-background border-input">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="text-foreground">Carrello</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Il carrello è vuoto" : `${totalItems} articol${totalItems !== 1 ? 'i' : 'o'} nel carrello`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">Il tuo carrello è vuoto</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 p-2 rounded-lg border border-input">
                      <div className="w-16 h-16 bg-foreground/[0.06] rounded-md overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate text-foreground">{item.product.node.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.selectedOptions.map(o => o.value).join(' • ')}</p>
                        <p className="font-bold text-sm text-primary">{item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button onClick={() => removeItem(item.variantId)} className="p-1 hover:bg-destructive/10 rounded transition-colors">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="h-6 w-6 rounded border border-input flex items-center justify-center hover:bg-foreground/5">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="h-6 w-6 rounded border border-input flex items-center justify-center hover:bg-foreground/5">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Birth data form */}
                {needsBirthData && !hasBirthData && (
                  <BirthDataForm
                    type={productType}
                    onComplete={handleBirthDataComplete}
                    isLoading={isLoading}
                  />
                )}
              </div>

              <div className="flex-shrink-0 space-y-4 pt-4 border-t border-input">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">Totale</span>
                  <span className="text-lg font-extrabold text-primary">{items[0]?.price.currencyCode} {totalPrice.toFixed(2)}</span>
                </div>

                {needsBirthData && !hasBirthData ? (
                  <p className="text-[0.7rem] text-muted-foreground text-center">
                    ⬆️ Compila i dati di nascita per procedere al checkout
                  </p>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={items.length === 0 || isLoading || isSyncing}
                    className="w-full rounded bg-primary px-4 py-3.5 text-[0.82rem] font-extrabold uppercase tracking-[2px] text-primary-foreground transition-all hover:brightness-90 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ExternalLink className="w-4 h-4" />Vai al Checkout</>}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
