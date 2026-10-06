import { LuArrowRight, LuCheck, LuPackageOpen, LuTriangleAlert } from 'react-icons/lu'
import styles from './styles.module.css'

const ReorderQueue = ({ products, onReceiveStock }) => {
  const lowStockProducts = products
    .filter((product) => product.quantity <= product.reorderPoint)
    .sort((first, second) => first.quantity / Math.max(first.reorderPoint, 1) - second.quantity / Math.max(second.reorderPoint, 1))

  return (
    <section className={styles.reorder} id="reorders" aria-labelledby="reorder-heading">
      <header className={styles['section-heading']}>
        <div>
          <p className={styles.eyebrow}><LuTriangleAlert aria-hidden="true" /> REORDER RADAR</p>
          <h2 id="reorder-heading">Low shelf, clear next steps.</h2>
          <p>Products at or below their minimum stock level.</p>
        </div>
        <span className={styles['count-pill']}>{lowStockProducts.length} to review</span>
      </header>

      {lowStockProducts.length ? (
        <ul className={styles['reorder-list']}>
          {lowStockProducts.map((product) => {
            const suggestedUnits = Math.max(product.reorderPoint * 2 - product.quantity, 1)
            const isOut = product.quantity === 0
            return (
              <li key={product.id}>
                <img src={`${import.meta.env.BASE_URL}images/${product.image}`} alt="" />
                <div className={styles['product-info']}>
                  <strong>{product.name}</strong>
                  <small>{product.supplier || 'Supplier not set'} · {product.sku}</small>
                </div>
                <div className={styles['stock-level']}>
                  <strong className={isOut ? styles['stock-empty'] : ''}>{product.quantity}</strong>
                  <span>on hand / {product.reorderPoint} min</span>
                </div>
                <div className={styles['suggested-order']}>
                  <span>Suggested top-up</span>
                  <strong>+{suggestedUnits} units</strong>
                </div>
                <button type="button" onClick={() => onReceiveStock(product)} aria-label={`Log receipt for ${product.name}`}>
                  Log receipt <LuArrowRight aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className={styles['all-clear']}>
          <span><LuCheck aria-hidden="true" /></span>
          <div><strong>All shelves are above minimum.</strong><p>Your team has no urgent reorders to review.</p></div>
          <LuPackageOpen className={styles['shelf-icon']} aria-hidden="true" />
        </div>
      )}
    </section>
  )
}

export default ReorderQueue
