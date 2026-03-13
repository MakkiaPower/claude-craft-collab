import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

const BASE_URL = "https://astrobastardo.it";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

function setMetaTag(property: string, content: string, isName = false) {
  const attr = isName ? "name" : "property";
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

function setRobotsMeta(noindex: boolean) {
  let el = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
  if (noindex) {
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", "robots");
      document.head.appendChild(el);
    }
    el.setAttribute("content", "noindex, nofollow");
  } else if (el) {
    el.remove();
  }
}

export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = meta.title;

    setMetaTag("description", meta.description, true);
    setCanonical(meta.canonical || `${BASE_URL}${window.location.pathname}`);

    setMetaTag("og:title", meta.ogTitle || meta.title);
    setMetaTag("og:description", meta.ogDescription || meta.description);
    setMetaTag("og:image", meta.ogImage || DEFAULT_OG_IMAGE);
    setMetaTag("og:type", meta.ogType || "website");
    setMetaTag("og:url", meta.canonical || `${BASE_URL}${window.location.pathname}`);

    setMetaTag("twitter:title", meta.ogTitle || meta.title);
    setMetaTag("twitter:description", meta.ogDescription || meta.description);
    setMetaTag("twitter:image", meta.ogImage || DEFAULT_OG_IMAGE);

    setRobotsMeta(meta.noindex || false);

    return () => {
      document.title = prevTitle;
    };
  }, [meta.title, meta.description, meta.canonical, meta.ogTitle, meta.ogDescription, meta.ogImage, meta.ogType, meta.noindex]);
}
