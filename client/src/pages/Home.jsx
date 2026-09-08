import { useGetAllJobs } from "../api/useTicket";
import TicketTable from "../components/TicketTable";

function Home() {
  const { data: tickets, isFetching, isError } = useGetAllJobs({ retry: 1 });


  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-3">
      <div className="px-20">
        <h3 className="text-2xl font-semibold my-2 ">Todays Jobs</h3>
        <TicketTable isError={isError} isFetching={isFetching} tickets={tickets?.todayJobs} />
      </div>
      <div className="mt-12 px-20 max-w-7xl mx-auto">
        <h3 className="text-2xl font-semibold my-2">Tommorrows Jobs</h3>
        <TicketTable isError={isError} isFetching={isFetching} tickets={tickets?.tommorrowJobs} />
      </div>
    </div>
  );
}

export default Home;
