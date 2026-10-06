import {
  LuArrowDownRight,
  LuArrowUpRight,
  LuBoxes,
  LuCircleDollarSign,
  LuTriangleAlert,
} from 'react-icons/lu'
import styles from './styles.module.css'

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)

const StockOverview = ({ products }) => {
  const totalUnits = products.reduce((total, product) => total + product.quantity, 0)
  const inventoryValue = products.reduce(
    (total, product) => total + product.quantity * product.unitCost,
    0,
  )
  const reorderCount = products.filter(
    (product) => product.quantity <= product.reorderPoint,
  ).length
  const categories = products.reduce((summary, product) => {
    summary[product.category] = (summary[product.category] || 0) + product.quantity
    return summary
  }, {})
  const categoryRows = Object.entries(categories).sort((first, second) => second[1] - first[1])
  const mostStocked = Math.max(...categoryRows.map((row) => row[1]), 1)
  const healthPercentage = products.length
    ? Math.round(((products.length - reorderCount) / products.length) * 100)
    : 0
  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <section className={styles.overview} id="overview" aria-labelledby="overview-heading">
      <div className={styles['overview-intro']}>
        <div>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" /> INVENTORY PULSE / {currentDate.toUpperCase()}
          </p>
          <h1 id="overview-heading">Stock, at a glance.</h1>
          <p className={styles['intro-copy']}>
            A clear view of what is moving, what is low, and what is ready to go.
          </p>
        </div>
        <div className={styles['overview-note']}>
          <span className={styles['note-icon']}><LuBoxes aria-hidden="true" /></span>
          <span><strong>Main warehouse</strong><small>One location · Live counts</small></span>
        </div>
      </div>

      <div className={styles['metric-grid']}>
        <article className={`${styles.metric} ${styles['metric-cobalt']}`}>
          <span className={styles['metric-icon']}><LuBoxes aria-hidden="true" /></span>
          <span className={styles['metric-label']}>Products tracked</span>
          <strong>{products.length}</strong>
          <span className={styles['metric-footnote']}><LuArrowUpRight aria-hidden="true" /> 2 added this month</span>
        </article>
        <article className={`${styles.metric} ${styles['metric-lime']}`}>
          <span className={styles['metric-icon']}><LuCircleDollarSign aria-hidden="true" /></span>
          <span className={styles['metric-label']}>Stock value</span>
          <strong>{formatCurrency(inventoryValue)}</strong>
          <span className={styles['metric-footnote']}>At current unit cost</span>
        </article>
        <article className={styles.metric}>
          <span className={styles['metric-icon']}><LuArrowDownRight aria-hidden="true" /></span>
          <span className={styles['metric-label']}>Units on hand</span>
          <strong>{totalUnits.toLocaleString('en-US')}</strong>
          <span className={styles['metric-footnote']}>Across all product lines</span>
        </article>
        <article className={`${styles.metric} ${styles['metric-alert']}`}>
          <span className={styles['metric-icon']}><LuTriangleAlert aria-hidden="true" /></span>
          <span className={styles['metric-label']}>Needs a reorder</span>
          <strong>{reorderCount}</strong>
          <span className={styles['metric-footnote']}>At or below minimum stock</span>
        </article>
      </div>

      <div className={styles['overview-panels']}>
        <article className={styles['health-panel']}>
          <div className={styles['panel-heading']}>
            <div>
              <p className={styles['panel-eyebrow']}>STOCK HEALTH</p>
              <h2>Plenty in the right places.</h2>
            </div>
            <span className={styles['panel-period']}>TODAY</span>
          </div>
          <div className={styles['health-content']}>
            <div
              className={styles['health-ring']}
              style={{ '--health-progress': `${healthPercentage}%` }}
              role="img"
              aria-label={`${healthPercentage}% of products are above their reorder point`}
            >
              <span><strong>{healthPercentage}%</strong><small>healthy</small></span>
            </div>
            <div className={styles['health-copy']}>
              <strong>{products.length - reorderCount} of {products.length} lines are above minimum</strong>
              <p>{reorderCount ? `${reorderCount} products need a quick reorder review.` : 'Every product is above its reorder point.'}</p>
              <div className={styles['health-bar']} aria-hidden="true">
                <span style={{ width: `${healthPercentage}%` }} />
              </div>
              <small>{totalUnits} units available across {products.length} products</small>
            </div>
          </div>
        </article>

        <article className={styles['category-panel']}>
          <div className={styles['panel-heading']}>
            <div>
              <p className={styles['panel-eyebrow']}>BY CATEGORY</p>
              <h2>Where stock lives.</h2>
            </div>
            <span className={styles['category-total']}>{categoryRows.length} groups</span>
          </div>
          <ul className={styles['category-list']}>
            {categoryRows.map(([category, quantity], index) => (
              <li key={category}>
                <span className={styles['category-mark']} data-tone={index % 3} aria-hidden="true" />
                <span className={styles['category-name']}>{category}</span>
                <span className={styles['category-meter']} aria-hidden="true">
                  <span style={{ width: `${Math.max((quantity / mostStocked) * 100, 4)}%` }} />
                </span>
                <strong>{quantity}</strong>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

export default StockOverview
