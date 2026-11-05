import { useEffect, useRef, useState } from "react";

export default function StoreHeader({ scrolled, cartCount = 0, customer, onSearch, onCart, onAccount, hasOffer = true }) {
  const pathname = window.location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = useRef(null);
  const solid = scrolled || pathname !== "/" || menuOpen;
  const links = [["Women", "/shop"], ["Bags", "/bags"], ["Fragrance", "/fragrance"]];
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const escape = event => { if (event.key === "Escape") { setMenuOpen(false); toggle.current?.focus(); } };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [menuOpen]);
  const icon = (name) => name === "search" ? <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></> : name === "account" ? <><circle cx="12" cy="7.5" r="3.5" /><path d="M4 21v-2a8 8 0 0 1 16 0v2H4Z" /></> : <><path d="M5 7h14l1 15H4L5 7Z" /><path d="M8 8V5a4 4 0 0 1 8 0v3" /></>;
  return <>
    {menuOpen && <button className="lh-backdrop" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    <header className={"launch-header" + (solid ? " is-solid" : "") + (hasOffer ? "" : " no-offer")}>
      <div className="lh-top">
        <button ref={toggle} className="lh-icon lh-menu" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-controls="store-menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}><svg viewBox="0 0 24 24" aria-hidden="true">{menuOpen ? <path d="m5 5 14 14M5 19 19 5" /> : <path d="M3 5h18M3 12h18M3 19h18" />}</svg></button>
        <div className="lh-brand-group">
          <a className="lh-brand" href="/" aria-label="Eastern Western home"><img src="/assets/easternwestern-logo.png" alt="" /><span>Eastern Western</span></a>
          <nav className="lh-categories" aria-label="Collections">{links.map(([label, href]) => <a key={href} href={href} aria-label={label === "Women" ? "Shop Women" : label} aria-current={(href === "/shop" ? pathname.startsWith("/shop") : pathname === href) ? "page" : undefined}>{label}</a>)}</nav>
        </div>
        <div className="lh-actions">
          <button className="lh-icon" type="button" aria-label="Search articles" onClick={onSearch}><svg viewBox="0 0 24 24" aria-hidden="true">{icon("search")}</svg></button>
          <button className="lh-icon" type="button" aria-label={customer ? "Open your account" : "Login or create account"} onClick={onAccount}><svg viewBox="0 0 24 24" aria-hidden="true">{icon("account")}</svg></button>
          <button className="lh-icon lh-cart" type="button" aria-label={"Open cart, " + cartCount + " items"} onClick={onCart}><svg viewBox="0 0 24 24" aria-hidden="true">{icon("cart")}</svg><b>{cartCount}</b></button>
        </div>
      </div>
      {menuOpen && <nav id="store-menu" className="lh-menu-panel" aria-label="Main navigation"><a href="/" onClick={() => setMenuOpen(false)}>Home</a>{links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label === "Women" ? "Shop Women" : label}{href !== "/shop" && <small>Coming soon</small>}</a>)}<button type="button" onClick={() => { setMenuOpen(false); onSearch(); }}>Search articles</button></nav>}
    </header>
  </>;
}
