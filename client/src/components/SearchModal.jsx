import { Button } from "flowbite-react"
import FormInput from "./form/FormInput";

function SearchModal({ errors, register, handleSubmit, setFilters }) {
  const onSearch = (formData) => {
    setFilters({
      createdBy: formData.createdBy,
      contractNo: formData.contract, // Maps 'contract' field to 'contractNo'
      status: formData.status,
      ticketNo: formData.ticketNo,
    });
  };
  return (

    <div className="m-5 ">
      <form action="" onSubmit={handleSubmit(onSearch)} className="space-y-3">
        <div className="grid grid-cols-4 gap-3">
          <FormInput type="search" required={false} errors={errors} register={register} label='Created By' id='createdBy' />
          <FormInput type="search" required={false} errors={errors} register={register} label='Contract No' id='contract' />
          <FormInput type="search" required={false} errors={errors} register={register} label='Status' id='status' />
          <FormInput type="search" required={false} errors={errors} register={register} label='Ticket No' id='ticketNo' />
        </div>
        <Button type="submit" className="mx-auto bg-grad-blue hover:scale-103 hover:shadow-lg transition-all">
          Search
        </Button>
      </form>
    </div>
  )
}

export default SearchModal