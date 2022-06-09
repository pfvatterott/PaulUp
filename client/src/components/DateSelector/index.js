import React, { useState, useEffect } from "react";
import API from "../../utils/API"
import 'react-day-picker/lib/style.css';
import { Icon } from "react-materialize";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';
import "./style.css"

export default function DateSelector(props) {
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const modifiers = { start: from, end: to };
    var moment = require('moment'); 

    useEffect(() => {
      if (props.startDate) {
        setFrom(moment(props.startDate)._d)
      }
      if (props.dueDate) {
        setTo(moment(props.dueDate)._d)
      }
    }, [props.startDate, props.dueDate])


    function handleFromChange(date) {
      console.log(date)
      if (moment.unix(date).format("MM/DD/YYYY") === "Invalid date") {
        setFrom('')
        let startDate = {
          start_date: null
        }
        API.updateTask(props.id, startDate).then((updateTaskRes) => {
        })
        API.getTaskHistory(props.id).then((getTaskHistoryRes) => {
          let tempTaskHistory = getTaskHistoryRes.data[0].event
          let newTaskHistory = {
            action: "start_date_changed",
            user: props.currentUser,
            date: new Date(),
            from: from,
            to: null
          }
          tempTaskHistory.push(newTaskHistory)
          API.updateTaskHistory(getTaskHistoryRes.data[0]._id, { event: tempTaskHistory }).then((updateTaskHistoryRes) => {
          })
        })
      }
      else {
        setFrom(date)
          let startDate = {
            start_date: date
          }
          API.updateTask(props.id, startDate).then((updateTaskRes) => {
          })
          API.getTaskHistory(props.id).then((getTaskHistoryRes) => {
            let tempTaskHistory = getTaskHistoryRes.data[0].event
            let newTaskHistory = {
              action: "start_date_changed",
              user: props.currentUser,
              date: new Date(),
              from: from,
              to: date
            }
            tempTaskHistory.push(newTaskHistory)
            API.updateTaskHistory(getTaskHistoryRes.data[0]._id, { event: tempTaskHistory }).then((updateTaskHistoryRes) => {
            })
          })
      }
    }

    function handleToChange(date) {
      if (props.dueDate === moment(date).unix()) {
        setTo('')
        let dueDate = {
          due_date: null
        }
        API.updateTask(props.id, dueDate).then((updateTaskRes) => {
        })
        API.getTaskHistory(props.id).then((getTaskHistoryRes) => {
          let tempTaskHistory = getTaskHistoryRes.data[0].event
          let newTaskHistory = {
            action: "due_date_changed",
            user: props.currentUser,
            date: new Date(),
            from: to,
            to: null
          }
          tempTaskHistory.push(newTaskHistory)
          API.updateTaskHistory(getTaskHistoryRes.data[0]._id, { event: tempTaskHistory }).then((updateTaskHistoryRes) => {
          })
        })
      }
      else {
        setTo(date)
        console.log(JSON.stringify(date))
        let dueDate = {
          due_date: date
        }
        API.updateTask(props.id, dueDate).then((updateTaskRes) => {
        })
        API.getTaskHistory(props.id).then((getTaskHistoryRes) => {
          let tempTaskHistory = getTaskHistoryRes.data[0].event
          let newTaskHistory = {
            action: "due_date_changed",
            user: props.currentUser,
            date: new Date(),
            from: to,
            to: date
          }
          tempTaskHistory.push(newTaskHistory)
          API.updateTaskHistory(getTaskHistoryRes.data[0]._id, { event: tempTaskHistory }).then((updateTaskHistoryRes) => {
          })
        })
      }
    }

   

    return (

        <td className="InputFromTo">
        <DayPickerInput
          value={from}
          placeholder=''
          format="MM/DD/YYYY"
          formatDate={formatDate}
          parseDate={parseDate}
          clickUnselectsDay={true}
          dayPickerProps={{
            selectedDays: [from, { from, to }],
            disabledDays: { after: to },
            toMonth: to,
            modifiers,
            numberOfMonths: 1,
            // onDayClick: (a) => handleDayClicked(a),
          }}
          onDayChange={(a) => handleFromChange(a)}
        />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span className="InputFromTo-to">
        <DayPickerInput
            // ref={el => (this.to = el)}
            value={to}
            placeholder=""
            format="MM/DD/YYYY"
            formatDate={formatDate}
            parseDate={parseDate}
            clickUnselectsDay={true}
            dayPickerProps={{
              selectedDays: [from, { from, to }],
              disabledDays: { before: from },
              modifiers,
              month: from,
              fromMonth: from,
              numberOfMonths: 1,
            }}
            onDayChange={(a) => handleToChange(a)}
          />
          
        </span>
        </td>

        
    )
}
