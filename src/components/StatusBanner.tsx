interface StatusBannerProps {
  status: {
    tone: 'info' | 'success' | 'error'
    message: string
  } | null
  onDismiss: () => void
}

export const StatusBanner = ({ status, onDismiss }: StatusBannerProps) => {
  if (!status) {
    return null
  }

  return (
    <div className={`status-banner status-banner--${status.tone}`} role="status" aria-live="polite">
      <span>{status.message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss status message">
        Close
      </button>
    </div>
  )
}
