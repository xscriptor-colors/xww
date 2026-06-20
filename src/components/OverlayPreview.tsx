interface OverlayPreviewProps {
  text: string
  position: 'center' | 'bottom'
}

export const OverlayPreview = ({ text, position }: OverlayPreviewProps) => {
  if (!text) {
    return null
  }

  return (
    <div className={`overlay-preview overlay-preview--${position}`}>
      <h2>{text}</h2>
    </div>
  )
}
