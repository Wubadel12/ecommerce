import { Link } from 'react-router-dom'
import styles from './StoreInfo.module.css'

const copy = {
  privacy: {
    eyebrow: 'YOUR INFORMATION',
    title: 'Privacy notice',
    intro: 'NOVA is a frontend portfolio demo. This notice explains what this browser-based prototype does with information you enter.',
    sections: [
      ['Information stored on this device', 'Demo account details, cart, wishlist, addresses, preferences, orders, theme, recent searches, and reviews are stored in this browser’s LocalStorage. Clearing site data removes them. Demo passwords are hashed locally for learning purposes; this is not production authentication.'],
      ['Information sent elsewhere', 'The demo does not send account, checkout, payment, or review form data to a NOVA server. No payment is taken. Links to social platforms or your email app leave this demo if you choose to open them.'],
      ['Your choices', 'You can remove saved demo data by clearing this site’s storage in your browser. Avoid entering real passwords, payment details, or sensitive personal information.'],
      ['Production use', 'This prototype has no production privacy infrastructure, analytics policy, or customer support operation. A real store needs a reviewed privacy notice and secure backend before collecting customer information.'],
    ],
  },
  terms: {
    eyebrow: 'DEMO STOREFRONT',
    title: 'Terms of use',
    intro: 'NOVA is an educational portfolio project for demonstrating frontend shopping flows. It is not a real store and does not accept purchases.',
    sections: [
      ['Demo products and prices', 'Product names, prices, availability, ratings, testimonials, delivery estimates, and discounts are sample content. They do not represent a real offer or inventory.'],
      ['Checkout and payment', 'Checkout creates a mock order stored in this browser. It does not place an order, contact a seller, or charge a payment method. Do not enter real card or account details.'],
      ['Accounts and reviews', 'Accounts and submitted product reviews exist only in LocalStorage on this device. They are not verified, moderated, shared, or backed up.'],
      ['Portfolio use', 'The project is provided as a learning and portfolio demonstration. No customer service, warranty, shipping, returns, or commercial transactions are offered.'],
    ],
  },
}

export default function StoreInfo({ type }) {
  const page = copy[type]
  return (
    <main className={`container ${styles.page}`}>
      <p className={styles.eyebrow}>{page.eyebrow}</p>
      <h1>{page.title}</h1>
      <p className={styles.intro}>{page.intro}</p>
      <div className={styles.sections}>{page.sections.map(([heading, text]) => <section key={heading}><h2>{heading}</h2><p>{text}</p></section>)}</div>
      <Link to="/shop" className="btn btn--secondary">Back to shopping</Link>
    </main>
  )
}
