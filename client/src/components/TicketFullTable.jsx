import {
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import TimeAgo from "react-timeago";
import { TableError, TableLoading } from "./TableStats";

import { useMyStore } from "../store/useStore";
import ModalComponent from "./ModalComponent";
import { checkRights } from "../utils/helper";
import CreateModal from "./CreateModal";
import PrintTicket from "./ticket_modals/PrintTicket";
import Reschedule from "./ticket_modals/Reschedule";
import History from "./ticket_modals/History";
import ImageUploader from "./ImageUploader";
import { useImageUploade, useUpdateTicket } from "../api/useTicket";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

function TicketFullTable({ tickets, isError, isFetching }) {
  const { mutateAsync: upload, isPending: uploading } = useImageUploade();
  const { setToggle, id, status } = useMyStore();
  const { mutateAsync: update } = useUpdateTicket();
  const { register, formState: { errors }, handleSubmit, } = useForm();

  return (
    <div className="px-5 mx-auto w-full">
      <div className="rounded-lg shadow-sm overflow-x-auto border border-gray-200">
        <Table className="min-w-7xl w-full table-fixed divide-y divide-gray-400">
          <TableHead className="sticky top-0">
            <TableRow className="[&_th]:bg-neutral-300 text-sm">
              <TableHeadCell className="w-[10%]">Ticket No</TableHeadCell>
              <TableHeadCell className="w-[15%]">Created By</TableHeadCell>
              <TableHeadCell className="w-[15%]">Phone No</TableHeadCell>
              <TableHeadCell className="w-[20%]">Contract No</TableHeadCell>
              <TableHeadCell className="w-[15%]">Timestamps</TableHeadCell>
              <TableHeadCell className="w-[10%]">Status</TableHeadCell>
              <TableHeadCell className="w-[10%]">Edit</TableHeadCell>
              <TableHeadCell className="w-[20%] text-center">
                Actions
              </TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y divide-gray-400">
            {isFetching ? (
              <TableLoading count={7} />
            ) : isError ? (
              <TableError count={7} />
            ) : !tickets?.length ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-4 text-gray-500">
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              tickets?.map((ticket) => (
                <TableRow
                  key={ticket._id}
                  className="text-black hover:bg-gray-50">
                  <TableCell className="font-medium whitespace-nowrap">
                    {ticket.ticketNo}
                  </TableCell>
                  <TableCell className="truncate">
                    {ticket?.createdBy?.username}
                  </TableCell>
                  <TableCell className="truncate">
                    {ticket?.modeDetails?.phone?.number}
                  </TableCell>
                  <TableCell className="whitespace-pre-line">
                    {ticket?.contract?.number}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <TimeAgo date={ticket?.createdAt} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Select value={ticket.status} onChange={async (e) => {
                      const value = e.target.value;
                      try {

                        const res = await update({ status: value, id: ticket._id })
                        console.log(res)
                      } catch (error) {
                        console.log(error)
                        toast.error("error:", error?.msg || error?.message)
                      }
                    }}>
                      <option value="Open" disabled>Open</option>{" "}
                      <option value="Assigned" disabled>Assigned</option>{" "}
                      <option value="Closed">Closed</option>{" "}
                      <option value="Canceled">Canceled</option>{" "}
                    </Select>

                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="w-fit">
                      <ModalComponent
                        open={id === `${ticket._id}view` && status === true}
                        setOpen={(isOpen) =>
                          setToggle(isOpen ? `${ticket._id}view` : "", isOpen)
                        }
                        buttonLabel={ticket.status !== "Open" ? "View" : "Edit"}
                        header={ticket.status !== "Open" ? "View" : "Edit"}
                        size="sm"
                        disabled={ticket.status === "Canceled"}
                        btn="bg-grad-dark">
                        {ticket.status !== "Open" ? (
                          <CreateModal
                            ticket={ticket}
                            onClose={() =>
                              setToggle(`${ticket._id}view`, false)
                            }
                            view={true}
                          />
                        ) : (
                          <CreateModal
                            ticket={ticket}
                            onClose={() =>
                              setToggle(`${ticket._id}view`, false)
                            }
                            edit={true}
                          />
                        )}
                      </ModalComponent>
                    </div>
                  </TableCell>
                  <TableCell className="px-0 whitespace-nowrap">
                    <div className="flex flex-wrap items-center justify-center gap-2 *:m-0">
                      <ModalComponent
                        open={id === `${ticket._id}print` && status === true}
                        setOpen={(isOpen) =>
                          setToggle(isOpen ? `${ticket._id}print` : "", isOpen)
                        }
                        buttonLabel="Print Ticket"
                        header="Print Ticket"
                        size="sm"
                        disabled={ticket.status === "Canceled"}
                        btn="bg-grad-green">
                        <PrintTicket ticket={ticket} />
                      </ModalComponent>
                      {ticket.history && (
                        <ModalComponent
                          open={
                            id === `${ticket._id}history` && status === true
                          }
                          setOpen={(isOpen) =>
                            setToggle(
                              isOpen ? `${ticket._id}history` : "",
                              isOpen,
                            )
                          }
                          buttonLabel="History"
                          header="History"
                          size="sm"
                          btn="bg-grad-purple">
                          <History />
                        </ModalComponent>
                      )}
                      {ticket.status === "Assigned" &&
                        checkRights("assign", "admin") && (
                          <ModalComponent
                            open={
                              id === `${ticket._id}reschedule` &&
                              status === true
                            }
                            setOpen={(isOpen) =>
                              setToggle(
                                isOpen ? `${ticket._id}reschedule` : "",
                                isOpen,
                              )
                            }
                            buttonLabel="Reschedule"
                            header="Reschedule"
                            size="sm"
                            btn="bg-grad-amber">
                            <Reschedule
                              ticket={ticket}
                              onClose={() =>
                                setToggle(`${ticket._id}reschedule`, false)
                              }
                            />
                          </ModalComponent>
                        )}
                      {/* {ticket.status === "Assigned" && checkRights("markDone", "admin") &&
                        <ModalComponent
                          open={id === `${ticket._id}img` && status === true}
                          setOpen={(isOpen) =>
                            setToggle(isOpen ? `${ticket._id}img` : "", isOpen)
                          }
                          buttonLabel="Upload Image"
                          header="upload Image"
                          size="sm"
                          btn="bg-grad-rose"
                        >
                        </ModalComponent>
                      } */}
                      <ImageUploader
                        errors={errors}
                        handleSubmit={handleSubmit}
                        register={register}
                        open={id === `${ticket._id}img` && status === true}
                        setOpen={(isOpen) =>
                          setToggle(isOpen ? `${ticket._id}img` : "", isOpen)
                        }
                        upload={upload}
                        id={`${ticket._id}_img`}
                        uploading={uploading}
                        buttonLabel="Upload Image"
                        header="upload Image"
                        size="sm"
                        btn="bg-grad-rose"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default TicketFullTable;
