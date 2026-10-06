import styles from './styles.module.css'

const footerLinks = [
  { label: 'Portfolio', href: 'https://www.ashishranjan.net' },
  { label: 'GitHub', href: 'https://github.com/a2rp' },
  { label: 'CodePen', href: 'https://codepen.io/ash1198' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aashishranjan' },
  { label: 'Facebook', href: 'https://www.facebook.com/theash.ashish/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1' },
  { label: 'Email', href: 'mailto:ash.ranjan09@gmail.com' },
  { label: 'Source code', href: 'https://github.com/a2rp/inventory-dashboard' },
  { label: 'Support', href: 'https://a2rp-donation-page.netlify.app/' },
  { label: 'Buy Me a Coffee', href: 'https://buymeacoffee.com/ashishranjan' },
  { label: 'Patreon', href: 'https://www.patreon.com/ashishranjan' },
]

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles['footer-inner']}>
        <div className={styles['footer-credit']}>
          <a className={styles['footer-logo']} href="https://www.ashishranjan.net" target="_blank" rel="noreferrer">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Ashish Ranjan" />
          </a>
          <p>© {year} <a href="https://github.com/a2rp" target="_blank" rel="noreferrer">Ashish Ranjan</a>. All rights reserved.</p>
        </div>
        <nav className={styles['footer-links']} aria-label="Footer links">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
