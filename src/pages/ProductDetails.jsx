import { useEffect, useState } from 'react'
import { ChevronRight, Heart, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { products } from '../data/products'
import { categories } from '../data/categories'
import { useProduct } from '../hooks/useProduct'
import { formatCurrency } from '../utils/formatters'
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/common/LoadingSpinner'
import styles from './ProductDetails.module.css'

function Price({ product }) {
  return <div className={styles.priceLine}><strong>{formatCurrency(product.price)}</strong>{product.oldPrice && <del>{formatCurrency(product.oldPrice)}</del>}{product.discount > 0 && <span className={styles.discount}>{product.discount}% off</span>}</div>
}

function MiniProduct({ product }) {
  return <Link className={styles.miniProduct} to={`/product/${product.slug}`}><div><img src={product.images[0]} alt="" loading="lazy" /></div><p>{product.brand}</p><strong>{product.name}</strong><span>{formatCurrency(product.price)}</span></Link>
}

export default function ProductDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { product, isLoading } = useProduct(slug)
  const [imageIndex, setImageIndex] = useState(0)
  const [colorName, setColorName] = useState('')
  const [sizeName, setSizeName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [cartNotice, setCartNotice] = useState(false)
  const [reviewsByProduct, setReviewsByProduct] = useState(() => readStorage(STORAGE_KEYS.reviews, {}, (value) => value && typeof value === 'object' && !Array.isArray(value)))
  const [reviewRating, setReviewRating] = useState('5')
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewerName, setReviewerName] = useState('')
  const [reviewNotice, setReviewNotice] = useState('')
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { user } = useAuth()
  const category = product && categories.find((item) => item.slug === product.category)
  const selectedColor = product?.colors.find((color) => color.name === colorName) ?? product?.colors[0]
  const recentlyViewed = readStorage(STORAGE_KEYS.recentlyViewed, [], Array.isArray)
    .map((id) => products.find((item) => item.id === id))
    .filter((item) => item && item.slug !== slug)
    .slice(0, 4)

  useEffect(() => {
    if (!product) return
    const recent = readStorage(STORAGE_KEYS.recentlyViewed, [], Array.isArray)
    writeStorage(STORAGE_KEYS.recentlyViewed, [product.id, ...recent.filter((id) => id !== product.id)].slice(0, 8))
  }, [product])

  if (isLoading) return <LoadingSpinner label="Loading product" />

  if (!product) {
    return <section className={`container ${styles.notFound}`}><p className={styles.eyebrow}>PRODUCT NOT FOUND</p><h1>That product isn’t in our collection.</h1><p>It may have moved or sold out. Browse the full NOVA collection to find something else.</p><Link to="/shop" className="btn btn--primary">Browse products <ChevronRight size={16} /></Link></section>
  }

  const localReviews = Array.isArray(reviewsByProduct[product.id]) ? reviewsByProduct[product.id] : []
  const localRatingTotal = localReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0)
  const totalReviewCount = product.reviewCount + localReviews.length
  const averageRating = ((product.rating * product.reviewCount + localRatingTotal) / totalReviewCount).toFixed(1)
  const relatedProducts = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4)
  const stockMessage = product.stock === 0 ? 'Currently unavailable' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock and ready to ship'

  function changeQuantity(amount) {
    setQuantity((current) => Math.max(1, Math.min(product.stock || 1, current + amount)))
  }

  function handleAddToCart() {
    addToCart(product, quantity, { color: selectedColor?.name, size: sizeName || null })
    setCartNotice(true)
  }

  function handleBuyNow() {
    addToCart(product, quantity, { color: selectedColor?.name, size: sizeName || null })
    navigate('/checkout')
  }

  function submitReview(event) {
    event.preventDefault()
    const saved = readStorage(STORAGE_KEYS.reviews, {}, (value) => value && typeof value === 'object' && !Array.isArray(value))
    const nextReviews = [{
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: (user?.name || reviewerName).trim(),
      rating: Number(reviewRating),
      title: reviewTitle.trim(),
      text: reviewText.trim(),
      createdAt: new Date().toISOString(),
    }, ...(Array.isArray(saved[product.id]) ? saved[product.id] : [])]
    if (!writeStorage(STORAGE_KEYS.reviews, { ...saved, [product.id]: nextReviews })) {
      setReviewNotice('Your review could not be saved in this browser. Please try again.')
      return
    }
    setReviewsByProduct({ ...saved, [product.id]: nextReviews })
    setReviewRating('5')
    setReviewTitle('')
    setReviewText('')
    setReviewerName('')
    setReviewNotice('Thanks for sharing your review. It is saved locally on this device.')
  }

  return (
    <div className={styles.page}>
      <div className={`container ${styles.breadcrumbs}`} aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={14} /><Link to="/categories">Categories</Link>{category && <><ChevronRight size={14} /><Link to={`/category/${category.slug}`}>{category.name}</Link></>}<ChevronRight size={14} /><span>{product.name}</span></div>

      <section className={`container ${styles.productLayout}`}>
        <div className={styles.gallery}>
          <div className={styles.mainImage}><img src={product.images[imageIndex] ?? product.images[0]} alt={`${product.name}${imageIndex ? `, view ${imageIndex + 1}` : ''}`} />{product.discount > 0 && <span className={styles.imageBadge}>Save {product.discount}%</span>}</div>
          <div className={styles.thumbnails} aria-label="Product images">{product.images.map((image, index) => <button key={image} className={index === imageIndex ? styles.activeThumb : ''} aria-label={`Show product image ${index + 1}`} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)}><img src={image} alt="" /></button>)}</div>
        </div>

        <div className={styles.details}>
          <Link className={styles.brandLink} to={`/category/${product.category}`}>{product.brand} <span>·</span> {category?.name}</Link>
          <h1>{product.name}</h1>
          <a className={styles.rating} href="#reviews"><span aria-hidden="true">★★★★★</span><strong>{averageRating}</strong><span className={styles.reviewCount}>{totalReviewCount.toLocaleString()} reviews</span></a>
          <Price product={product} />
          <p className={`${styles.stock} ${product.stock === 0 ? styles.stockOut : ''}`}><span />{stockMessage}</p>
          <p className={styles.description}>{product.description}</p>

          {product.colors.length > 0 && <fieldset className={styles.variants}><legend>Color: <strong>{selectedColor?.name}</strong></legend><div className={styles.colorChoices}>{product.colors.map((color) => <button key={color.name} className={color.name === selectedColor?.name ? styles.selectedColor : ''} style={{ '--swatch-color': color.hex }} aria-label={color.name} aria-pressed={color.name === selectedColor?.name} onClick={() => setColorName(color.name)}><span /></button>)}</div></fieldset>}
          {product.sizes?.length > 0 && <fieldset className={styles.variants}><legend>Size: <strong>{sizeName || 'Choose a size'}</strong></legend><div className={styles.sizeChoices}>{product.sizes.map((size) => <button key={size} className={sizeName === size ? styles.selectedSize : ''} onClick={() => setSizeName(size)} aria-pressed={sizeName === size}>{size}</button>)}</div></fieldset>}

          <div className={styles.purchaseRow}>
            <div className={styles.quantity} aria-label="Quantity"><button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => changeQuantity(-1)}><Minus size={15} /></button><output aria-live="polite">{quantity}</output><button aria-label="Increase quantity" disabled={product.stock === 0 || quantity >= product.stock} onClick={() => changeQuantity(1)}><Plus size={15} /></button></div>
            <button className="btn btn--primary btn--lg" disabled={product.stock === 0} onClick={handleAddToCart}><ShoppingBag size={17} /> Add to bag</button>
            <button className="btn btn--secondary btn--lg" disabled={product.stock === 0} onClick={handleBuyNow}>Buy now</button>
            <button type="button" className={`${styles.wishlistButton} ${isWishlisted(product.id) ? styles.wishlistActive : ''}`} aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={isWishlisted(product.id)} onClick={() => toggleWishlist(product.id)}><Heart size={19} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} /></button>
          </div>
          {cartNotice && <p className={styles.cartNote} role="status">Added to your bag. <Link to="/cart">View bag</Link></p>}
          <div className={styles.serviceNotes}><p><Truck size={18} /><span><strong>Free delivery over $100</strong><br />Estimated delivery in 2–5 business days</span></p><p><RotateCcw size={18} /><span><strong>30-day returns</strong><br />Changed your mind? Send it back with ease.</span></p><p><ShieldCheck size={18} /><span><strong>Authenticity guaranteed</strong><br />Every product is sourced from trusted brands.</span></p></div>
        </div>
      </section>

      <section className={`container ${styles.information}`}>
        <div className={styles.descriptionBlock}><p className={styles.eyebrow}>MADE FOR EVERYDAY</p><h2>About this product</h2><p>{product.description}</p>{product.tags.length > 0 && <ul className={styles.features}>{product.tags.slice(0, 5).map((tag) => <li key={tag}>{tag}</li>)}</ul>}</div>
        <div className={styles.specBlock}><p className={styles.eyebrow}>THE DETAILS</p><h2>Specifications</h2><dl>{Object.entries(product.specifications).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>
      </section>

      <section className={`container ${styles.reviews}`} id="reviews">
        <p className={styles.eyebrow}>CUSTOMER FEEDBACK</p><h2>Reviews for {product.name}</h2>
        <div className={styles.reviewSummary}><span aria-hidden="true">★★★★★</span><strong>{averageRating} / 5</strong><span>Based on {totalReviewCount.toLocaleString()} ratings</span></div>
        <form className={styles.reviewForm} onSubmit={submitReview}>
          <h3>Write a review</h3><p>Your review is saved only in this browser as demo content.</p>
          <div className={styles.reviewFields}>
            <label>Rating<select value={reviewRating} onChange={(event) => setReviewRating(event.target.value)}>{[5, 4, 3, 2, 1].map((rating) => <option value={rating} key={rating}>{rating} {rating === 1 ? 'star' : 'stars'}</option>)}</select></label>
            {!user && <label>Your name<input value={reviewerName} onChange={(event) => setReviewerName(event.target.value)} maxLength={60} required /></label>}
            <label>Review title<input value={reviewTitle} onChange={(event) => setReviewTitle(event.target.value)} maxLength={100} required /></label>
            <label>Your review<textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} rows={4} minLength={10} maxLength={1000} required /></label>
          </div>
          <button className="btn btn--primary" type="submit">Submit review</button>
          {reviewNotice && <p className={styles.reviewNotice} role="status">{reviewNotice}</p>}
        </form>
        {localReviews.length > 0 && <div className={styles.reviewList} aria-label="Reviews saved on this device">{localReviews.map((review) => <article className={styles.reviewCard} key={review.id}><div><span className={styles.reviewStars} aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(Number(review.rating))}{'☆'.repeat(5 - Number(review.rating))}</span><time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString()}</time></div><h3>{review.title}</h3><p>{review.text}</p><small>By {review.name} · Demo review</small></article>)}</div>}
        <p className={styles.reviewDisclaimer}>The existing aggregate rating and review count are sample portfolio data. Locally submitted reviews are visible only in this browser.</p>
      </section>

      {relatedProducts.length > 0 && <section className={`container ${styles.recommendations}`}><div className={styles.sectionHead}><div><p className={styles.eyebrow}>MORE TO EXPLORE</p><h2>More from {category?.name ?? product.category}</h2></div><Link to={`/category/${product.category}`}>Shop this category <ChevronRight size={16} /></Link></div><div className={styles.miniGrid}>{relatedProducts.map((item) => <MiniProduct product={item} key={item.id} />)}</div></section>}

      {recentlyViewed.length > 0 && <section className={`container ${styles.recommendations}`}><div className={styles.sectionHead}><div><p className={styles.eyebrow}>PICK UP WHERE YOU LEFT OFF</p><h2>Recently viewed</h2></div></div><div className={styles.miniGrid}>{recentlyViewed.map((item) => <MiniProduct product={item} key={item.id} />)}</div></section>}
    </div>
  )
}
