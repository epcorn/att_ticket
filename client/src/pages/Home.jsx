import { useGetAllJobs } from "../api/useTicket";
import TicketTable from "../components/TicketTable";

function Home() {
  const { data: tickets, isFetching, isError } = useGetAllJobs({ retry: 1 });
  // const allTickets = tickets?.tickets
  // const todays = tickets?.todaysTickets

  console.log(tickets)
  return (
    <div className="w-full px-4 py-3">
      <div className="px-20">
        <h3 className="text-2xl font-semibold my-2 ">Todays Jobs</h3>
        <TicketTable isError={isError} isFetching={isFetching} tickets={tickets?.todayJobs} />
      </div>
      <div className="mt-12 px-20">
        <h3 className="text-2xl font-semibold my-2">Tommorrows Jobs</h3>
        <TicketTable isError={isError} isFetching={isFetching} tickets={tickets?.tommorrowJobs} />
      </div>
    </div>
  );
}

export default Home;
