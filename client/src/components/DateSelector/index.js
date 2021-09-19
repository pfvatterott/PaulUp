import React, { useState, useEffect } from "react";
import API from "../../utils/API"
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';
import "./style.css"

export default function DateSelector(props) {
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [startPlaceHolder, setStartPlaceHolder] = useState('')
    const [duePlaceHolder, setDuePlaceHolder] = useState('')
    const modifiers = { start: from, end: to };
    var moment = require('moment'); 

    useEffect(() => {
      if (props.startDate) {
        setFrom(props.startDate)
      }
      if (props.dueDate) {
        setTo(props.dueDate)
      }
    }, [])

    function handleFromChange(date) {
      console.log(date)
      if (moment.unix(date).format("MM/DD/YYYY") === "Invalid date") {
        setFrom('')
        let startDate = {
          start_date: null
        }
        API.updateTask(props.id, startDate).then((updateTaskRes) => {
        })
      }
      else {
        setFrom(date)
          let startDate = {
            start_date: date
          }
          API.updateTask(props.id, startDate).then((updateTaskRes) => {
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
      }
      else {
        setTo(date)
        console.log(JSON.stringify(date))
        let dueDate = {
          due_date: date
        }
        API.updateTask(props.id, dueDate).then((updateTaskRes) => {
        })
      }
    }

   

    return (

        <td className="InputFromTo">
        <DayPickerInput
          value={from}
          placeholder=""
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
