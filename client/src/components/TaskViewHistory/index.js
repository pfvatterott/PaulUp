import React, { useState, useEffect } from "react";
import { Row, Col} from "react-materialize";
import Moment from 'react-moment';
import API from "../../utils/API";
import "./style.css";

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
          })
        }
        else if (taskHistoryRawData[i].action === "task_assigned") {
          API.getUser(taskHistoryRawData[i].user).then((getUserRes) => {
            API.getUser(taskHistoryRawData[i].to).then((getAssigneeRes) => {
              let historyItem = {
                description: `${getUserRes.data.firstName} ${getUserRes.data.lastName} changed assignee to ${getAssigneeRes.data.firstName} ${getAssigneeRes.data.lastName}`,
                date: taskHistoryRawData[i].date
              }
              tempTaskHistory.push(historyItem)
            })
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
        return <Row className="Row historyItemRow" key={historyItem.description + Math.random()}>
          <Col s={9} className="left">
          <p>{historyItem.description}</p>
          </Col>
          <Col s={3} className="right">
          <p><Moment format="MM/DD/YY">{historyItem.date}</Moment><span> </span><Moment format="h:mm a">{historyItem.date}</Moment></p>
          </Col>
        </Row>
      })}
    </div>
  )
}
