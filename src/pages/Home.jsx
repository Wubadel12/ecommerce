import { useState } from 'react'
import { ArrowRight, Heart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { products } from '../data/products'
import { formatCurrency } from '../utils/formatters'
import { useWishlist } from '../hooks/useWishlist'
import styles from './Home.module.css'

const featuredProducts = products.filter((product) => product.featured).slice(0, 4)
const bestSellers = products.filter((product) => product.bestseller).slice(0, 4)
const newArrivals = [...products].filter((product) => product.newArrival).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4)
const saleProducts = products.filter((product) => product.discount > 0).sort((a, b) => b.discount - a.discount).slice(0, 4)
const recommendedProducts = [...products].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, 4)
const popularCategories = categories.slice(0, 4)

function ProductSection({ eyebrow, title, items, link = '/shop', linkLabel = 'View all products' }) {
  return (
    <section className={`container ${styles.section}`}>
      <div className={styles.sectionHead}><div><p className={styles.eyebrow}>{eyebrow}</p><h2>{title}</h2></div><Link to={link} className={styles.textLink}>{linkLabel} <ArrowRight size={16} /></Link></div>
      <div className={styles.productGrid}>{items.map((product) => <ProductTile product={product} key={product.id} />)}</div>
    </section>
  )
}

function ProductTile({ product }) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  return (
    <article className={styles.product}>
      <Link to={`/product/${product.slug}`} className={styles.productImage}>
        {product.discount > 0 && <span className={styles.discount}>−{product.discount}%</span>}
        <img src={product.images[0]} alt={product.name} loading="lazy" />
      </Link>
      <button type="button" className={`${styles.wishlistButton} ${wishlisted ? styles.wishlistActive : ''}`} aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} aria-pressed={wishlisted} onClick={() => toggleWishlist(product.id)}><Heart size={17} fill={wishlisted ? 'currentColor' : 'none'} /></button>
      <p className={styles.brand}>{product.brand}</p>
      <Link to={`/product/${product.slug}`} className={styles.productName}>{product.name}</Link>
      <div className={styles.rating}><Star size={14} fill="currentColor" aria-hidden="true" /><span>{product.rating}</span><span className={styles.reviews}>({product.reviewCount})</span></div>
      <p className={styles.price}>{formatCurrency(product.price)} {product.oldPrice && <del>{formatCurrency(product.oldPrice)}</del>}</p>
    </article>
  )
}

export default function Home() {
  const [newsletterDone, setNewsletterDone] = useState(false)
  const heroProduct = featuredProducts[0] ?? products[0]
  return (
    <div className={styles.page}>
      <section className={`container ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>GOOD DESIGN. EVERYDAY TECH.</p>
          <h1>Make room for<br />what moves you.</h1>
          <p className={styles.heroText}>Considered electronics for work, play and everything in between. Find your next everyday essential.</p>
          <div className={styles.heroActions}><Link className="btn btn--primary btn--lg" to="/shop">Shop the collection <ArrowRight size={17} /></Link><Link className={styles.textLink} to="/categories">Browse categories</Link></div>
          <p className={styles.heroNote}>Free delivery over $100 <span>·</span> Easy 30-day returns</p>
        </div>
        <Link to={`/product/${heroProduct.slug}`} className={styles.heroVisual} aria-label={`Discover ${heroProduct.name}`}>
          <div className={styles.heroShape}></div>
          <img src={heroProduct.images[0]} alt={heroProduct.name} fetchPriority="high" />
          <div className={styles.heroCaption}><span>EDITOR'S PICK</span><strong>{heroProduct.name}</strong><span>{formatCurrency(heroProduct.price)}</span></div>
        </Link>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="categories-heading">
        <div className={styles.sectionHead}><div><p className={styles.eyebrow}>FIND YOUR NEXT FAVOURITE</p><h2 id="categories-heading">Shop by category</h2></div><Link to="/categories" className={styles.textLink}>All categories <ArrowRight size={16} /></Link></div>
        <div className={styles.categoryGrid}>{popularCategories.map((category, index) => <Link to={`/category/${category.slug}`} className={styles.category} key={category.slug}><div className={styles.categoryImage} data-tone={index}><img src={category.image} alt="" loading="lazy" /></div><div><h3>{category.name}</h3><span>{category.description}</span></div><ArrowRight className={styles.categoryArrow} size={18} aria-hidden="true" /></Link>)}</div>
      </section>

      <section className={styles.featuredBand}>
        <div className={`container ${styles.section}`}>
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>THE NOVA EDIT</p><h2>Worth a closer look</h2></div><Link to="/shop" className={styles.textLink}>Shop all products <ArrowRight size={16} /></Link></div>
          <div className={styles.productGrid}>{featuredProducts.map((product) => <ProductTile product={product} key={product.id} />)}</div>
        </div>
      </section>

      <ProductSection eyebrow="CUSTOMER FAVOURITES" title="Best sellers" items={bestSellers.length ? bestSellers : featuredProducts} />

      <section className={styles.saleBand}>
        <div className={`container ${styles.saleInner}`}><div><p className={styles.eyebrow}>A LITTLE SOMETHING EXTRA</p><h2>Good finds.<br />Better prices.</h2><p>Explore selected pieces with considered savings, while they last.</p><Link to="/shop" className="btn btn--secondary">Shop current offers <ArrowRight size={16} /></Link></div><div className={styles.saleProducts}>{saleProducts.slice(0, 2).map((product) => <ProductTile product={product} key={product.id} />)}</div></div>
      </section>

      <ProductSection eyebrow="JUST ARRIVED" title="New to NOVA" items={newArrivals.length ? newArrivals : featuredProducts} linkLabel="See new arrivals" />
      <ProductSection eyebrow="A GOOD PLACE TO START" title="Well loved by customers" items={recommendedProducts} linkLabel="Explore the collection" />

      <section className={`container ${styles.reviews}`} aria-labelledby="reviews-title">
        <div className={styles.sectionHead}><div><p className={styles.eyebrow}>A NOTE FROM OUR CUSTOMERS</p><h2 id="reviews-title">Good things, said simply.</h2></div><span className={styles.reviewSummary}><Star size={15} fill="currentColor" /> 4.8 out of 5</span></div>
        <div className={styles.reviewGrid}><figure><div className={styles.stars} aria-label="5 out of 5 stars">★★★★★</div><blockquote>“The headphones arrived quickly, were exactly as described and sound brilliant. Really thoughtful service.”</blockquote><figcaption>— Maya R., headphone customer</figcaption></figure><figure><div className={styles.stars} aria-label="5 out of 5 stars">★★★★★</div><blockquote>“Finally a shop that makes it easy to compare the details and choose the right laptop. Very happy with it.”</blockquote><figcaption>— Daniel K., laptop customer</figcaption></figure><figure><div className={styles.stars} aria-label="5 out of 5 stars">★★★★★</div><blockquote>“Straightforward checkout, careful packaging and a lovely product. I’ll be back for accessories.”</blockquote><figcaption>— Amina W., returning customer</figcaption></figure></div>
        <p className={styles.reviewDisclaimer}>Sample testimonials for this portfolio demo.</p>
      </section>

      <section className={styles.newsletterBand}>
        <div className={`container ${styles.newsletter}`}><div><p className={styles.eyebrow}>A GOOD EMAIL, OCCASIONALLY</p><h2>Notes from NOVA</h2><p>New finds, useful ideas and first access to selected offers.</p></div>{newsletterDone ? <p className={styles.newsletterSuccess} role="status">Thanks for your interest. This newsletter is a demo and your email was not sent or saved.</p> : <form onSubmit={(event) => { event.preventDefault(); setNewsletterDone(true) }}><label className="visually-hidden" htmlFor="home-newsletter">Email address</label><input id="home-newsletter" type="email" className="field-input" placeholder="Your email address" autoComplete="email" required /><button className="btn btn--primary" type="submit">Sign me up <ArrowRight size={16} /></button></form>}</div>
      </section>

      <section className={`container ${styles.promise}`}><div><span className={styles.promiseNumber}>01</span><h3>Chosen with care</h3><p>Useful, well-made tech from brands we believe in.</p></div><div><span className={styles.promiseNumber}>02</span><h3>Here when you need us</h3><p>Real people ready to help you choose well.</p></div><div><span className={styles.promiseNumber}>03</span><h3>Easy by design</h3><p>Free delivery over $100 and simple returns.</p></div></section>
    </div>
  )
}
