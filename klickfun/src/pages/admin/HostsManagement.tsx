import { useHostsFilters } from "@/hooks/admin/useHostsFilters"
import { OpenButton } from "@/components/OpenButton"
import { AddHost } from "./hosts/AddHost"
import { HostsFilterBar } from "./hosts/HostsFilterBar"
import { HostsList } from "./hosts/HostsList"

function HostsManagement() {
  const { filters, updateFilters } = useHostsFilters()

  return (
    <>
      <h1 className="page-title">ניהול מנחים</h1>
      <div className="mb-6 flex justify-center">
        <OpenButton label="הוספת מנחה">{(close) => <AddHost onClose={close} />}</OpenButton>
      </div>
      <div className="toolbar mb-8 flex flex-wrap items-center justify-between gap-3">
        <HostsFilterBar filters={filters} onChange={updateFilters} />
      </div>
      <HostsList filters={filters} />
    </>
  )
}

export default HostsManagement
