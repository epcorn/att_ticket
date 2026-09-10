import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "flowbite-react";
import { TableError, TableLoading } from "./TableStats";
import ToolTipComponent from "./ToolTipComponent";
import { useGetRaisedCounts } from "../api/useTicket";

function TicketTable({ tickets, isFetching, isError }) {
  const { data: counts, isFetching: counting } = useGetRaisedCounts();

  return (
    <div className="">
      <div className="relative overflow-x-auto shadow-lg rounded-lg  [corner-shape:squircle] min-h-72 overflow-auto">
        <Table hoverable={true} className="table-auto text-black">
          {/* Changed from Table.Head */}
          <TableHead className="[&_th]:bg-green-300 text-gray-700 text-sm sticky top-0 z-5">
            {/* Changed from Table.HeadCell */}
            <TableRow>
              <TableHeadCell>Ticket No</TableHeadCell>
              <TableHeadCell>Contract No</TableHeadCell>
              <TableHeadCell>Complain Phoneno</TableHeadCell>
              <TableHeadCell>Raise Count</TableHeadCell>
              <TableHeadCell>Due time</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </TableRow>
          </TableHead>

          {/* Changed from Table.Body */}
          <TableBody className="divide-y divide-gray-300 [&_tr]:bg-gray-100">
            {isFetching ? (
              <TableLoading count={6} />
            ) : isError ? (
              <TableError count={6} />
            ) : !tickets?.length ? <TableRow>
              <TableCell colSpan={6} className="text-center p-12">No jobs for today</TableCell>
            </TableRow> : (
              tickets?.map((ticket) => {
                const count = counts?.length && counts?.find(c => c?._id === ticket?.contract?.number)?.count || 0
                return (
                  <TableRow
                    key={ticket._id || ticket?.ticketNo}
                    className="bg-white"
                  >
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 py-3 px-4 text-center">
                      <div>
                        <ToolTipComponent ticket={ticket} />
                      </div>
                    </TableCell>
                    <TableCell>
                      {ticket.contract?.number || "N/A"}
                    </TableCell>
                    <TableCell>
                      {ticket.modeDetails?.phone?.number || "N/A"}
                    </TableCell>
                    <TableCell>
                      {counting ?
                        <p className="px-5 py-3 w-fit bg-gray-400 animate-pulse" />
                        : <span>{count}</span>
                      }
                    </TableCell>
                    <TableCell>
                      {ticket?.scheduledTime}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize font-semibold bg-amber-100 text-amber-600 outline px-3 py-2 rounded-sm">
                        {ticket.status}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}

export default TicketTable