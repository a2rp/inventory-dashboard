import { LuArrowDownToLine, LuArrowUpFromLine, LuArrowRightLeft, LuPlus } from 'react-icons/lu'
import styles from './styles.module.css'

const formatMovementDate = (dateValue) => {
  const date = new Date(dateValue)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)

  if (isToday) return `Today, ${time}`
  const day = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
  return `${day} · ${time}`
}

const MovementHistory = ({ movements, onRecordMovement }) => {
  const recentMovements = [...movements]
    .sort((first, second) => new Date(second.date) - new Date(first.date))

  return (
    <section className={styles.history} id="movements" aria-labelledby="movement-heading">
      <header className={styles['history-heading']}>
        <div>
          <p className={styles.eyebrow}><LuArrowRightLeft aria-hidden="true" /> MOVEMENT LOG</p>
          <h2 id="movement-heading">Stock in motion.</h2>
          <p>{movements.length} logged updates, newest first.</p>
        </div>
        <button type="button" onClick={onRecordMovement} aria-label="Record a stock movement">
          <LuPlus aria-hidden="true" />
        </button>
      </header>

      {recentMovements.length ? (
        <ol className={styles['movement-list']}>
          {recentMovements.map((movement) => {
            const wasReceived = movement.kind === 'received'
            return (
              <li key={movement.id}>
                <span className={`${styles['movement-icon']} ${wasReceived ? styles.received : styles.issued}`}>
                  {wasReceived ? <LuArrowDownToLine aria-hidden="true" /> : <LuArrowUpFromLine aria-hidden="true" />}
                </span>
                <div className={styles['movement-copy']}>
                  <strong>{movement.productName}</strong>
                  <span>{movement.note || (wasReceived ? 'Stock received' : 'Stock issued')}</span>
                </div>
                <div className={styles['movement-meta']}>
                  <strong className={wasReceived ? styles['quantity-in'] : styles['quantity-out']}>
                    {wasReceived ? '+' : '−'}{movement.quantity}
                  </strong>
                  <time dateTime={movement.date}>{formatMovementDate(movement.date)}</time>
                </div>
              </li>
            )
          })}
        </ol>
      ) : (
        <div className={styles['empty-history']}>
          <span><LuArrowRightLeft aria-hidden="true" /></span>
          <strong>No movements yet</strong>
          <p>Log a receipt or issue to start your stock history.</p>
        </div>
      )}
    </section>
  )
}

export default MovementHistory
