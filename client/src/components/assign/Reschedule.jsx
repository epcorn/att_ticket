import { Button, Select } from "flowbite-react";

function Reschedule() {


  function getCurrentDate() {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    return yyyy + "-" + mm + "-" + dd;
  }



  return (
    <div>
      <div>
        <label htmlFor="scheduledDate" className="block mb-2 font-bold">
          Date
        </label>
        <input
          id="scheduledDate"
          className="w-full px-3 py-2 border rounded-md"
          type="date"
          name="scheduledDate"
          min={getCurrentDate()} // Set the min attribute to the current date
        ></input>
      </div>
      <div>
        <label htmlFor="scheduledTime" className="block mb-2 font-bold">
          Time
        </label>
        <Select
          id="scheduledTime"
          name="scheduledTime"
        >
          <option value="" disabled selected>
            Select a time range
          </option>
          <option value="10AM-12PM">10AM : 12PM</option>
          <option value="12PM-02PM">12PM : 02PM</option>
          <option value="02PM-04PM">02PM : 04PM</option>
          <option value="04PM-06PM">04PM : 06PM</option>
          <option value="06PM-08PM">06PM : 08PM</option>
        </Select>
      </div>
      <div>
        <label htmlFor="message" className="block mb-2 font-bold">
          Resion for Re-Scheduling
        </label>
        <textarea
          id="message"
          name="message"
          className="block mb-2 w-full"
        />
      </div>
      <div>
        <Button>Submit</Button>
      </div>
    </div>
  );
}

export default Reschedule;
