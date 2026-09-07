import { Button } from "flowbite-react"
import { useRef } from "react"
import { useReactToPrint } from 'react-to-print'

function PrintTicket({ ticket }) {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: async () => {
      console.log('print success')
    }
  })

  console.log(ticket)
  return (
    <div>
      <div ref={componentRef} className="ticket p-3 bg-white">
        <div className="ticket-header mb-2 border-b border-black pb-1">
          <h1 className="text-lg font-bold text-center mb-1">Ticket</h1>
          <div className="flex justify-between items-start">
            {/* Left Section: Ticket No & Contract */}
            <div>
              <h2 className="text-sm font-bold mb-0.5">
                Ticket No: {ticket?.ticketNo}
              </h2>
              <h4 className="text-xs">Contract: {ticket?.contract.number}</h4>
            </div>

            {/* Middle Section: Created By & Timestamp */}
            <div className="border-l border-r border-black px-2">
              <div>
                <span className="text-xs font-semibold mb-0.5">
                  Created By:{" "}
                </span>
                <span className="text-xs">{ticket?.createdBy.username}</span>
              </div>
              <div>
                <span className="text-xs font-semibold mt-1">Timestamp: </span>
                <span className="text-xs">
                  {/* {formatTimestamp(ticket?.createdAt)} */}
                </span>
              </div>
            </div>

            {/* Right Section: Scheduled */}
            <div className=" pl-2">
              <p className="text-xs font-semibold mb-0.5">Scheduled:</p>
              <p className="text-xs">
                {ticket?.scheduledDate} | {ticket?.scheduledTime}
              </p>
            </div>
          </div>
        </div>

        <div className="ticket-body">
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-1">Ship To Details:</h3>
            <div className="border-l-2 border-black pl-1">
              <p className="mb-0.5 text-xs">
                <span className="font-semibold">Name:</span>{" "}
                {ticket?.contract.shipToName}
              </p>
              <p className="mb-0.5 text-xs">
                <span className="font-semibold">Address:</span>{" "}
                {ticket?.contract.shipToAddress}
              </p>
              <p className="mb-0.5 text-xs">
                <span className="font-semibold">Emails:</span>{" "}
                {ticket?.contract?.shipToEmail?.join(", ")}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-1">Complain Details:</h3>
            <div className="border-l-2 border-black pl-1">
              <p className="mb-0.5 text-xs">
                <span className="font-semibold">Mode:</span>{" "}
                {ticket?.complainMode}
              </p>
              {ticket?.complainMode === "phone" && (
                <>
                  <p className="mb-0.5 text-xs">
                    <span className="font-semibold">Date:</span>{" "}
                    {ticket?.modeDetails.phone.date}
                  </p>
                  <p className="mb-0.5 text-xs">
                    <span className="font-semibold">Number:</span>{" "}
                    {ticket?.modeDetails.phone.number}
                  </p>
                  <p className="mb-0.5 text-xs">
                    <span className="font-semibold">Caller Details:</span>{" "}
                    {ticket?.modeDetails.phone.callerDetails}
                  </p>
                </>
              )}
              <p className="mb-0.5 text-xs">
                <span className="font-semibold">Problem:</span>{" "}
                {ticket?.issue?.problem?.map((a) => (
                  <span className="mr-1" key={a?.label}>
                    {a.value}
                  </span>
                ))}
              </p>
              <p className="mb-0.5 text-xs">
                <span className="font-semibold">Location:</span>{" "}
                {ticket?.issue.location}
              </p>
              <p className="mb-0.5 text-xs">
                <span className="font-semibold">Details:</span>{" "}
                {ticket?.issue.details}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-1">Appointment Details:</h3>
            <div className="flex">
              <div className="w-1/3 pr-2 border-r border-black">
                <p className="font-semibold mb-0.5 text-xs">Agent:</p>
                <p className="text-xs">{ticket?.agent}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-black pt-2">
            <h3 className="font-semibold text-sm mb-1">Customer Signature:</h3>
            <div className="flex items-center">
              <div className="w-1/2">
                <label htmlFor="signature" className="font-semibold text-xs">
                  Signature:
                </label>
                <input
                  type="text"
                  id="signature"
                  className="border-b border-black w-full focus:outline-none text-xs"
                />
              </div>
              <div className="w-1/2 ml-2">
                <input type="checkbox" id="done" className="mr-1" />
                <label htmlFor="done" className="text-xs">
                  Done
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mt-2">
        <Button className="bg-grad-purple" onClick={() => handlePrint()}>
          <span className="mr-2">Print</span>
          <span>{ticket?.printcount}</span>
        </Button>
      </div>
    </div>
  )
}

export default PrintTicket