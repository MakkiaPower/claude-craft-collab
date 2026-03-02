import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { storefrontApiRequest, STOREFRONT_PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "@/components/CartDrawer";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/astrobastardo-logo.png";

interface ProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: { id: string; title: string; price: { amount: string; currencyCode: string }; availableForSale: boolean; selectedOptions: Array<{ name: string; value: string }> } }> };
  options: Array<{ name: string; values: string[] }>;
}

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ProductNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore(state => state.addItem);
  const isCartLoading = useCartStore(state => state.isLoading);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, { handle });
        setProduct(data?.data?.productByHandle || null);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [handle]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-dvh items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Prodotto non trovato</p>
        <Link to="/shop" className="text-primary underline text-sm font-bold">Torna allo shop</Link>
      </div>
    );
  }

  const variant = product.variants.edges[selectedVariantIdx]?.node;
  const images = product.images.edges;

  const handleAddToCart = async () => {
    if (!variant?.availableForSale) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast({ title: "Aggiunto al carrello! 🛒", description: product.title });
  };

  return (
    <div className="flex min-h-dvh flex-col px-5 py-8">
      <header className="mx-auto w-full max-w-5xl flex items-center justify-between mb-10">
        <Link to="/shop" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <img src={logo} alt="AstroBastardo" className="h-8 w-8 object-contain" width={32} height={32} />
        </Link>
        <CartDrawer />
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-foreground/[0.04] mb-3">
              {images[selectedImage] ? (
                <img src={images[selectedImage].node.url} alt={images[selectedImage].node.altText || product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-xs uppercase">No image</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-16 rounded border overflow-hidden flex-shrink-0 ${i === selectedImage ? 'border-primary' : 'border-input'}`}>
                    <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-extrabold uppercase tracking-tight mb-2">{product.title}</h1>
            <p className="text-lg font-extrabold text-primary mb-4">
              {variant?.price.currencyCode} {parseFloat(variant?.price.amount || "0").toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            {/* Variant selector */}
            {product.variants.edges.length > 1 && (
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Variante</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map((v, i) => (
                    <button
                      key={v.node.id}
                      onClick={() => setSelectedVariantIdx(i)}
                      className={`px-3 py-1.5 rounded border text-xs font-bold uppercase tracking-wider transition-all ${
                        i === selectedVariantIdx
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-input text-muted-foreground hover:border-foreground/30'
                      } ${!v.node.availableForSale ? 'opacity-40 line-through cursor-not-allowed' : ''}`}
                      disabled={!v.node.availableForSale}
                    >
                      {v.node.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!variant?.availableForSale || isCartLoading}
              className="w-full rounded bg-primary px-4 py-4 text-[0.82rem] font-extrabold uppercase tracking-[3px] text-primary-foreground transition-all hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCartLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {variant?.availableForSale ? "Aggiungi al Carrello" : "Esaurito"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
