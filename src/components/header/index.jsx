import { useEffect, useRef, useState } from 'react'
import { LuBoxes, LuChevronDown, LuMenu, LuX } from 'react-icons/lu'
import styles from './styles.module.css'

const navigationItems = [
  { label: 'Overview', href: '#overview' },
  { label: 'Inventory', href: '#inventory' },
  { label: 'Movements', href: '#movements' },
]

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    const closeMenu = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
      if (event.type === 'pointerdown' && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeMenu)
    document.addEventListener('keydown', closeMenu)
    return () => {
      document.removeEventListener('pointerdown', closeMenu)
      document.removeEventListener('keydown', closeMenu)
    }
  }, [])

  const closeAfterNavigation = () => setMenuOpen(false)

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={styles['header-inner']}>
        <a className={styles.brand} href="#overview" onClick={closeAfterNavigation}>
          <span className={styles['brand-icon']} aria-hidden="true">
            <LuBoxes />
          </span>
          <span>rackline</span>
          <span className={styles['brand-period']}>.</span>
        </a>

        <nav
          id="main-navigation"
          className={`${styles.navigation} ${menuOpen ? styles['navigation-open'] : ''}`}
          aria-label="Main navigation"
        >
          {navigationItems.map((item) => (
            <a key={item.href} href={item.href} onClick={closeAfterNavigation}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles['header-tools']}>
          <span className={styles['workspace-label']}>
            <span className={styles['status-dot']} aria-hidden="true" />
            Main warehouse
            <LuChevronDown aria-hidden="true" />
          </span>
          <button
            className={styles['menu-toggle']}
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
