import { useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { ArrowDownUp, ArrowRight, Check, Eye, Heart, LayoutGrid, List, Search, ShoppingBag, SlidersHorizontal, Star, X } from 'lucide-react'
import { categories } from '../../data/categories'
import { useProducts } from '../../hooks/useProducts'
import { useCart } from '../../hooks/useCart'
import { formatCurrency } from '../../utils/formatters'
import { readStorage, STORAGE_KEYS, writeStorage } from '../../utils/storage'
import { useWishlist } from '../../hooks/useWishlist'
import styles from './ProductListing.module.css'

const PAGE_SIZE = 12
const SORTS = [
  ['featured', 'Featured'], ['price-low', 'Price: low to high'], ['price-high', 'Price: high to low'],
  ['rating', 'Highest rated'], ['newest', 'Newest'], ['popular', 'Most popular'],
]

function ProductCard({ product, listView }) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const quickViewTrigger = useRef(null)
  const wishlisted = isWishlisted(product.id)

  function closeQuickView() {
    setQuickViewOpen(false)
    window.requestAnimationFrame(() => quickViewTrigger.current?.focus())
  }

  function handleQuickViewKeys(event) {
    if (event.key === 'Escape') {
      setQuickViewOpen(false)
      return
    }
    if (event.key !== 'Tab') return
    const focusable = [...event.currentTarget.querySelectorAll('button:not(:disabled), a[href]')]
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return (
    <article className={`${styles.productCard} ${listView ? styles.listCard : ''}`}>
      <Link className={styles.productImage} to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
        {product.discount > 0 && <span className={styles.saleBadge}>Save {product.discount}%</span>}
        <img src={product.images[0]} alt={product.name} loading="lazy" />
      </Link>
      <div className={styles.cardActions}>
        <button type="button" onClick={(event) => { quickViewTrigger.current = event.currentTarget; setQuickViewOpen(true) }}><Eye size={15} /> Quick view</button>
        <button type="button" disabled={product.stock === 0} onClick={() => addToCart(product)}><ShoppingBag size={15} /> Add to bag</button>
      </div>
      <button type="button" className={`${styles.wishlistButton} ${wishlisted ? styles.wishlisted : ''}`} aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} aria-pressed={wishlisted} onClick={() => toggleWishlist(product.id)}><Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} /></button>
      <div className={styles.productInfo}>
        <p className={styles.brand}>{product.brand} <span>{categories.find((category) => category.slug === product.category)?.name ?? product.category}</span></p>
        <Link className={styles.productName} to={`/product/${product.slug}`}>{product.name}</Link>
        <p className={styles.description}>{product.shortDescription}</p>
        <div className={styles.rating}><Star size={14} fill="currentColor" aria-hidden="true" /><strong>{product.rating}</strong><span>({product.reviewCount} reviews)</span></div>
        <div className={styles.priceRow}><strong>{formatCurrency(product.price)}</strong>{product.oldPrice && <del>{formatCurrency(product.oldPrice)}</del>}<span className={product.stock > 0 ? styles.inStock : styles.outOfStock}>{product.stock > 0 ? 'In stock' : 'Out of stock'}</span></div>
      </div>
      {quickViewOpen && <div className={styles.quickViewBackdrop} role="presentation" onClick={closeQuickView}><section className={styles.quickView} role="dialog" aria-modal="true" aria-labelledby={`quick-view-title-${product.id}`} onClick={(event) => event.stopPropagation()} onKeyDown={handleQuickViewKeys}><button className={styles.quickViewClose} type="button" autoFocus onClick={closeQuickView} aria-label="Close quick view"><X size={20} /></button><img src={product.images[0]} alt={product.name} /><div><p className={styles.brand}>{product.brand} <span>{categories.find((category) => category.slug === product.category)?.name ?? product.category}</span></p><h2 id={`quick-view-title-${product.id}`}>{product.name}</h2><p>{product.shortDescription}</p><p className={styles.quickViewPrice}>{formatCurrency(product.price)} {product.oldPrice && <del>{formatCurrency(product.oldPrice)}</del>}</p><div className={styles.quickViewButtons}><button type="button" className="btn btn--primary" disabled={product.stock === 0} onClick={() => { addToCart(product); closeQuickView() }}><ShoppingBag size={16} /> Add to bag</button><Link to={`/product/${product.slug}`} className="btn btn--secondary">View details</Link></div></div></section></div>}
    </article>
  )
}

function ProductSkeletons() {
  return (
    <div className={styles.skeletonGrid} role="status" aria-label="Loading products" aria-busy="true">
      <span className="visually-hidden">Loading products</span>
      {Array.from({ length: 8 }, (_, index) => (
        <div className={styles.skeletonCard} key={index} aria-hidden="true">
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonLine} />
          <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonLinePrice}`} />
        </div>
      ))}
    </div>
  )
}

function FilterPanel({ brands, filters, setFilters, categoryOptions, onClear, resultCount, onClose }) {
  function toggleBrand(brand) {
    setFilters((current) => ({ ...current, brands: current.brands.includes(brand) ? current.brands.filter((item) => item !== brand) : [...current.brands, brand] }))
  }

  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterHeading}><h2>Filters</h2><button className={styles.closeFilters} onClick={onClose} aria-label="Close filters"><X size={19} /></button></div>
      <label className={styles.filterLabel} htmlFor="filter-category">Category</label>
      <select id="filter-category" value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}>
        <option value="">All categories</option>{categoryOptions.map((category) => <option value={category.slug} key={category.slug}>{category.name}</option>)}
      </select>
      <fieldset><legend>Brand</legend><div className={styles.checkList}>{brands.map((brand) => <label key={brand}><input type="checkbox" checked={filters.brands.includes(brand)} onChange={() => toggleBrand(brand)} /><span>{brand}</span></label>)}</div></fieldset>
      <fieldset><legend>Price range</legend><label className={styles.rangeLabel} htmlFor="price-range">Up to {formatCurrency(filters.maxPrice)}</label><input id="price-range" className={styles.range} type="range" min="0" max="2500" step="25" value={filters.maxPrice} onChange={(event) => setFilters((current) => ({ ...current, maxPrice: Number(event.target.value) }))} /><div className={styles.rangeEnds}><span>$0</span><span>$2,500+</span></div></fieldset>
      <label className={styles.filterLabel} htmlFor="filter-rating">Minimum rating</label>
      <select id="filter-rating" value={filters.minRating} onChange={(event) => setFilters((current) => ({ ...current, minRating: Number(event.target.value) }))}><option value="0">Any rating</option><option value="4">4 stars & up</option><option value="4.5">4.5 stars & up</option></select>
      <label className={styles.availability}><input type="checkbox" checked={filters.inStock} onChange={(event) => setFilters((current) => ({ ...current, inStock: event.target.checked }))} /><span>Show in-stock items only</span></label>
      <button className={styles.clearButton} onClick={onClear}>Clear all filters</button>
      <button className={styles.applyButton} onClick={onClose}><Check size={16} /> Show {resultCount} results</button>
    </div>
  )
}

export default function ProductListing({ mode }) {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryFromUrl = searchParams.get('q') ?? ''
  const query = queryFromUrl
  const [filters, setFilters] = useState({ category: '', brands: [], maxPrice: 2500, minRating: 0, inStock: false })
  const [sort, setSort] = useState('featured')
  const [page, setPage] = useState(1)
  const [listView, setListView] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const { products, isLoading, error } = useProducts()

  const currentCategory = categories.find((category) => category.slug === slug)
  const scopedProducts = useMemo(() => {
    if (mode === 'category' && slug) return products.filter((product) => product.category === slug)
    return products
  }, [mode, products, slug])
  const brands = useMemo(() => [...new Set(scopedProducts.map((product) => product.brand))].sort(), [scopedProducts])
  const categoryOptions = useMemo(() => categories.filter((category) => scopedProducts.some((product) => product.category === category.slug)), [scopedProducts])
  const normalizedQuery = (mode === 'search' ? query : '').trim().toLowerCase()

  const filteredProducts = useMemo(() => {
    const matches = scopedProducts.filter((product) => {
      const categoryName = categories.find((category) => category.slug === product.category)?.name ?? ''
      const searchMatch = !normalizedQuery || [product.name, product.brand, categoryName, ...product.tags].some((field) => field.toLowerCase().includes(normalizedQuery))
      return searchMatch && (!filters.category || product.category === filters.category) && (!filters.brands.length || filters.brands.includes(product.brand)) && product.price <= filters.maxPrice && product.rating >= filters.minRating && (!filters.inStock || product.stock > 0)
    })

    return matches.sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price
      if (sort === 'price-high') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating || b.reviewCount - a.reviewCount
      if (sort === 'newest') return b.createdAt.localeCompare(a.createdAt)
      if (sort === 'popular') return b.reviewCount - a.reviewCount
      return Number(b.featured) - Number(a.featured) || b.rating - a.rating
    })
  }, [scopedProducts, normalizedQuery, filters, sort])

  const maxPage = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const suggestionProducts = normalizedQuery ? products.filter((product) => [product.name, product.brand, product.category, ...product.tags].some((field) => field.toLowerCase().includes(normalizedQuery))).slice(0, 5) : []
  const recentSearches = readStorage(STORAGE_KEYS.recentSearches, [], Array.isArray).slice(0, 5)
  const heading = mode === 'category' ? currentCategory?.name ?? 'Category not found' : mode === 'search' ? 'Search results' : 'Shop all products'

  function clearFilters() {
    setFilters({ category: '', brands: [], maxPrice: 2500, minRating: 0, inStock: false })
    setPage(1)
  }

  function rememberSearch(value) {
    const cleaned = value.trim()
    if (!cleaned) return
    writeStorage(STORAGE_KEYS.recentSearches, [cleaned, ...recentSearches.filter((item) => item.toLowerCase() !== cleaned.toLowerCase())].slice(0, 5))
    setSearchParams({ q: cleaned })
    setSuggestionsOpen(false)
    setPage(1)
  }

  function updateQuery(value) {
    setPage(1)
    setSuggestionsOpen(true)
    if (mode === 'search') setSearchParams(value ? { q: value } : {}, { replace: true })
  }

  if (mode === 'category' && !currentCategory) {
    return <section className={`container ${styles.notFound}`}><p className={styles.eyebrow}>CATALOG</p><h1>We couldn’t find that category.</h1><p>Try another collection or browse all products.</p><Link to="/categories" className="btn btn--primary">Explore categories <ArrowRight size={16} /></Link></section>
  }

  return (
    <section className={`container ${styles.page}`}>
      <p className={styles.eyebrow}>{mode === 'search' ? 'FIND SOMETHING GOOD' : mode === 'category' ? 'SHOP THE COLLECTION' : 'THE FULL COLLECTION'}</p>
      <div className={styles.heading}><div><h1>{heading}</h1><p>{mode === 'category' ? currentCategory.description : mode === 'search' ? 'Search products, brands and categories in the NOVA collection.' : 'Considered technology and everyday essentials, all in one place.'}</p></div></div>
      {mode === 'search' && <div className={styles.searchBox}><form role="search" onSubmit={(event) => { event.preventDefault(); rememberSearch(query) }}><Search size={19} aria-hidden="true" /><label className="visually-hidden" htmlFor="catalog-search">Search the catalog</label><input id="catalog-search" value={query} onChange={(event) => updateQuery(event.target.value)} onFocus={() => setSuggestionsOpen(true)} onBlur={() => window.setTimeout(() => setSuggestionsOpen(false), 120)} onKeyDown={(event) => { if (event.key === 'Escape') setSuggestionsOpen(false) }} placeholder="Try ‘wireless headphones’" autoComplete="off" />{query && <button type="button" className={styles.clearSearch} aria-label="Clear search" onClick={() => updateQuery('')}><X size={17} /></button>}<button type="submit" className="btn btn--primary">Search</button></form>
        {suggestionsOpen && (suggestionProducts.length > 0 || (!query && recentSearches.length > 0)) && <div className={styles.suggestions} role="listbox" aria-label="Search suggestions">{query ? suggestionProducts.map((product) => <Link to={`/product/${product.slug}`} key={product.id} onMouseDown={() => setSuggestionsOpen(false)}><img src={product.images[0]} alt="" /><span>{product.name}<small>{product.brand} · {formatCurrency(product.price)}</small></span></Link>) : recentSearches.map((term) => <button type="button" key={term} onMouseDown={() => updateQuery(term)}><Search size={15} /> {term}</button>)}</div>}</div>}
      {isLoading ? <ProductSkeletons /> : error ? <div className={styles.empty}><h2>Catalog unavailable</h2><p>{error}</p></div> : <>
        <div className={styles.toolbar}><span className={styles.resultCount}>{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}</span><div className={styles.toolbarActions}><button className={styles.mobileFilterButton} aria-expanded={filtersOpen} onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={16} /> Filters</button><label className={styles.sortLabel} htmlFor="sort-products"><ArrowDownUp size={15} /><span>Sort by</span><select id="sort-products" value={sort} onChange={(event) => { setSort(event.target.value); setPage(1) }}>{SORTS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><div className={styles.viewToggle} aria-label="Product layout"><button className={!listView ? styles.selectedView : ''} aria-label="Grid view" aria-pressed={!listView} onClick={() => setListView(false)}><LayoutGrid size={17} /></button><button className={listView ? styles.selectedView : ''} aria-label="List view" aria-pressed={listView} onClick={() => setListView(true)}><List size={18} /></button></div></div></div>
        <div className={styles.catalogLayout}>
          <aside className={`${styles.filters} ${filtersOpen ? styles.filtersOpen : ''}`}><FilterPanel brands={brands} filters={filters} setFilters={(update) => { setFilters(update); setPage(1) }} categoryOptions={categoryOptions} onClear={clearFilters} resultCount={filteredProducts.length} onClose={() => setFiltersOpen(false)} /></aside>
          {filtersOpen && <button className={styles.backdrop} aria-label="Close filters" onClick={() => setFiltersOpen(false)} />}
          <div className={styles.results}>
            {visibleProducts.length ? <div className={`${styles.products} ${listView ? styles.listView : ''}`}>{visibleProducts.map((product) => <ProductCard product={product} listView={listView} key={product.id} />)}</div> : <div className={styles.empty}><Search size={24} /><h2>{mode === 'search' ? 'No matches found' : 'No products match these filters'}</h2><p>{mode === 'search' ? `We couldn’t find products for “${query.trim()}”. Try a brand, product type or a shorter search.` : 'Try adjusting or clearing your filters to see more products.'}</p><button className="btn btn--secondary" onClick={clearFilters}>Clear filters</button></div>}
            {filteredProducts.length > PAGE_SIZE && <nav className={styles.pagination} aria-label="Product pages"><button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {maxPage}</span><button disabled={page === maxPage} onClick={() => setPage(page + 1)}>Next</button></nav>}
          </div>
        </div>
      </>}
    </section>
  )
}
