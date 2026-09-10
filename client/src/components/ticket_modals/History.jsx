import { Timeline, TimelineBody, TimelineContent, TimelineItem, TimelinePoint, TimelineTime, TimelineTitle } from "flowbite-react"
import { formatDateTime } from "../../utils/helper"
import { Calendar1 } from "lucide-react"


function History({ history }) {
  console.log(history)

  return (
    <Timeline vertical>
      {history?.changes?.map(change => {
        const date = formatDateTime(change?.timestamp)

        return (
          <TimelineItem>
            <TimelinePoint icon={Calendar1} />
            <TimelineContent>
              <TimelineTime >{date}</TimelineTime>
              <TimelineTitle className="outline outline-gray-400 p-1 ">
                {change.fields.scheduledDate
                  ? "Ticket Rescheduled"
                  : change.message}
              </TimelineTitle>
              {change.fields &&
                change.fields.scheduledDate &&
                change.fields.scheduledTime ? (
                <TimelineBody>
                  Old Scheduled Date: {change.fields.scheduledDate}
                  <br />
                  Old Scheduled Time: {change.fields.scheduledTime}
                  <br />
                  Message: {change.message}
                  <br />
                  Author: {change.author}
                </TimelineBody>
              ) : (
                <TimelineBody>
                  {change.fields && (
                    <>
                      Status: {change.fields.status}
                      <br />
                    </>
                  )}
                  Author: {change.author}
                </TimelineBody>
              )}
            </TimelineContent>
          </TimelineItem>
        )
      })}

    </Timeline>
  )
}

export default History