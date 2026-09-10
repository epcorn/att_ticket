import { Card } from "flowbite-react";
import { useGetAllJobs } from "../api/useTicket";
import TicketTable from "../components/TicketTable";

function Home() {
  const { data: tickets, isFetching, isError } = useGetAllJobs();

  console.log(tickets)

  // console.log(Object.entries(tickets?.counts))
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-5 max-w-7xl mx-auto px-4 py-6 gap-6 items-start">
      <div className="hidden grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-4 h-fit lg:sticky lg:top-20">
        {/* {Object.entries(tickets?.counts).map(({ Key, val }) => (
          <Card>
            <h3 className="text-sm font-medium text-gray-500">Total {key} tickets</h3>
            <p className="text-2xl font-semibold">{tickets?.counts?.Open || 0}</p>
          </Card>

        ))} */}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-4 h-fit lg:sticky lg:top-20">
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Total Open tickets</h3>
          <p className="text-2xl font-semibold">{tickets?.counts?.Open || 0}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Total Assigned tickets</h3>
          <p className="text-2xl font-semibold">{tickets?.counts?.Assigned || 0}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Total Closed tickets</h3>
          <p className="text-2xl font-semibold">{tickets?.counts?.Closed || 0}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Total Canceled tickets</h3>
          <p className="text-2xl font-semibold">{tickets?.counts?.Canceled || 0}</p>
        </Card>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-4 space-y-12">
        <div>
          <h3 className="text-2xl font-semibold mb-3">
            Todays Jobs ({tickets?.todayJobs?.length || 0})
          </h3>
          <TicketTable isError={isError} isFetching={isFetching} tickets={tickets?.todayJobs} />
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-3">
            Tommorrows Jobs ({tickets?.tomorrowJobs?.length || 0})
          </h3>
          <TicketTable isError={isError} isFetching={isFetching} tickets={tickets?.tomorrowJobs} />
        </div>

      </div>

    </div>
  );
}

export default Home;
