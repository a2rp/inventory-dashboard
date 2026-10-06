import styles from './App.module.css'
import Header from './components/header/index.jsx'
import StockOverview from './components/stockOverview/index.jsx'
import { initialProducts } from './data/products.js'

const App = () => (
  <div className={styles['app-shell']}>
    <Header />
    <main className={styles['page-content']}>
      <StockOverview products={initialProducts} />
    </main>
  </div>
)

export default App
