import { useState } from 'react'
import { ArrowRight, Heart, Menu, Moon, Search, ShoppingBag, Sun, UserRound, X } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import styles from './Header.module.css'

const navigation = [
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Categories' },
  { to: '/category/smartphones', label: 'Smartphones' },
  { to: '/category/laptops', label: 'Laptops' },
]

export default function Header() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { itemCount } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  function handleSearch(event) {
    event.preventDefault()
    const value = query.trim()
    if (value) navigate(`/search?q=${encodeURIComponent(value)}`)
    setMenuOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.announcement}>
        <span>Thoughtful technology. Delivered free on orders over $100.</span>
        <Link to="/shop">Explore the collection <ArrowRight size={14} aria-hidden="true" /></Link>
      </div>
      <div className={`container ${styles.main}`}>
        <button className={styles.menuButton} type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <Link to="/" className={styles.logo} aria-label="NOVA home">NOVA<span>.</span></Link>
        <form className={styles.search} role="search" onSubmit={handleSearch}>
          <Search size={18} aria-hidden="true" />
          <label className="visually-hidden" htmlFor="site-search">Search products</label>
          <input id="site-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, brands..." />
          <button type="submit" aria-label="Submit search"><ArrowRight size={17} /></button>
        </form>
        <div className={styles.actions}>
          <Link to={user ? '/account' : '/login'} aria-label={user ? user.name + "'s account" : 'Sign in to your account'}><UserRound /><span>{user?.name.split(' ')[0] ?? 'Sign in'}</span></Link>
          <Link to="/wishlist" className={styles.wishlistLink} aria-label={`Wishlist, ${wishlistCount} items`}><Heart /><span>Wishlist</span>{wishlistCount > 0 && <span className={styles.wishlistCount}>{wishlistCount}</span>}</Link>
          <Link to="/cart" className={styles.bagLink} aria-label={`Shopping bag, ${itemCount} items`}><ShoppingBag /><span>Bag</span>{itemCount > 0 && <span className={styles.bagCount}>{itemCount}</span>}</Link>
          <button className={styles.themeToggle} type="button" onClick={toggleTheme} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>{theme === 'light' ? <Moon /> : <Sun />}<span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span></button>
        </div>
      </div>
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-label="Main navigation">
        <div className={`container ${styles.navInner}`}>
          {navigation.map(({ to, label }) => <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>{label}</NavLink>)}
          <Link className={styles.saleLink} to="/shop">Offers <span>Just in</span></Link>
        </div>
      </nav>
    </header>
  )
}
