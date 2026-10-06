import { useEffect, useState } from 'react'
import { LuArrowDownToLine, LuArrowUpFromLine, LuPackageCheck, LuX } from 'react-icons/lu'
import styles from './styles.module.css'

const getSuggestedQuantity = (product, kind) => {
  if (!product || kind !== 'received') return '1'
  return String(Math.max(product.reorderPoint * 2 - product.quantity, 1))
}

const MovementModal = ({ products, initialProductId, initialKind = 'received', onClose, onSave }) => {
  const firstProductId = initialProductId || products[0]?.id || ''
  const [productId, setProductId] = useState(firstProductId)
  const [kind, setKind] = useState(initialKind)
  const [quantity, setQuantity] = useState(() =>
    getSuggestedQuantity(products.find((product) => product.id === firstProductId), initialKind),
  )
  const [note, setNote] = useState('')
  const selectedProduct = products.find((product) => product.id === productId)
  const quantityNumber = Number(quantity)
  const exceedsAvailableStock = kind === 'issued' && quantityNumber > (selectedProduct?.quantity || 0)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const chooseKind = (nextKind) => {
    setKind(nextKind)
    setQuantity(getSuggestedQuantity(selectedProduct, nextKind))
  }

  const submitMovement = (event) => {
    event.preventDefault()
    if (!selectedProduct || quantityNumber < 1 || exceedsAvailableStock) return
    onSave({ productId, kind, quantity: quantityNumber, note: note.trim() })
  }

  return (
    <div
      className={styles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="movement-modal-title">
        <header className={styles['dialog-header']}>
          <span className={styles['header-icon']}><LuPackageCheck aria-hidden="true" /></span>
          <div>
            <p className={styles.eyebrow}>UPDATE YOUR COUNTS</p>
            <h2 id="movement-modal-title">Record a movement</h2>
          </div>
          <button className={styles['close-button']} type="button" onClick={onClose} aria-label="Close movement form">
            <LuX aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={submitMovement}>
          <fieldset className={styles['movement-choice']}>
            <legend>Movement type</legend>
            <button
              className={`${styles['kind-option']} ${kind === 'received' ? styles['kind-selected'] : ''}`}
              type="button"
              aria-pressed={kind === 'received'}
              onClick={() => chooseKind('received')}
            >
              <LuArrowDownToLine aria-hidden="true" />
              <span><strong>Receive stock</strong><small>Add units to your shelf</small></span>
            </button>
            <button
              className={`${styles['kind-option']} ${kind === 'issued' ? styles['kind-selected'] : ''}`}
              type="button"
              aria-pressed={kind === 'issued'}
              onClick={() => chooseKind('issued')}
            >
              <LuArrowUpFromLine aria-hidden="true" />
              <span><strong>Issue stock</strong><small>Remove units from your shelf</small></span>
            </button>
          </fieldset>

          <label className={styles.field}>
            <span>Product</span>
            <select value={productId} onChange={(event) => setProductId(event.target.value)} required>
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name} · {product.sku}</option>
              ))}
            </select>
          </label>

          <div className={styles['quantity-row']}>
            <label className={styles.field}>
              <span>Units {kind === 'received' ? 'received' : 'issued'}</span>
              <input
                autoFocus
                min="1"
                required
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </label>
            <div className={styles['available-stock']}>
              <span>Currently on hand</span>
              <strong>{selectedProduct?.quantity ?? 0} <small>units</small></strong>
            </div>
          </div>

          {exceedsAvailableStock && (
            <p className={styles['stock-error']} role="alert">There are only {selectedProduct.quantity} units available to issue.</p>
          )}

          <label className={styles.field}>
            <span>Note <small>Optional</small></span>
            <input value={note} onChange={(event) => setNote(event.target.value)} placeholder={kind === 'received' ? 'Supplier delivery, purchase order...' : 'Sale, transfer, damaged goods...'} />
          </label>

          <footer className={styles['form-footer']}>
            <span>Counts save automatically</span>
            <div>
              <button className={styles['button-secondary']} type="button" onClick={onClose}>Cancel</button>
              <button className={styles['button-primary']} type="submit" disabled={!selectedProduct || quantityNumber < 1 || exceedsAvailableStock}>
                {kind === 'received' ? 'Log receipt' : 'Log issue'}
              </button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default MovementModal
