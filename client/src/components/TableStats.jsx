import { Alert, TableCell, TableRow } from "flowbite-react";
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


export const TableLoading = ({ count, yes = true }) => {
  const rows = Array.from({ length: count });
  return (
    <>
      {rows.map((_, rowIndex) => (
        <TableRow key={rowIndex} className="animate-pulse bg-white dark:bg-gray-800">
          <TableCell><div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-16"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-24"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-32"></div></TableCell>
          {yes &&
            <>
              <TableCell><div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-8"></div></TableCell>
              <TableCell><div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-20"></div></TableCell>
              <TableCell><div className="h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-16"></div></TableCell>
            </>
          }
        </TableRow>
      ))}
    </>
  );
};