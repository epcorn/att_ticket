import { Tooltip } from 'flowbite-react';

export default function ToolTipComponent({ ticket }) {
  return (
    <Tooltip
      animation="fade"
      placement="right"
      style="dark"
      content={
        <div className="p-1 space-y-1 text-left text-sm max-w-sm whitespace-normal leading-relaxed">
          <div className="pb-1 border-b border-dotted border-gray-600">
            <p>
              <strong className="">Bill To Name: </strong>
              <span className="text-gray-400">{ticket?.contract?.billToName || 'N/A'}</span>
            </p>
            <p>
              <strong className="">Bill To Address: </strong>
              <span className="text-gray-400">{ticket?.contract?.billToAddress || 'N/A'}</span>
            </p>
          </div>

          <div className='border-b border-dotted border-gray-600'>
            <p>
              <strong className="">Project Name: </strong>
              <span className="text-gray-400 leading-none">{ticket?.contract?.shipToName || 'N/A'}</span>
            </p>
            <p>
              <strong className="">Project Address: </strong>
              <span className="text-gray-400">{ticket?.contract?.shipToAddress || 'N/A'}</span>
            </p>
          </div>
          <div>
            <p><strong>Agent: </strong> <span>{ticket?.agent || "N/A"}</span></p>
          </div>
        </div>
      }
    >
      <span className="inline-flex items-center justify-center font-semibold text-blue-600 hover:text-blue-800 underline decoration-dotted cursor-pointer hover:bg-blue-50 px-2 py-0.5 rounded transition-colors">
        #{ticket?.ticketNo}
      </span>
    </Tooltip>
  );
}