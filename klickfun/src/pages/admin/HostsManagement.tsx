import { useHostsFilters } from "@/hooks/admin/useHostsFilters"
import { OpenButton } from "@/components/OpenButton"
import { AddHost } from "./hosts/AddHost"
import { HostsFilterBar } from "./hosts/HostsFilterBar"
import { HostsList } from "./hosts/HostsList"

function HostsManagement() {
  const { filters, updateFilters } = useHostsFilters()

  return (
    <>
      <h1 className="mx-auto w-[calc(100%-2rem)] max-w-5xl mt-12 mb-10 text-center text-4xl font-black tracking-tight md:text-5xl bg-linear-to-b from-[#FFF3C4] via-[#FFCA28] to-[#F5A300] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(255,202,40,0.45)] after:mx-auto after:mt-4 after:block after:h-1 after:w-20 after:rounded-full after:bg-linear-to-l after:from-[#F03CFF] after:via-[#00E5FF] after:to-[#FFCA28] after:shadow-[0_0_12px_rgba(0,229,255,0.7)]">ניהול מנחים</h1>
      <OpenButton label="הוספת מנחה">{(close) => <AddHost onClose={close} />}</OpenButton>
      <HostsFilterBar filters={filters} onChange={updateFilters} />
      <HostsList filters={filters} />
    </>
  )
}

export default HostsManagement
