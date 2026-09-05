import { Button } from "flowbite-react"
import FormInput from "./form/FormInput"

function SearchModal({ errors, register }) {
  
  return (
    <div className="m-5 space-y-3">
      <div className="grid grid-cols-4 gap-3">
        <FormInput type="search" errors={errors} register={register} label='Created By' id='createdBy' />
        <FormInput type="search" errors={errors} register={register} label='Contract No' id='contract.number' />
        <FormInput type="search" errors={errors} register={register} label='Status' id='status' />
        <FormInput type="search" errors={errors} register={register} label='Ticket No' id='ticketNo' />
      </div>
      <Button className="bg-grad-blue hover:scale-103 hover:shadow-lg transition-all">
        Search
      </Button>
    </div>
  )
}

export default SearchModal