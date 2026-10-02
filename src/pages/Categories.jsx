import { ArrowRight, PackageSearch } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { products } from '../data/products'
import styles from './Categories.module.css'

export default function Categories() {
  return (
    <section className={`container ${styles.page}`}>
      <p className={styles.eyebrow}>THE NOVA COLLECTION</p>
      <div className={styles.heading}><div><h1>Explore categories</h1><p>Find the right gear for the way you work, unwind and connect.</p></div><span className={styles.count}>{categories.length} collections</span></div>
      <div className={styles.grid}>
        {categories.map((category, index) => {
          const count = products.filter((product) => product.category === category.slug).length
          return <Link className={styles.card} to={`/category/${category.slug}`} key={category.slug}>
            <div className={styles.image} data-tone={index % 4}><img src={category.image} alt="" loading="lazy" /></div>
            <div className={styles.cardText}><div><h2>{category.name}</h2><p>{category.description}</p></div><span className={styles.productCount}>{count} {count === 1 ? 'product' : 'products'}</span></div>
            <span className={styles.arrow}><ArrowRight size={18} aria-hidden="true" /></span>
          </Link>
        })}
      </div>
      <div className={styles.help}><PackageSearch size={20} aria-hidden="true"/><p>Not sure what you need? Browse the full catalog and compare every product.</p><Link to="/shop">View all products <ArrowRight size={15} /></Link></div>
    </section>
  )
}
