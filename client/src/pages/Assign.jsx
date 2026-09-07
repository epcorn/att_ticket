import TicketFullTable from '../components/TicketFullTable';
import { useGetAllTickets } from '../api/useTicket';
import SearchModal from '../components/SearchModal';
import { useForm } from 'react-hook-form';
import { useState } from 'react';


function Assign() {
  const [filters, setFilters] = useState({});
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { data: tickets, isFetching, isError } = useGetAllTickets(filters, { gcTime: Infinity });

  return (
    <div className='max-w-7xl mx-auto my-5'>
      <div className='p-5 text-center outline-2 outline-amber-500 text-2xl m-5 rounded-md'>
        Recent Tickets
      </div>
      <SearchModal
        errors={errors}
        register={register}
        setFilters={setFilters}
        handleSubmit={handleSubmit}
      />
      <TicketFullTable tickets={tickets?.filtered} isError={isError} isFetching={isFetching} />
    </div>
  );
}

export default Assign