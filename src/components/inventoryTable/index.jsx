import { useMemo, useState } from 'react'
import {
  LuDownload,
  LuPackageSearch,
  LuPencil,
  LuPlus,
  LuSearch,
  LuSlidersHorizontal,
} from 'react-icons/lu'
import styles from './styles.module.css'

const getStockStatus = (product) => {
  if (product.quantity === 0) return 'out'
  if (product.quantity <= product.reorderPoint) return 'low'
  return 'healthy'
}

const stockLabels = {
  healthy: 'In stock',
  low: 'Low stock',
  out: 'Out of stock',
}

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount)

const makeCsvCell = (value) => `"${String(value).replaceAll('"', '""')}"`

const InventoryTable = ({ products, onAddProduct, onEditProduct }) => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const categories = [...new Set(products.map((product) => product.category))].sort()
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter((product) => {
      const productStatus = getStockStatus(product)
      const matchesSearch = [product.name, product.sku, product.category, product.supplier]
        .join(' ')
        .toLowerCase()
        .includes(query)
      const matchesStatus = statusFilter === 'all' || productStatus === statusFilter
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [products, search, statusFilter, categoryFilter])

  const exportCsv = () => {
    const headings = ['Product', 'SKU', 'Category', 'Supplier', 'On hand', 'Reorder point', 'Unit cost', 'Location']
    const rows = visibleProducts.map((product) => [
      product.name,
      product.sku,
      product.category,
      product.supplier,
      product.quantity,
      product.reorderPoint,
      product.unitCost,
      product.location,
    ])
    const csvText = [headings, ...rows].map((row) => row.map(makeCsvCell).join(',')).join('\n')
    const downloadUrl = URL.createObjectURL(new Blob([csvText], { type: 'text/csv;charset=utf-8' }))
    const downloadLink = document.createElement('a')
    downloadLink.href = downloadUrl
    downloadLink.download = 'rackline-inventory.csv'
    downloadLink.click()
    URL.revokeObjectURL(downloadUrl)
  }

  return (
    <section className={styles.inventory} id="inventory" aria-labelledby="inventory-heading">
      <header className={styles['section-heading']}>
        <div>
          <p className={styles.eyebrow}>THE STOCKROOM</p>
          <h2 id="inventory-heading">Products in your stockroom</h2>
          <p className={styles['section-copy']}>{products.length} tracked products, with reorder points that keep shelves ready.</p>
        </div>
        <button className={styles['add-button']} type="button" onClick={onAddProduct}>
          <LuPlus aria-hidden="true" /> Add product
        </button>
      </header>

      <div className={styles['inventory-card']}>
        <div className={styles['table-toolbar']}>
          <label className={styles.search}>
            <LuSearch aria-hidden="true" />
            <span className={styles['visually-hidden']}>Search inventory</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find a product, SKU, or supplier..."
            />
          </label>
          <div className={styles['toolbar-filters']}>
            <label className={`${styles['select-filter']} ${styles['select-filter-with-icon']}`}>
              <LuSlidersHorizontal aria-hidden="true" />
              <span className={styles['visually-hidden']}>Filter by stock status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">All stock levels</option>
                <option value="healthy">In stock</option>
                <option value="low">Low stock</option>
                <option value="out">Out of stock</option>
              </select>
            </label>
            <label className={styles['select-filter']}>
              <span className={styles['visually-hidden']}>Filter by category</span>
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                <option value="all">All categories</option>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <button className={styles['export-button']} type="button" onClick={exportCsv}>
              <LuDownload aria-hidden="true" /> Export
            </button>
          </div>
        </div>

        <div className={styles['table-scroll']}>
          <table>
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">SKU / Supplier</th>
                <th scope="col">Category</th>
                <th scope="col">Availability</th>
                <th scope="col">Unit cost</th>
                <th scope="col">Location</th>
                <th scope="col"><span className={styles['visually-hidden']}>Edit product</span></th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => {
                const status = getStockStatus(product)
                const stockWidth = Math.min(100, (product.quantity / Math.max(product.reorderPoint * 2, 1)) * 100)
                return (
                  <tr key={product.id}>
                    <td>
                      <div className={styles['product-cell']}>
                        <img src={`${import.meta.env.BASE_URL}images/${product.image}`} alt="" />
                        <span><strong>{product.name}</strong><small>{product.description}</small></span>
                      </div>
                    </td>
                    <td><strong className={styles.sku}>{product.sku}</strong><small className={styles.supplier}>{product.supplier || 'No supplier'}</small></td>
                    <td><span className={styles['category-tag']}>{product.category}</span></td>
                    <td>
                      <div className={styles['availability-cell']}>
                        <div><strong>{product.quantity}</strong><small> / {product.reorderPoint} min</small></div>
                        <span className={styles['stock-meter']}><span style={{ width: `${stockWidth}%` }} /></span>
                        <span className={`${styles['stock-badge']} ${styles[`stock-${status}`]}`}>{stockLabels[status]}</span>
                      </div>
                    </td>
                    <td className={styles.cost}>{formatCurrency(product.unitCost)}</td>
                    <td className={styles.location}>{product.location || 'Unassigned'}</td>
                    <td>
                      <button className={styles['edit-button']} type="button" onClick={() => onEditProduct(product)} aria-label={`Edit ${product.name}`}>
                        <LuPencil aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {visibleProducts.length === 0 && (
            <div className={styles['empty-state']}>
              <span><LuPackageSearch aria-hidden="true" /></span>
              <strong>No matching products</strong>
              <p>Try changing the search or filters to find a product.</p>
              <button type="button" onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all') }}>Clear filters</button>
            </div>
          )}
        </div>

        <footer className={styles['table-footer']}>
          <span>Showing <strong>{visibleProducts.length}</strong> of <strong>{products.length}</strong> products</span>
          <span>Counts update as movements are recorded</span>
        </footer>
      </div>
    </section>
  )
}

export default InventoryTable
