import { useAddHost } from "@/hooks/admin/useHostMutations"
import { HostForm } from "./HostForm"

export function AddHost({ onClose }: { onClose: () => void }) {
  const addHost = useAddHost()

  return (
    <HostForm
      submitLabel="הוספת מנחה"
      onCancel={onClose}
      onSubmit={async (data) => {
        await addHost.mutateAsync(data)
        onClose()
      }}
    />
  )
}
