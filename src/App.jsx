import styles from './App.module.css'
import { useEffect, useState } from 'react'
import Header from './components/header/index.jsx'
import InventoryTable from './components/inventoryTable/index.jsx'
import MovementModal from './components/movementModal/index.jsx'
import ProductModal from './components/productModal/index.jsx'
import StockOverview from './components/stockOverview/index.jsx'
import { initialMovements, initialProducts } from './data/products.js'

const getSavedProducts = () => {
  try {
    const savedProducts = localStorage.getItem('rackline-products-v1')
    return savedProducts ? JSON.parse(savedProducts) : initialProducts
  } catch {
    return initialProducts
  }
}

const getSavedMovements = () => {
  try {
    const savedMovements = localStorage.getItem('rackline-movements-v1')
    return savedMovements ? JSON.parse(savedMovements) : initialMovements
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

  useEffect(() => {
    localStorage.setItem('rackline-products-v1', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('rackline-movements-v1', JSON.stringify(movements))
  }, [movements])

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
      <main className={styles['page-content']}>
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
      </main>
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
