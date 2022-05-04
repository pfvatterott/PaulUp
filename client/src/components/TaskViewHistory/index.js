import React, { useState, useEffect } from "react";
import { Row, Col} from "react-materialize";
import Moment from 'react-moment';
import API from "../../utils/API";
import "./style.css";

export default function TaskViewHistory(props) {
  const [historyItemArray, setHistoryItemArray] = useState([]);


  useEffect(() => {
    getTaskHistory()
  },[props.value])

  useEffect(() => {
  },[historyItemArray])



  function getTaskHistory() {
    API.getTaskHistory(props.task).then((getTaskHistoryRes) => {
      let taskHistoryRawData = getTaskHistoryRes.data[0].event
      let tempTaskHistory = []
      for (let i = 0; i < taskHistoryRawData.length; i++) {
        if (taskHistoryRawData[i].action === "task_created") {
          API.getUser(taskHistoryRawData[i].user).then((getUserRes) => {
            let historyItem = {
              description: `${getUserRes.data.firstName} ${getUserRes.data.lastName} created task`,
              date: taskHistoryRawData[i].date,
              type: "task_created"
            }
            tempTaskHistory.push(historyItem)
          })
        }
        else if (taskHistoryRawData[i].action === "task_assigned") {
          API.getUser(taskHistoryRawData[i].user).then((getUserRes) => {
            if (taskHistoryRawData[i].to === "unassigned") {
              let historyItem = {
                description: `${getUserRes.data.firstName} ${getUserRes.data.lastName} unassigned task`,
                date: taskHistoryRawData[i].date,
                type: "unassigned"
              }
              tempTaskHistory.push(historyItem)
            }
            else {
              API.getUser(taskHistoryRawData[i].to).then((getAssigneeRes) => {
                let historyItem = {
                  description: `${getUserRes.data.firstName} ${getUserRes.data.lastName} changed assignee to ${getAssigneeRes.data.firstName} ${getAssigneeRes.data.lastName}`,
                  date: taskHistoryRawData[i].date,
                  type: "assignee"
                }
                tempTaskHistory.push(historyItem)
              })
            }
          })
        }
        else if (taskHistoryRawData[i].action === "comment") {
          API.getUser(taskHistoryRawData[i].user).then((getUserRes) => {
            let historyItem = {
              description: taskHistoryRawData[i].to,
              date: taskHistoryRawData[i].date,
              type: "comment",
              img: getUserRes.data.image
            }
            tempTaskHistory.push(historyItem)
          })
        }
        setTimeout(function () {
          if (tempTaskHistory.length === taskHistoryRawData.length) {
            let sortedTime = tempTaskHistory.sort(function(a,b){return new Date(a.date).valueOf() - new Date(b.date).valueOf()})
            setHistoryItemArray(sortedTime)
          }

        }, 1000)
      }
    })
  }

  return (
    <div className='taskViewHistoryContainer'>
      {historyItemArray.map(historyItem => {
        if(historyItem.type === "comment")
        return <Row className="Row historyItemRow historyItemRowComment" key={historyItem.description + Math.random()}>
          <Col s={9} className="left">
          <img alt="profilePicComment" src={historyItem.img} className="circle profilePicComment"></img>
          <p>{historyItem.description}</p>
          </Col>
          <Col s={3} className="right">
          <p><Moment format="MM/DD/YY h:mm a">{historyItem.date}</Moment></p>
          </Col>
        </Row>
        if(historyItem.type !== "comment")
        return <Row className="Row historyItemRow" key={historyItem.description + Math.random()}>
        <Col s={9} className="left">
        <p>{historyItem.description}</p>
        </Col>
        <Col s={3} className="right">
        <p><Moment format="MM/DD/YY h:mm a">{historyItem.date}</Moment></p>
        </Col>
      </Row>
    })}
    </div>
  )
}
