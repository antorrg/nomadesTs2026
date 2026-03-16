import { useState } from "react"

interface ActionModalProps {
  title: string
  message: string
  confirmText?: string
  onConfirm: () => Promise<void>
  onClose: () => void
}

export default function ActionModal({
  title,
  message,
  confirmText = "Confirm",
  onConfirm,
  onClose
}: ActionModalProps) {

  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">

        <h3>{title}</h3>

        <p>{message}</p>

        <div className="actions">

          <button onClick={onClose}>
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmText}
          </button>

        </div>

      </div>
    </div>
  )
}