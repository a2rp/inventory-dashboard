import { useEffect, useState } from 'react'
import { LuPackagePlus, LuX } from 'react-icons/lu'
import styles from './styles.module.css'

const photoOptions = [
  { value: 'laptop.jpg', label: 'Slatebook 14' },
  { value: 'desk-supplies.jpg', label: 'Desk supplies' },
  { value: 'everyday-carry.jpg', label: 'Carry essentials' },
  { value: 'ceramic-mug.jpg', label: 'Ceramic mug' },
  { value: 'electronics-parts.jpg', label: 'Electronics parts' },
  { value: 'turntable.jpg', label: 'Turntable' },
]

const emptyProduct = {
  name: '',
  description: '',
  image: 'desk-supplies.jpg',
  sku: '',
  category: 'Desk goods',
  supplier: '',
  location: '',
  quantity: '0',
  reorderPoint: '5',
  unitCost: '0',
}

const ProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState(() => ({
    ...emptyProduct,
    ...product,
    quantity: String(product?.quantity ?? emptyProduct.quantity),
    reorderPoint: String(product?.reorderPoint ?? emptyProduct.reorderPoint),
    unitCost: String(product?.unitCost ?? emptyProduct.unitCost),
  }))
  const isEditing = Boolean(product)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const submitProduct = (event) => {
    event.preventDefault()
    onSave({
      ...form,
      quantity: Number(form.quantity),
      reorderPoint: Number(form.reorderPoint),
      unitCost: Number(form.unitCost),
    })
  }

  return (
    <div
      className={styles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <header className={styles['dialog-header']}>
          <span className={styles['header-icon']}><LuPackagePlus aria-hidden="true" /></span>
          <div>
            <p className={styles.eyebrow}>{isEditing ? 'PRODUCT DETAILS' : 'ADD TO STOCKROOM'}</p>
            <h2 id="product-modal-title">{isEditing ? 'Edit product' : 'Add a product'}</h2>
          </div>
          <button className={styles['close-button']} type="button" onClick={onClose} aria-label="Close product editor">
            <LuX aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={submitProduct}>
          <div className={styles['photo-row']}>
            <img src={`${import.meta.env.BASE_URL}images/${form.image}`} alt="" />
            <label className={styles.field}>
              <span>Product photo</span>
              <select name="image" value={form.image} onChange={updateField}>
                {photoOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles['field-grid']}>
            <label className={`${styles.field} ${styles['field-wide']}`}>
              <span>Product name</span>
              <input autoFocus required name="name" value={form.name} onChange={updateField} placeholder="For example, desk lamp" />
            </label>
            <label className={styles.field}>
              <span>SKU</span>
              <input required name="sku" value={form.sku} onChange={updateField} placeholder="SKU-001" />
            </label>
            <label className={styles.field}>
              <span>Category</span>
              <select name="category" value={form.category} onChange={updateField}>
                <option>Workstations</option>
                <option>Desk goods</option>
                <option>Accessories</option>
                <option>Components</option>
                <option>Audio</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>Supplier</span>
              <input name="supplier" value={form.supplier} onChange={updateField} placeholder="Supplier name" />
            </label>
            <label className={styles.field}>
              <span>Bin location</span>
              <input name="location" value={form.location} onChange={updateField} placeholder="Aisle 01 / A-01" />
            </label>
            <label className={styles.field}>
              <span>Units on hand</span>
              <input min="0" required type="number" name="quantity" value={form.quantity} onChange={updateField} />
            </label>
            <label className={styles.field}>
              <span>Reorder at</span>
              <input min="0" required type="number" name="reorderPoint" value={form.reorderPoint} onChange={updateField} />
            </label>
            <label className={styles.field}>
              <span>Unit cost (USD)</span>
              <input min="0" step="0.01" required type="number" name="unitCost" value={form.unitCost} onChange={updateField} />
            </label>
            <label className={`${styles.field} ${styles['field-wide']}`}>
              <span>Short description</span>
              <input name="description" value={form.description} onChange={updateField} placeholder="A few words about this product" />
            </label>
          </div>

          <footer className={styles['form-footer']}>
            <span>Saved on this device</span>
            <div>
              <button className={styles['button-secondary']} type="button" onClick={onClose}>Cancel</button>
              <button className={styles['button-primary']} type="submit">{isEditing ? 'Save changes' : 'Add product'}</button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default ProductModal
