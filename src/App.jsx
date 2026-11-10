import styles from './App.module.css'
import { useEffect, useState } from 'react'
import BackToTop from './components/backToTop/index.jsx'
import Header from './components/header/index.jsx'
import Footer from './components/footer/index.jsx'
import InventoryTable from './components/inventoryTable/index.jsx'
import MovementHistory from './components/movementHistory/index.jsx'
import MovementModal from './components/movementModal/index.jsx'
import ProductModal from './components/productModal/index.jsx'
import ReorderQueue from './components/reorderQueue/index.jsx'
import StockOverview from './components/stockOverview/index.jsx'
import { initialMovements, initialProducts } from './data/products.js'

const saveLocalData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

const getSavedProducts = () => {
  try {
    const savedProducts = localStorage.getItem('rackline-products-v1')
    if (!savedProducts) return initialProducts
    const parsedProducts = JSON.parse(savedProducts)
    return Array.isArray(parsedProducts) ? parsedProducts : initialProducts
  } catch {
    return initialProducts
  }
}

const getSavedMovements = () => {
  try {
    const savedMovements = localStorage.getItem('rackline-movements-v1')
    if (!savedMovements) return initialMovements
    const parsedMovements = JSON.parse(savedMovements)
    return Array.isArray(parsedMovements) ? parsedMovements : initialMovements
  } catch {
    return initialMovements
  }
}

const App = () => {
  const [products, setProducts] = useState(getSavedProducts)
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState(null)
  const [movementModalOpen, setMovementModalOpen] = useState(false)
  const [movementProductId, setMovementProductId] = useState(null)
  const [movements, setMovements] = useState(getSavedMovements)
  const [storageWarning, setStorageWarning] = useState(false)

  useEffect(() => {
    const productsSaved = saveLocalData('rackline-products-v1', products)
    const movementsSaved = saveLocalData('rackline-movements-v1', movements)
    setStorageWarning(!productsSaved || !movementsSaved)
  }, [products, movements])

  const openProductModal = () => {
    setProductToEdit(null)
    setProductModalOpen(true)
  }

  const editProduct = (product) => {
    setProductToEdit(product)
    setProductModalOpen(true)
  }

  const saveProduct = (updatedProduct) => {
    if (productToEdit) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === productToEdit.id ? { ...product, ...updatedProduct } : product,
        ),
      )
    } else {
      setProducts((currentProducts) => [
        ...currentProducts,
        { ...updatedProduct, id: `RK-${Date.now()}` },
      ])
    }
    setProductModalOpen(false)
  }

  const closeProductModal = () => setProductModalOpen(false)
  const openMovementModal = (productId = null) => {
    setMovementProductId(productId)
    setMovementModalOpen(true)
  }
  const closeMovementModal = () => setMovementModalOpen(false)

  const saveMovement = (movementDetails) => {
    const product = products.find((item) => item.id === movementDetails.productId)
    if (!product) return
    const signedQuantity = movementDetails.kind === 'received'
      ? movementDetails.quantity
      : -movementDetails.quantity

    setProducts((currentProducts) => currentProducts.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + signedQuantity } : item,
    ))
    setMovements((currentMovements) => [{
      ...movementDetails,
      id: `MV-${Date.now()}`,
      productName: product.name,
      date: new Date().toISOString(),
    }, ...currentMovements])
    setMovementModalOpen(false)
  }

  return (
    <div className={styles['app-shell']}>
      <Header />
      <main className={styles['page-content']} id="main-content" tabIndex={-1}>
        {storageWarning && (
          <p className={styles['storage-warning']} role="alert">
            Browser storage is unavailable or full. Changes may not be saved after you leave this page.
          </p>
        )}
        <StockOverview
          products={products}
          onAddProduct={openProductModal}
          onRecordMovement={() => openMovementModal()}
        />
        <InventoryTable
          products={products}
          onAddProduct={openProductModal}
          onEditProduct={editProduct}
        />
        <div className={styles['workflow-grid']}>
          <ReorderQueue products={products} onReceiveStock={(product) => openMovementModal(product.id)} />
          <MovementHistory movements={movements} onRecordMovement={() => openMovementModal()} />
        </div>
      </main>
      <Footer />
      <BackToTop />
      {productModalOpen && (
        <ProductModal
          key={productToEdit?.id || 'new-product'}
          product={productToEdit}
          onClose={closeProductModal}
          onSave={saveProduct}
        />
      )}
      {movementModalOpen && (
        <MovementModal
          key={movementProductId || 'all-products'}
          products={products}
          initialProductId={movementProductId}
          onClose={closeMovementModal}
          onSave={saveMovement}
        />
      )}
    </div>
  )
}

export default App
