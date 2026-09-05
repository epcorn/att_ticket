import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "flowbite-react";
import { TableError, TableLoading } from "./TableStats";

function TicketTable({ tickets, isFetching, isError }) {
  return (
    <div className="">
      <div className="relative overflow-x-auto shadow-sm rounded-lg border ">
        <Table hoverable={true}>
          {/* Changed from Table.Head */}
          <TableHead className="[&_th]:bg-green-300 text-gray-700">
            {/* Changed from Table.HeadCell */}
            <TableRow>
              <TableHeadCell>Ticket No</TableHeadCell>
              <TableHeadCell>Contract No</TableHeadCell>
              <TableHeadCell>Complain Phoneno</TableHeadCell>
              <TableHeadCell>Quarterly Count</TableHeadCell>
              <TableHeadCell>Due time</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </TableRow>
          </TableHead>

          {/* Changed from Table.Body */}
          <TableBody className="divide-y">
            {isFetching ? (
              <TableLoading count={6} />
            ) : isError ? (
              <TableError count={6} />
            ) : !tickets?.length ? <TableRow>
              <TableCell colSpan={6} className="text-center p-12">No jobs for today</TableCell>
            </TableRow> : (
              tickets?.map((ticket) => (
                <TableRow
                  key={ticket._id || ticket.ticketNo}
                  className="bg-white"
                >
                  <TableCell className="whitespace-nowrap font-medium text-gray-900">
                    {ticket.ticketNo}
                  </TableCell>
                  <TableCell>
                    {ticket.contract?.number || "N/A"}
                  </TableCell>
                  <TableCell>
                    {ticket.modeDetails?.phone?.number || "N/A"}
                  </TableCell>
                  <TableCell>
                    {/* Placeholder for Quarterly Count */}
                  </TableCell>
                  <TableCell>
                    {/* Placeholder for Due time */}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize font-semibold text-gray-700">
                      {ticket.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TicketTable