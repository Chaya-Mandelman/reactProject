import { useHostsFilters } from "@/hooks/admin/useHostsFilters"
import { OpenButton } from "@/components/OpenButton"
import { AddHost } from "./hosts/AddHost"
import { HostsFilterBar } from "./hosts/HostsFilterBar"
import { HostsList } from "./hosts/HostsList"

function HostsManagement() {
  const { filters, updateFilters } = useHostsFilters()

  return (
    <>
      <h1>ניהול מנחים</h1>
      <OpenButton label="הוספת מנחה">{(close) => <AddHost onClose={close} />}</OpenButton>
      <HostsFilterBar filters={filters} onChange={updateFilters} />
      <HostsList filters={filters} />
    </>
  )
}

export default HostsManagement
