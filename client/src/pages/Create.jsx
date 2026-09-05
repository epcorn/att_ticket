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
      <ModalComponent open={id === "create" && status === true} setOpen={(isOpen) => setToggle(isOpen ? 'create' : "", isOpen)} buttonLabel={title} header={title} >
        <CreateModal />
      </ModalComponent>
      <div>

      </div>
      <div className="mt-12 px-20">
        <h3 className="text-2xl font-semibold my-2">Tommorrows Jobs</h3>
        <TicketTable isError={isError} isFetching={isFetching} tickets={tickets?.tickets} />
      </div>
    </>
  );
}
