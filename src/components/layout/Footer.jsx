import { useState } from 'react'
import { ArrowRight, Camera, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const footerGroups = [
  { title: 'Shop', links: [{ label: 'All products', to: '/shop' }, { label: 'New arrivals', to: '/shop' }, { label: 'Offers', to: '/shop' }, { label: 'Categories', to: '/categories' }] },
  { title: 'Customer care', links: [{ label: 'Your account', to: '/account' }, { label: 'Orders', to: '/account/orders' }, { label: 'Wishlist', to: '/wishlist' }, { label: 'Contact us', href: 'mailto:hello@nova.example' }, { label: 'Privacy', to: '/privacy' }, { label: 'Terms', to: '/terms' }] },
  { title: 'About NOVA', links: [{ label: 'Our approach', to: '/' }, { label: 'Smartphones', to: '/category/smartphones' }, { label: 'Laptops', to: '/category/laptops' }, { label: 'Headphones', to: '/category/headphones' }] },
]

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(event) {
    event.preventDefault()
    setSubscribed(true)
  }

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.brandBlock}><Link to="/" className={styles.logo}>NOVA<span>.</span></Link><p>Good design. Everyday tech.<br />A thoughtful edit of things that make life work better.</p><div className={styles.socials}><a href="https://instagram.com" aria-label="NOVA on Instagram"><Camera size={18} /></a><a href="https://youtube.com" aria-label="NOVA on YouTube"><Play size={18} /></a></div></div>
        {footerGroups.map((group) => <nav className={styles.group} aria-label={group.title} key={group.title}><h2>{group.title}</h2><ul>{group.links.map((link) => <li key={link.label}>{link.href ? <a href={link.href}>{link.label}</a> : <Link to={link.to}>{link.label}</Link>}</li>)}</ul></nav>)}
        <div className={styles.newsletter}><p className={styles.newsletterEyebrow}>A GOOD EMAIL, OCCASIONALLY</p><h2>Notes from NOVA</h2><p>New finds, useful ideas and first access to selected offers.</p>{subscribed ? <p className={styles.success} role="status">Thanks for your interest. Newsletter sign-up is a demo for now.</p> : <form onSubmit={handleSubscribe}><label className="visually-hidden" htmlFor="footer-email">Email address</label><input id="footer-email" type="email" placeholder="Your email address" autoComplete="email" required /><button type="submit" aria-label="Subscribe to newsletter"><ArrowRight size={18} /></button></form>}<span className={styles.finePrint}>No backend connection yet. Your address is not sent or saved.</span></div>
      </div>
      <div className={`container ${styles.bottom}`}><span>© {new Date().getFullYear()} NOVA. Demo storefront for learning and portfolio use.</span><span>Thoughtfully chosen. Ready for everyday.</span></div>
    </footer>
  )
}
