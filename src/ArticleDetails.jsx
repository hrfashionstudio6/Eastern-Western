import { useState } from "react";
import { formatPKR, priceAmount } from "../shared/money.js";

export default function ArticleDetails({ product, onAddToCart }) {
  const variants = product.variants || [];
  const [option, setOption] = useState(() => Math.max(0, variants.findIndex(v => Number(v.stock) > 0)));
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const variant = variants[option];
  const gallery = [...new Set([product[5], product[6], ...(product.media || []), ...variants.map(v => v.image)].filter(Boolean))];
  const unique = field => [...new Set(variants.map(v => String(v[field] || "").trim()).filter(Boolean))];
  const colors = unique("color");
  const sizes = unique("size");
  const stock = Math.max(0, Number(variant ? variant.stock : product.stock) || 0);
  const price = variant?.price || product[3];
  const fabric = variant?.material || product.fabric || unique("material").join(", ");
  const select = index => {
    setOption(index);
    setQuantity(1);
    if (variants[index]?.image) setImageIndex(gallery.indexOf(variants[index].image));
  };
  return <section className="section article-layout">
    {(fabric || product.care) && <aside className="article-care">
      <h2>Product Care</h2>
      {fabric && <><h3>Fabric</h3><p>{fabric}</p></>}
      {product.care && <><h3>Care</h3>{product.care.split(/\r?\n/).filter(line => line.trim()).map((line, i) => <p className="care-line" key={i}>{line}</p>)}</>}
    </aside>}
    <div className="article-gallery">
      {gallery.length ? <img className="article-photo" src={gallery[imageIndex] || gallery[0]} alt={product[1]} /> : <div className="media-placeholder">No image</div>}
      {gallery.length > 1 && <div className="article-thumbnails">{gallery.map((src, i) => <button type="button" key={src} className={i === imageIndex ? "active" : ""} onClick={() => setImageIndex(i)} aria-label={`View photo ${i + 1}`}><img src={src} alt="" /></button>)}</div>}
    </div>
    <div className="article-information">
      <div className="article-title"><h1>{product[1]}</h1><span>{stock > 0 ? "In Stock" : "Out of Stock"}</span></div>
      {(variant?.sku || product.sku) && <p className="article-code">{variant?.sku || product.sku}</p>}
      {product.category && <p className="article-code">{product.category}</p>}
      <div className="article-price"><span>Price</span><div><b>{formatPKR(price)}</b>{priceAmount(product[4]) > priceAmount(price) && <s>{formatPKR(product[4])}</s>}</div></div>
      {product.shippingTime && <div className="article-shipping"><span>SHIPPING TIME</span><span>{product.shippingTime}</span></div>}
      {colors.length > 0 && <div className="article-option"><h3>COLOUR</h3><div className="article-choices">{colors.map(color => <button type="button" aria-pressed={variant?.color === color} key={color} onClick={() => select(variants.findIndex(v => v.color === color && (!variant?.size || v.size === variant.size)) >= 0 ? variants.findIndex(v => v.color === color && (!variant?.size || v.size === variant.size)) : variants.findIndex(v => v.color === color))}>{CSS.supports("color", color) && <i style={{ backgroundColor: color }} />}{color}</button>)}</div></div>}
      {sizes.length > 0 && <div className="article-option"><h3>SIZE</h3><div className="article-choices">{sizes.map(size => {
        const index = variants.findIndex(v => v.size === size && (!variant?.color || v.color === variant.color));
        return <button type="button" key={size} aria-pressed={variant?.size === size} disabled={index < 0 || Number(variants[index].stock) <= 0} onClick={() => select(index)}>{size}</button>;
      })}</div></div>}
      {product.sizeChart && <details className="article-description"><summary>Size chart</summary><p>{product.sizeChart}</p></details>}
      <div className="article-option"><h3>QUANTITY</h3><div className="article-quantity"><button type="button" disabled={quantity <= 1} onClick={() => setQuantity(q => q - 1)} aria-label="Decrease quantity">−</button><span>{quantity}</span><button type="button" disabled={quantity >= stock} onClick={() => setQuantity(q => q + 1)} aria-label="Increase quantity">+</button></div><small>{stock} pieces available</small></div>
      <button className="article-add" disabled={stock <= 0} onClick={() => onAddToCart(product, quantity, variant, option)}>{stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}</button>
      {product[7] && <details className="article-description" open><summary>Description</summary><p>{product[7]}</p></details>}
      {variants.length > 0 && <details className="article-description"><summary>All available options</summary><div className="article-options-table"><table><thead><tr><th>Size</th><th>Colour</th><th>Fabric</th><th>Code</th><th>Price</th><th>Stock</th></tr></thead><tbody>{variants.map((v,i) => <tr key={i}><td>{v.size}</td><td>{v.color}</td><td>{v.material}</td><td>{v.sku}</td><td>{formatPKR(v.price || product[3])}</td><td>{v.stock}</td></tr>)}</tbody></table></div></details>}
    </div>
  </section>;
}

