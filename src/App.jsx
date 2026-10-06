import styles from './App.module.css'
import { useEffect, useState } from 'react'
import Header from './components/header/index.jsx'
import InventoryTable from './components/inventoryTable/index.jsx'
import ProductModal from './components/productModal/index.jsx'
import StockOverview from './components/stockOverview/index.jsx'
import { initialProducts } from './data/products.js'

const getSavedProducts = () => {
  try {
    const savedProducts = localStorage.getItem('rackline-products-v1')
    return savedProducts ? JSON.parse(savedProducts) : initialProducts
  } catch {
    return initialProducts
  }
}

const App = () => {
  const [products, setProducts] = useState(getSavedProducts)
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState(null)

  useEffect(() => {
    localStorage.setItem('rackline-products-v1', JSON.stringify(products))
  }, [products])

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

  return (
    <div className={styles['app-shell']}>
      <Header />
      <main className={styles['page-content']}>
        <StockOverview products={products} onAddProduct={openProductModal} />
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
    </div>
  )
}

export default App
