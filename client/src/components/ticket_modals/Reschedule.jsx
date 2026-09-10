import { Button, Select } from "flowbite-react";
import { timings } from "../../utils/constData";
import { useForm } from "react-hook-form";
import { useUpdateTicket } from "../../api/useTicket";
import { toast } from "react-toastify";

function Reschedule({ ticket, onClose }) {
  const { mutateAsync: update, isPending: updating } = useUpdateTicket()

  const todayStr = new Date().toISOString().split("T")[0];
  const formattedTicketDate = ticket?.scheduledDate
    ? new Date(ticket.scheduledDate).toISOString().split("T")[0]
    : "";

  const { handleSubmit, formState: { errors }, register } = useForm({ defaultValues: { scheduledDate: formattedTicketDate, scheduledTime: ticket.scheduledTime, message: "" } })
  
  const submit = async (data) => {
    try {
      data.key = 'reschedule'
      console.log(data)
      await update({ data, id: ticket?._id })

      if (onClose) onClose();
    } catch (error) {
      toast.error("error in scheduling ticket, please refresh")
      throw error
    }
  }
  console.log(new Date(ticket?.scheduledDate).toISOString().split("T")[0])
  return (
    <form onSubmit={handleSubmit(submit)}>
      <div>
        <label htmlFor="scheduledDate" className="block mb-2 font-bold">
          Date
        </label>
        <input
          id="scheduledDate"
          className="w-full px-3 py-2 border rounded-md"
          type="date"
          min={todayStr} // Use the string value here
          {...register("scheduledDate", {
            required: "Date is required",
            validate: (val) => val >= todayStr || "Past dates not allowed" // Use the string value here too
          })}
        />
        <RequiredError errors={errors} id={'scheduledDate'} />
      </div>
      <div>
        <label htmlFor="scheduledTime" className="block mb-2 font-bold">
          Time
        </label>
        <Select
          id="scheduledTime"
          {...register("scheduledTime", { required: "scheduled time required" })}
        >
          <option value='' disabled selected>
            Select a time range
          </option>
          {timings.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </Select>

        <RequiredError errors={errors} id={'scheduledTime'} />
      </div>
      <div>
        <label htmlFor="message" className="block mb-2 font-bold">
          Resion for Re-Scheduling
        </label>
        <textarea
          id="message"
          className="block mb-2 w-full"
          {...register("message", { required: "reason required" })}
        />
        <RequiredError errors={errors} id={'message'} />
      </div>
      <div>
        <Button type="submit" disabled={updating}>{updating ? "Rescheduling..." : "Reschedule"}</Button>
      </div>
    </form>
  );
}

export default Reschedule;


function RequiredError({ id, errors }) {
  return (
    <>
      {errors[id] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500 font-medium">
          {errors[id].message}
        </p>
      )}
    </>
  )
}