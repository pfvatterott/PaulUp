import React, { useState, useEffect } from "react";
import Moment from 'react-moment';
import API from "../../utils/API";


export default function TaskViewHistory(props) {
  const [historyItemArray, setHistoryItemArray] = useState([]);


  useEffect(() => {
    API.getTaskHistory(props.task).then((getTaskHistoryRes) => {
      let taskHistoryRawData = getTaskHistoryRes.data[0].event
      let tempTaskHistory = []
      for (let i = 0; i < taskHistoryRawData.length; i++) {
        if (taskHistoryRawData[i].action === "task_created") {
          API.getUser(taskHistoryRawData[i].user).then((getUserRes) => {
            let historyItem = {
              description: `${getUserRes.data.firstName} ${getUserRes.data.lastName} created task`,
              date: taskHistoryRawData[i].date
            }
            tempTaskHistory.push(historyItem)
            console.log(historyItem)
          })
        }
      }
      setHistoryItemArray(tempTaskHistory)
    })
  },[])

  useEffect(() => {},[historyItemArray])

  return (
    <div className='taskViewHistoryContainer'>
      {historyItemArray.map(historyItem => {
        return <div>
          <p className='left'>{historyItem.description}</p>
          <p className='right'><Moment format="MM/DD/YY">{historyItem.date}</Moment><span> </span><Moment format="h:mm a">{historyItem.date}</Moment></p>
        </div>
      })}
    </div>
  )
}
