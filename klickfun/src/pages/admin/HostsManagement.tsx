import { useHostsFilters } from "@/hooks/admin/useHostsFilters"
import { OpenButton } from "@/components/OpenButton"
import { AddHost } from "./hosts/AddHost"
import { HostsFilterBar } from "./hosts/HostsFilterBar"
import { HostsList } from "./hosts/HostsList"

function HostsManagement() {
  const { filters, updateFilters } = useHostsFilters()

  return (
    <>
      <h1 className="mx-auto w-[calc(100%-2rem)] max-w-5xl mt-10 mb-8 text-center text-4xl font-black tracking-tight md:text-5xl bg-linear-to-b from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(251,191,36,0.55)]">ניהול מנחים</h1>
      <OpenButton label="הוספת מנחה">{(close) => <AddHost onClose={close} />}</OpenButton>
      <HostsFilterBar filters={filters} onChange={updateFilters} />
      <HostsList filters={filters} />
    </>
  )
}

export default HostsManagement
