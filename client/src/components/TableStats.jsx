import { Alert, Spinner, TableCell, TableRow } from "flowbite-react";
import { Info } from "lucide-react";

export function TableError({ count }) {
  return (
    <TableRow>
      <TableCell colSpan={count} className="py-10 text-center">
        <div className="flex justify-center">
          <Alert color="failure" icon={Info} className="w-full max-w-xl">
            <span className="font-medium">Failed to load tickets:</span>{" "}
            Something went wrong while fetching the data. Please try again.
          </Alert>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function TableLoading({ count }) {
  return (
    <TableRow>
      {/* Changed from Table.Cell */}
      <TableCell colSpan={count} className="py-10">
        <div className="flex justify-center items-center w-full">
          <Spinner size="xl" />
        </div>
      </TableCell>
    </TableRow>
  )
}