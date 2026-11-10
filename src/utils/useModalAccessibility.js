import { useEffect, useRef } from 'react'

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export const useModalAccessibility = (onClose) => {
  const dialogRef = useRef(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined

    const previousFocus = document.activeElement
    const focusTarget = dialog.querySelector('[data-dialog-focus]')
      || dialog.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled])')
      || dialog.querySelector(focusableSelector)
      || dialog
    focusTarget.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = Array.from(dialog.querySelectorAll(focusableSelector))
        .filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true')
      if (!focusable.length) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!dialog.contains(document.activeElement)) {
        event.preventDefault()
        const target = event.shiftKey ? last : first
        target.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      const returnFocus = previousFocus instanceof HTMLElement && previousFocus.isConnected
        ? previousFocus
        : document.getElementById('main-content')
      returnFocus?.focus()
    }
  }, [])

  return dialogRef
}
