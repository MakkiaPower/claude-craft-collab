import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { storefrontApiRequest, STOREFRONT_PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "@/components/CartDrawer";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
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

/** Section headers used in Shopify descriptions */
const SECTION_HEADERS = [
  { emoji: "📌", title: "Cosa ottieni" },
  { emoji: "🔭", title: "Come viene calcolato" },
  { emoji: "🔭", title: "Come viene calcolata" },
  { emoji: "📋", title: "Dati necessari" },
  { emoji: "🎯", title: "A chi è adatto" },
  { emoji: "🎯", title: "A chi è adatta" },
  { emoji: "📦", title: "Formato e consegna" },
];

function parseDescription(raw: string) {
  const sections: Array<{ title: string; emoji: string; content: string }> = [];

  const allMarkers = SECTION_HEADERS
    .map(h => ({ ...h, marker: `${h.emoji} ${h.title}`, idx: raw.indexOf(`${h.emoji} ${h.title}`) }))
    .filter(h => h.idx !== -1)
    .sort((a, b) => a.idx - b.idx);

  for (let i = 0; i < allMarkers.length; i++) {
    const start = allMarkers[i].idx + allMarkers[i].marker.length;
    const end = i + 1 < allMarkers.length ? allMarkers[i + 1].idx : raw.length;
    sections.push({ title: allMarkers[i].title, emoji: allMarkers[i].emoji, content: raw.substring(start, end).trim() });
  }

  return sections;
}

function SectionContent({ content, sectionTitle }: { content: string; sectionTitle: string }) {
  const hasBullets = content.includes("•");

  if (!hasBullets) {
    return <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>;
  }

  const parts = content.split("•").map(l => l.trim()).filter(Boolean);
  const textBefore = content.substring(0, content.indexOf("•")).trim();
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-zàèéìòù\s]/g, "").trim();
  const normalizedTitle = normalize(sectionTitle);

  const bullets = parts.filter(line => {
    if (normalize(line) === normalizedTitle) return false;
    if (textBefore && line === textBefore) return false;
    return true;
  });

  const showTextBefore = textBefore && normalize(textBefore) !== normalizedTitle;

  return (
    <div>
      {showTextBefore && <p className="text-sm text-muted-foreground leading-relaxed mb-2.5">{textBefore}</p>}
      <ul className="space-y-1.5">
        {bullets.map((line, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
            <span className="text-primary mt-0.5 flex-shrink-0 text-xs">•</span>
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
  const sections = parseDescription(product.description);

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
    <div className="flex min-h-dvh flex-col px-4 sm:px-5 py-4 sm:py-8">
      {/* Header */}
      <header className="mx-auto w-full max-w-4xl flex items-center justify-between mb-4 sm:mb-10">
        <Link to="/shop" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors active:scale-95">
          <ArrowLeft className="h-4 w-4" />
          <img src={logo} alt="AstroBastardo" className="h-7 w-7 object-contain" width={28} height={28} />
        </Link>
        <CartDrawer />
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-10">
          {/* Image */}
          <div>
            <div className="aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden bg-foreground/[0.04]">
              {images[selectedImage] ? (
                <img src={images[selectedImage].node.url} alt={images[selectedImage].node.altText || product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-xs uppercase">No image</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1 -mx-1 px-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg border overflow-hidden flex-shrink-0 transition-all ${i === selectedImage ? 'border-primary ring-1 ring-primary/30' : 'border-input opacity-60 hover:opacity-100'}`}>
                    <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info + CTA */}
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-2xl font-extrabold uppercase tracking-tight mb-1">{product.title}</h1>
            <p className="text-xl sm:text-2xl font-extrabold text-primary mb-4 sm:mb-5">
              €{parseFloat(variant?.price.amount || "0").toFixed(2)}
            </p>

            {/* Variant selector */}
            {product.variants.edges.length > 1 && (
              <div className="mb-4 sm:mb-5">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground mb-2">Variante</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map((v, i) => (
                    <button
                      key={v.node.id}
                      onClick={() => setSelectedVariantIdx(i)}
                      className={`px-3 py-2 sm:py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
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

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              disabled={!variant?.availableForSale || isCartLoading}
              className="w-full rounded-lg bg-primary px-4 py-[18px] sm:py-4 text-[0.82rem] font-extrabold uppercase tracking-[3px] text-primary-foreground transition-all hover:brightness-90 active:brightness-75 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCartLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {variant?.availableForSale ? "Aggiungi al Carrello" : "Esaurito"}
            </button>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 text-muted-foreground/50 flex-wrap">
              <span className="flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-wider">
                <ShieldCheck className="h-3 w-3" />
                Pagamento sicuro
              </span>
              <span className="text-[0.6rem] font-bold uppercase tracking-wider">PDF digitale</span>
              <span className="text-[0.6rem] font-bold uppercase tracking-wider">Consegna 48h</span>
            </div>

            {/* Quick info from first 2 sections inline */}
            {sections.length > 0 && (
              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-input/50 space-y-4 sm:space-y-5">
                {sections.slice(0, 2).map((section, i) => (
                  <div key={i}>
                    <h3 className="text-[0.7rem] font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center gap-1.5">
                      <span>{section.emoji}</span>
                      {section.title}
                    </h3>
                    <SectionContent content={section.content} sectionTitle={section.title} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Remaining sections as cards below */}
        {sections.length > 2 && (
          <div className="mt-8 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
            {sections.slice(2).map((section, i) => (
              <div key={i} className="rounded-xl border border-input bg-foreground/[0.02] p-4 sm:p-5">
                <h3 className="text-[0.7rem] font-extrabold uppercase tracking-widest text-foreground mb-2.5 sm:mb-3 flex items-center gap-1.5">
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
