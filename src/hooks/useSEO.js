import { useEffect } from 'react';

const BASE_URL = 'https://fingerbible.com';

/**
 * SEO 메타태그를 동적으로 업데이트하는 훅
 * - document.title
 * - meta description, keywords
 * - canonical URL
 * - Open Graph (og:*) 태그
 * - Twitter Card 태그
 * - JSON-LD 구조화 데이터
 */
export function useSEO({ title, description, path, jsonLd, keywords }) {
  useEffect(() => {
    const url = `${BASE_URL}${path || ''}`;

    // Title
    document.title = title;

    // Meta tags
    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);

    // Canonical
    setLink('canonical', url);

    // Open Graph
    setMetaProperty('og:type', 'website');
    setMetaProperty('og:site_name', '손가락 성경');
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:url', url);
    setMetaProperty('og:image', `${BASE_URL}/icon-512.png`);
    setMetaProperty('og:locale', 'ko_KR');

    // Twitter Card
    setMeta('twitter:card', 'summary');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', `${BASE_URL}/icon-512.png`);

    // JSON-LD
    if (jsonLd) {
      let script = document.getElementById('seo-jsonld');
      if (!script) {
        script = document.createElement('script');
        script.id = 'seo-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      // Cleanup JSON-LD on unmount
      const script = document.getElementById('seo-jsonld');
      if (script) script.remove();
    };
  }, [title, description, path, jsonLd, keywords]);
}

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaProperty(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}
