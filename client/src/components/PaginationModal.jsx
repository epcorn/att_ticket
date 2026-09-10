import { Pagination } from "flowbite-react"

function PaginationModal({ limit, startIndex, totalTickets, onPageChange }) {
  const currPage = Math.floor(startIndex / limit) + 1
  const totalPage = Math.ceil(totalTickets / limit) || 1

  const handlePageChange = (page) => {
    const newStartIndex = (page - 1) * limit;
    onPageChange(newStartIndex)
  }
  return (
    <div className="mx-auto w-fit my-3">

      <Pagination currentPage={currPage} totalItems={totalTickets} totalPages={totalPage} onPageChange={handlePageChange}>
      </Pagination>
    </div>
  )
}

export default PaginationModal