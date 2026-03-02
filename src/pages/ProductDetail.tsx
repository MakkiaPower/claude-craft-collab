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

/** Parse Shopify plain-text description into titled sections */
function parseDescription(raw: string) {
  const sectionHeaders = [
    { emoji: "📌", title: "Cosa ottieni" },
    { emoji: "🔭", title: "Come viene calcolato" },
    { emoji: "🔭", title: "Come viene calcolata" },
    { emoji: "📋", title: "Dati necessari" },
    { emoji: "🎯", title: "A chi è adatto" },
    { emoji: "🎯", title: "A chi è adatta" },
    { emoji: "📦", title: "Formato e consegna" },
  ];

  // Split by emoji markers
  const sections: Array<{ title: string; emoji: string; content: string }> = [];
  let intro = raw;

  for (const header of sectionHeaders) {
    const marker = `${header.emoji} ${header.title}`;
    const idx = raw.indexOf(marker);
    if (idx !== -1) {
      if (sections.length === 0) {
        intro = raw.substring(0, idx).trim();
      }
    }
  }

  // Build sections by splitting on emoji markers
  const allMarkers = sectionHeaders
    .map(h => ({ ...h, marker: `${h.emoji} ${h.title}`, idx: raw.indexOf(`${h.emoji} ${h.title}`) }))
    .filter(h => h.idx !== -1)
    .sort((a, b) => a.idx - b.idx);

  for (let i = 0; i < allMarkers.length; i++) {
    const start = allMarkers[i].idx + allMarkers[i].marker.length;
    const end = i + 1 < allMarkers.length ? allMarkers[i + 1].idx : raw.length;
    const content = raw.substring(start, end).trim();
    sections.push({ title: allMarkers[i].title, emoji: allMarkers[i].emoji, content });
  }

  return { intro, sections };
}

/** Render section content, turning bullet lines into a list */
function SectionContent({ content, sectionTitle }: { content: string; sectionTitle: string }) {
  const hasBullets = content.includes("•");

  if (!hasBullets) {
    return <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>;
  }

  // Split on bullet, skip empty and lines that duplicate the section title
  const parts = content.split("•").map(l => l.trim()).filter(Boolean);
  const textBefore = content.substring(0, content.indexOf("•")).trim();
  const bullets = parts.filter(line => {
    // Remove lines that are just the section title or very similar
    const normalized = line.toLowerCase().replace(/[^a-zàèéìòù\s]/g, "").trim();
    const normalizedTitle = sectionTitle.toLowerCase().replace(/[^a-zàèéìòù\s]/g, "").trim();
    if (normalized === normalizedTitle) return false;
    // Also skip if it's the textBefore repeated
    if (textBefore && line === textBefore) return false;
    return true;
  });

  // Check if textBefore duplicates the title
  const showTextBefore = textBefore && 
    textBefore.toLowerCase().replace(/[^a-zàèéìòù\s]/g, "").trim() !== sectionTitle.toLowerCase().replace(/[^a-zàèéìòù\s]/g, "").trim();

  return (
    <div>
      {showTextBefore && <p className="text-sm text-muted-foreground leading-relaxed mb-3">{textBefore}</p>}
      <ul className="space-y-2">
        {bullets.map((line, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
            <span className="text-primary mt-0.5 flex-shrink-0">•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
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
  const { intro, sections } = parseDescription(product.description);

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

            {/* Payment methods */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground/60 font-bold">Pagamenti sicuri</span>
              <div className="flex gap-2">
                {["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Google Pay"].map((method) => (
                  <span key={method} className="text-[0.6rem] font-bold text-muted-foreground/50 bg-foreground/[0.04] border border-input rounded px-1.5 py-0.5">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Structured description sections */}
        {sections.length > 0 && (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {sections.map((section, i) => (
              <div key={i} className="rounded-lg border border-input bg-foreground/[0.02] p-6">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
                  <span>{section.emoji}</span>
                  {section.title}
                </h3>
                <SectionContent content={section.content} sectionTitle={section.title} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
