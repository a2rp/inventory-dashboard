import styles from './App.module.css'
import Header from './components/header/index.jsx'

const App = () => (
  <div className={styles['app-shell']}>
    <Header />
    <main className={styles['page-content']}>
      <section id="overview" aria-labelledby="dashboard-heading">
        <h1 id="dashboard-heading">Rackline inventory workspace</h1>
      </section>
    </main>
  </div>
)

export default App
