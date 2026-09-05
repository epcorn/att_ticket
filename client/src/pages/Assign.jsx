import TicketFullTable from '../components/TicketFullTable';
import { useGetAllTickets } from '../api/useTicket';
import SearchModal from '../components/SearchModal';
import { useForm } from 'react-hook-form';


function Assign() {
  const { data: tickets, isFetching, isError } = useGetAllTickets({ gcTime: Infinity });
  const { register, formState: { errors } } = useForm();
  const filtered = tickets?.filtered;

  return (
    <div className='max-w-7xl mx-auto my-5'>
      <div className='p-5 text-center outline-2 outline-amber-500 text-2xl m-5 rounded-md '>
        Recent Tickets
      </div>
      <SearchModal errors={errors} register={register} />
      <TicketFullTable tickets={filtered} isError={isError} isFetching={isFetching} />

    </div>
  )
}

export default Assign;