import { useState } from 'react'
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
import { formatCurrency } from '../utils/formatters'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import styles from './Wishlist.module.css'

function WishlistItem({ product, onRemove, onMoveToBag }) {
  return <article className={styles.item}>
    <Link className={styles.image} to={`/product/${product.slug}`}><img src={product.images[0]} alt={product.name} loading="lazy" />{product.discount > 0 && <span>Save {product.discount}%</span>}</Link>
    <div className={styles.info}><p className={styles.brand}>{product.brand}</p><Link to={`/product/${product.slug}`} className={styles.name}>{product.name}</Link><p className={product.stock > 0 ? styles.stock : styles.outStock}>{product.stock > 0 ? 'In stock' : 'Currently unavailable'}</p><strong className={styles.price}>{formatCurrency(product.price)} {product.oldPrice && <del>{formatCurrency(product.oldPrice)}</del>}</strong><div className={styles.actions}><button className="btn btn--primary" disabled={product.stock === 0} onClick={() => onMoveToBag(product)}><ShoppingBag size={16} /> Move to bag</button><button className={styles.remove} onClick={() => onRemove(product.id)}><Trash2 size={15} /> Remove</button></div></div>
  </article>
}

export default function Wishlist() {
  const { items, count, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [notice, setNotice] = useState('')
  const wishlistedProducts = items.map((id) => products.find((product) => product.id === id)).filter(Boolean)

  function moveToBag(product) {
    addToCart(product)
    removeFromWishlist(product.id)
    setNotice(`${product.name} moved to your bag.`)
  }

  return <section className={`container ${styles.page}`}>
    <div className={styles.heading}><div><p className={styles.eyebrow}>YOUR SAVED FINDS</p><h1>Wishlist <span>({count})</span></h1><p>Keep the things you love close while you decide.</p></div>{count > 0 && <button className={styles.clear} onClick={clearWishlist}><Trash2 size={15} /> Clear wishlist</button>}</div>
    {notice && <p className={styles.notice} role="status">{notice} <Link to="/cart">View bag <ArrowRight size={14} /></Link></p>}
    {wishlistedProducts.length > 0 ? <div className={styles.grid}>{wishlistedProducts.map((product) => <WishlistItem key={product.id} product={product} onRemove={removeFromWishlist} onMoveToBag={moveToBag} />)}</div> : <div className={styles.empty}><span><Heart size={25} /></span><h2>Your wishlist is empty.</h2><p>Save products as you browse and they’ll be waiting here for you.</p><Link to="/shop" className="btn btn--primary">Explore products <ArrowRight size={16} /></Link></div>}
  </section>
}
