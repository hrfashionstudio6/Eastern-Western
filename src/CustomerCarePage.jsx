import { customerCareLinks, policyBlocks } from "../shared/customer-care.js";

function InlineText({ text }) {
  return String(text || "").split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith("**") && part.endsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : part);
}

function PolicyText({ body }) {
  return <div className="care-prose">{policyBlocks(body).map((block, index) => {
    if (block.type === "heading") return <h2 key={index}><InlineText text={block.text} /></h2>;
    if (block.type === "list") return <ul key={index}>{block.items.map((text, itemIndex) => <li key={itemIndex}><InlineText text={text} /></li>)}</ul>;
    return <p key={index}><InlineText text={block.text} /></p>;
  })}</div>;
}

export default function CustomerCarePage({ page, path, settings = {}, contactUrl, onOpenAccount, customerAccount }) {
  const email = settings.contactEmail || "help@easternwestern.net";
  const phone = settings.contactPhone || "+923035721398";
  const showContacts = page.kind === "support";
  return <section className="care-page">
    <nav className="care-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/customer-care">Customer Care</a>{path !== "/customer-care" && <><span aria-hidden="true">/</span><span aria-current="page">{page.label}</span></>}</nav>
    <header className="care-heading"><p>Eastern Western · Customer Care</p><h1>{page.title}</h1></header>
    <div className="care-layout">
      <nav className="care-sidebar" aria-label="Customer Care pages"><p>Customer Care</p>{customerCareLinks.map(link => <a key={link.href} href={link.href} aria-current={path === link.href ? "page" : undefined}>{link.label}<span aria-hidden="true">↗</span></a>)}</nav>
      <article className="care-content" aria-label={page.title}>
        <PolicyText body={page.body} />
        {page.kind === "tracking" && <div className="care-tracking-actions"><button type="button" className="care-action" onClick={onOpenAccount}>{customerAccount ? "View my orders" : "Sign in & view orders"}<span aria-hidden="true">→</span></button><p>Order status is available in your account. For courier delivery progress, use the Tracking ID on the courier's website.</p></div>}
        {showContacts && <div className="care-contact-grid"><a href={contactUrl} target="_blank" rel="noopener noreferrer"><span>WhatsApp</span><strong>Chat with our team ↗</strong><small>{phone}</small></a><a href={`mailto:${email}`}><span>Email</span><strong>{email}</strong><small>Article and order enquiries</small></a></div>}
        <div className="care-bottom"><div><strong>Need help with an article or order?</strong><p>Contact our team with your article code or order number.</p></div><a className="care-action" href={contactUrl} target="_blank" rel="noopener noreferrer">Chat on WhatsApp<span aria-hidden="true">↗</span></a></div>
      </article>
    </div>
  </section>;
}
