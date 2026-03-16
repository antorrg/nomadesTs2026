import { useState } from "react"

export function useAdminAction() {

  const [modal, setModal] = useState<{
    title: string
    message: string
    action: () => Promise<void>
  } | null>(null)

  const open = (
    title: string,
    message: string,
    action: () => Promise<void>
  ) => {

    setModal({
      title,
      message,
      action
    })

  }

  const close = () => setModal(null)

  return {
    modal,
    open,
    close
  }

}