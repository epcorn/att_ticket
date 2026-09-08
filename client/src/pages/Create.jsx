import ModalComponent from "../components/ModalComponent";
import CreateModal from "../components/CreateModal";
import { useGetAllTickets } from "../api/useTicket";
import TicketTable from "../components/TicketTable";
import { useMyStore } from "../store/useStore";

export default function Create() {
  const { id, status, setToggle } = useMyStore()
  const { data: tickets, isFetching, isError } = useGetAllTickets();

  const title = 'Create ticket'

  return (
    <>
      <div className="outline-4 rounded-full [corner-shape:squircle] outline-amber-800 px-5 py-3 mt-5 m-2 flex justify-end">
        <ModalComponent open={id === "create" && status === true} setOpen={(isOpen) => setToggle(isOpen ? 'create' : "", isOpen)} buttonLabel={title} header={title} >
          <CreateModal onClose={() => setToggle("", false)} />
        </ModalComponent>
      </div>
      <div>

      </div>
      <div className="mt-12 px-20 max-w-7xl mx-auto">
        <h3 className="text-2xl font-semibold my-2"></h3>
        <TicketTable isError={isError} isFetching={isFetching} tickets={tickets?.tickets} />
      </div>
    </>
  );
}
