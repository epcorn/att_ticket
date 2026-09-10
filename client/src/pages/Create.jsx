import ModalComponent from "../components/ModalComponent";
import CreateModal from "../components/CreateModal";
import { useGetAllTickets, useGetRaisedCounts } from "../api/useTicket";
import TimeAgo from "react-timeago";
import { useMyStore } from "../store/useStore";
import { Badge, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { TableError, TableLoading } from "../components/TableStats";
import PaginationModal from "../components/PaginationModal";
import { useState } from "react";
import ToolTipComponent from "../components/ToolTipComponent";

export default function Create() {
  const [startIndex, setStartIndex] = useState(0)

  const { id, status, setToggle } = useMyStore()
  const { data: tickets = {}, isFetching, isError } = useGetAllTickets();
  const { data: counts, isFetching: counting } = useGetRaisedCounts();

  const limit = 20;
  const title = 'Create ticket'

  return (
    <>
      <div className="outline-4 rounded-full [corner-shape:squircle] outline-amber-800 px-5 py-3 mt-5 m-2 flex justify-end">
        <h3 className="flex-1 text-center self-center text-2xl font-semibold">All Tickets ({tickets?.totalTickets})</h3>
        <ModalComponent open={id === "create" && status === true} setOpen={(isOpen) => setToggle(isOpen ? 'create' : "", isOpen)} buttonLabel={title} header={title} >
          <CreateModal onClose={() => setToggle("", false)} />
        </ModalComponent>
      </div>
      <div>

      </div>
      <div className="mt-12 px-10 xl:px-30 mx-auto">
        <h3 className="text-2xl font-semibold my-2"></h3>
        <Table className="table-auto text-black">
          <TableHead>
            <TableRow className="[&_th]:bg-gray-300 [&_th]:py-4 text-sm">
              <TableHeadCell>Ticket No</TableHeadCell>
              <TableHeadCell>Created By</TableHeadCell>
              <TableHeadCell>Contract No</TableHeadCell>
              <TableHeadCell>Raised Counts</TableHeadCell>
              <TableHeadCell>Timestamp</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isError ? <TableError count={6} />
              : isFetching ? <TableLoading count={6} />
                : !tickets.filtered.length ?
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-10">
                      No Tickets found! Lets Add some
                    </TableCell>
                  </TableRow>
                  : tickets?.filtered?.map(tick => {
                    const count = counts?.length && counts?.find(c => c._id === tick?.contract?.number)?.count || 0
                    return (
                      <TableRow key={tick._id}>
                        <TableCell>
                          <ToolTipComponent ticket={tick} />
                        </TableCell>
                        <TableCell>{tick?.createdBy?.username}</TableCell>
                        <TableCell className="uppercase">{tick?.contract?.number}</TableCell>
                        <TableCell className="text-center">
                          {counting ?
                            <p className="px-10 w-fit py-4 bg-gray-600 rounded-lg animate-pulse"></p>
                            : <span>{count}</span>
                          }
                        </TableCell>
                        <TableCell><TimeAgo date={tick?.createdAt} /></TableCell>
                        <TableCell><Badge size="sm" className="w-fit p-2 text-sm">{tick?.status}</Badge></TableCell>
                      </TableRow>
                    )
                  })
            }
          </TableBody>
        </Table>
        <PaginationModal totalTickets={tickets?.totalTickets || 0} limit={limit} startIndex={startIndex} onPageChange={(indx) => setStartIndex(indx)} />

      </div>
    </>
  );
}
