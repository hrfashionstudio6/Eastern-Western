import { useEffect, useState } from "react";

const isPage = (path) => /^\/(?:about|shop(?:\/[^/]+)?|blog(?:\/[^/]+)?|contact|checkout|admin(?:\/[^/]+)*)?\/?$/.test(path);

export default function useSiteRoute() {
  const [route, setRoute] = useState(() => window.location.pathname + window.location.search + window.location.hash);
  useEffect(() => {
    const update = () => setRoute(window.location.pathname + window.location.search + window.location.hash);
    const navigate = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest?.("a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self") || link.relList.contains("external")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || !isPage(url.pathname)) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;
      event.preventDefault();
      if (url.href === window.location.href) return;
      window.history.pushState(null, "", url.pathname + url.search + url.hash);
      update();
    };
    document.addEventListener("click", navigate);
    window.addEventListener("popstate", update);
    window.addEventListener("hashchange", update);
    return () => {
      document.removeEventListener("click", navigate);
      window.removeEventListener("popstate", update);
      window.removeEventListener("hashchange", update);
    };
  }, []);
  return route;
}

