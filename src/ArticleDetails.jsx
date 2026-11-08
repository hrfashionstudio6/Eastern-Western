import { whatsappLink } from "../shared/storefront.js";
import { useEffect, useRef, useState } from "react";
import { formatPKR, priceAmount } from "../shared/money.js";
import { descriptionSections, matchingVariant, splitSizes } from "../shared/article-options.js";

export function ColourName({ value }) {
  return <span className="colour-name">{String(value || "").trim() || "Colour as pictured"}</span>;
}

function DetailText({ text }) {
  return <div className="pdp-detail-text">{String(text || "").split(/\n\s*\n/).map(block => block.trim()).filter(Boolean).map((block, index) => {
    const colon = block.indexOf(":");
    if (colon > 0 && colon < 56) return <div className="pdp-detail-line" key={index}><strong>{block.slice(0, colon)}</strong><p>{block.slice(colon + 1).trim()}</p></div>;
    return <p key={index}>{block}</p>;
  })}</div>;
}

export default function ArticleDetails({ product, onAddToCart, contactUrl = whatsappLink() }) {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const first = variants[0];
  const initialColor = String(first?.color || "").trim();
  const initialSizes = [...new Set(variants.filter(variant => !initialColor || String(variant.color || "").trim() === initialColor).flatMap(variant => splitSizes(variant.size)))];
  const [selection, setSelection] = useState(() => ({ color: initialColor, size: initialSizes.length === 1 ? initialSizes[0] : "" }));
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const dialog = useRef(null);
  const sizeDialog = useRef(null);
  const chartSections = product.sizeChartTable?.sections || [];
  const hasSizeChart = chartSections.length > 0 || Boolean(product.sizeChartImage);
  const colors = [...new Set(variants.map(variant => String(variant.color || "").trim()).filter(Boolean))];
  const sizes = [...new Set(variants.flatMap(variant => splitSizes(variant.size)))];
  const index = matchingVariant(variants, selection.color, selection.size, product);
  const variant = variants[index];
  const price = variant?.price || product[3];
  const oldPrice = priceAmount(product[4]);
  const discount = oldPrice > priceAmount(price) ? Math.round((1 - priceAmount(price) / oldPrice) * 100) : 0;
  const fabric = variant?.material || product.fabric || "";
  const sections = descriptionSections(product[7]);
  // The article's colours lead its details, as listed in the product sheet.
  const productDetails = [colors.length && "Colour: " + colors.join(", "), sections.details].filter(Boolean).join("\n\n");
  const care = product.care || sections.care;
  const gallery = [...new Set([product[5], product[6], ...(product.media || []), ...variants.map(variant => variant.image)].filter(Boolean))];
  const activeImage = gallery[imageIndex] || gallery[0];
  const needsSize = sizes.length > 0 && !selection.size;
  const canAdd = !needsSize && (!variants.length || index >= 0);

  useEffect(() => {
    if (!zoomOpen) return undefined;
    const modal = dialog.current;
    modal?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (modal?.open) modal.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [zoomOpen]);

  const showVariantImage = next => {
    if (!next?.image) return;
    const nextImage = gallery.indexOf(next.image);
    if (nextImage >= 0) setImageIndex(nextImage);
  };
  const selectColor = color => {
    const keepSize = selection.size && matchingVariant(variants, color, selection.size, product) >= 0;
    const nextSize = keepSize ? selection.size : "";
    setSelection({ color, size: nextSize });
    setQuantity(1);
    showVariantImage(variants[matchingVariant(variants, color, nextSize, product)]);
  };
  const selectSize = size => {
    setSelection(current => ({ ...current, size }));
    setQuantity(1);
    showVariantImage(variants[matchingVariant(variants, selection.color, size, product)]);
  };
  const nextPhoto = direction => setImageIndex(current => (current + direction + gallery.length) % gallery.length);
  const addToCart = (buyNow = false) => {
    if (!canAdd) return;
    const chosen = variant ? { ...variant, size: selection.size || variant.size } : undefined;
    onAddToCart(product, quantity, chosen, index + ":" + selection.size, buyNow);
  };

  return <section className="section product-detail-page">
    <nav className="pdp-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/shop">Shop</a><span aria-hidden="true">/</span><span aria-current="page">{product[1]}</span></nav>
    <div className="pdp-body">
      <div className="pdp-gallery">
        <div className="pdp-main-media">
          {activeImage ? <button type="button" className="pdp-photo-button" onClick={() => setZoomOpen(true)} aria-label={"Open larger photo of " + product[1]}><img className="pdp-photo" src={activeImage} alt={product[1] + " — photo " + (imageIndex + 1)} /><span className="pdp-zoom-hint">View larger ↗</span></button> : <div className="pdp-no-image">Photo coming soon</div>}
          {gallery.length > 1 && <><span className="pdp-photo-count">{imageIndex + 1} / {gallery.length}</span><button type="button" className="pdp-photo-arrow pdp-photo-prev" onClick={() => nextPhoto(-1)} aria-label="Previous product photo">‹</button><button type="button" className="pdp-photo-arrow pdp-photo-next" onClick={() => nextPhoto(1)} aria-label="Next product photo">›</button></>}
        </div>
        {gallery.length > 1 && <div className="pdp-thumbnails" aria-label="Product photos">{gallery.map((src, photoIndex) => <button type="button" key={src} className={photoIndex === imageIndex ? "is-active" : ""} aria-pressed={photoIndex === imageIndex} onClick={() => setImageIndex(photoIndex)} aria-label={"View photo " + (photoIndex + 1)}><img src={src} alt="" loading="lazy" /></button>)}</div>}
      </div>
      <div className="pdp-information">
        <div className="pdp-heading-row"><p className="pdp-category">{product.category || "Eastern Western"}</p></div>
        <h1 className="pdp-title">{product[1]}</h1>
        {(variant?.sku || product.sku) && <p className="pdp-code">Article code: {variant?.sku || product.sku}</p>}
        <div className="pdp-price"><strong>{formatPKR(price)}</strong>{oldPrice > priceAmount(price) && <s>{formatPKR(product[4])}</s>}{discount > 0 && <span>Save {discount}%</span>}</div>
        {fabric && <p className="pdp-fabric"><span>Fabric</span>{fabric}</p>}

        {colors.length > 0 && <fieldset className="pdp-option"><legend>Colour</legend><div className="pdp-color-options">{colors.map((color, colorIndex) => {
          const available = matchingVariant(variants, color, "", product) >= 0;
          return <button type="button" className="pdp-color-choice" key={color} aria-label={"Colour option " + (colorIndex + 1) + ": " + color} aria-pressed={selection.color === color} disabled={!available} onClick={() => selectColor(color)}><ColourName value={color} />{selection.color === color && <span className="pdp-color-check" aria-hidden="true">✓</span>}</button>;
        })}</div></fieldset>}

        {sizes.length > 0 && <fieldset className="pdp-option"><legend>Size {selection.size && <span>— {selection.size}</span>}</legend><div className="pdp-sizes">{sizes.map(size => {
          const available = matchingVariant(variants, selection.color, size, product) >= 0;
          return <button type="button" key={size} aria-pressed={selection.size === size} disabled={!available} onClick={() => selectSize(size)}>{size}</button>;
        })}</div><div className="pdp-size-help"><span>{needsSize ? "Choose your size" : "Selected size: " + selection.size}</span><span className="pdp-size-links">{hasSizeChart && <button type="button" className="pdp-size-chart-link" onClick={() => sizeDialog.current?.showModal()}>Size chart</button>}<a href={contactUrl} target="_blank" rel="noopener noreferrer">Need help with size?</a></span></div></fieldset>}

        <div className="pdp-purchase" data-float-clear>
          <div className="pdp-quantity-label">Quantity</div>
          <div className="pdp-purchase-controls"><div className="pdp-quantity"><button type="button" disabled={quantity <= 1} onClick={() => setQuantity(current => Math.max(1, current - 1))} aria-label="Decrease quantity">−</button><output aria-label="Quantity" aria-live="polite">{quantity}</output><button type="button" onClick={() => setQuantity(current => current + 1)} aria-label="Increase quantity">+</button></div><button type="button" className="pdp-add" disabled={!canAdd} onClick={() => addToCart()}>{needsSize ? "Select a size" : "Add to cart"}</button></div>
          <button type="button" className="pdp-buy-now" disabled={!canAdd} onClick={() => addToCart(true)}>{needsSize ? "Choose a size to buy" : "Buy now"}</button>
          <p className="pdp-payment">Prices in PKR <span aria-hidden="true">·</span> Cash on Delivery</p>
        </div>

        <div className="pdp-details">
          {productDetails && <details open><summary>Product details<span aria-hidden="true">+</span></summary><DetailText text={productDetails} /></details>}
          {(fabric || care) && <details><summary>Fabric & care<span aria-hidden="true">+</span></summary>{fabric && <p className="pdp-care-fabric">{fabric}</p>}{care && <DetailText text={care} />}</details>}
          {sections.styling && <details><summary>Styling notes<span aria-hidden="true">+</span></summary><DetailText text={sections.styling} /></details>}
          {product.sizeChart && <details><summary>Size guide<span aria-hidden="true">+</span></summary><DetailText text={product.sizeChart} /></details>}
          {product.shippingTime && <details><summary>Delivery information<span aria-hidden="true">+</span></summary><DetailText text={product.shippingTime} /></details>}
        </div>
      </div>
    </div>
    {hasSizeChart && <dialog ref={sizeDialog} className="pdp-size-chart" aria-label={"Size chart for " + product[1]} onClick={event => { if (event.target === event.currentTarget) sizeDialog.current.close(); }}>
      <div className="pdp-size-chart-content">
        <div className="pdp-zoom-toolbar"><span>Size chart · {product[1]}</span><button type="button" onClick={() => sizeDialog.current.close()} aria-label="Close size chart">✕</button></div>
        {chartSections.map((section) => <table className="size-chart-table" key={section.title}>
          <caption>{section.title}</caption>
          <thead><tr><th scope="col">Measurement</th>{section.sizes.map((size) => <th scope="col" key={size}>{size}</th>)}</tr></thead>
          <tbody>{section.rows.map(([label, ...values]) => <tr key={label}><th scope="row">{label}</th>{values.map((value, index) => <td key={index}>{value}</td>)}</tr>)}</tbody>
        </table>)}
        {product.sizeChartImage && <img src={product.sizeChartImage} alt={"Size chart for " + product[1]} />}
      </div>
    </dialog>}
    <dialog ref={dialog} className="pdp-zoom" onCancel={() => setZoomOpen(false)} aria-label={"Photos of " + product[1]} onClick={event => { if (event.target === event.currentTarget) setZoomOpen(false); }}>
      <div className="pdp-zoom-content"><div className="pdp-zoom-toolbar"><span>{product[1]} · {imageIndex + 1} / {gallery.length}</span><button type="button" autoFocus onClick={() => setZoomOpen(false)} aria-label="Close larger photo">✕</button></div><img src={activeImage} alt={product[1] + " — photo " + (imageIndex + 1)} />{gallery.length > 1 && <div className="pdp-zoom-controls"><button type="button" onClick={() => nextPhoto(-1)} aria-label="Previous enlarged photo">‹ Previous</button><button type="button" onClick={() => nextPhoto(1)} aria-label="Next enlarged photo">Next ›</button></div>}</div>
    </dialog>
  </section>;
}
