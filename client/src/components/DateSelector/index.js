import React, { useState, useEffect } from "react";
import API from "../../utils/API"
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';
import "./style.css"

export default function DateSelector(props) {
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [setDay, setSetDay] = useState('')
    const modifiers = { start: from, end: to };


    function handleDayClicked(day) {
        if (!from && !to) {
            setFrom(day)
        }
        else if (from && !to) {
            setTo(day)
        }
        else {
          setFrom(day)
          setTo('')
        }
    }

    function handleResetClick() {
      setTo('')
      setFrom('')
    }


    return (

        <td className="InputFromTo">
        <DayPickerInput
          value={from}
          placeholder=""
          format="MM/DD/YYYY"
          formatDate={formatDate}
          parseDate={parseDate}
          dayPickerProps={{
            selectedDays: [from, { from, to }],
            disabledDays: { after: to },
            toMonth: to,
            modifiers,
            numberOfMonths: 1,
            // onDayClick: (a) => handleDayClicked(a),
          }}
          onDayChange={(a) => setFrom(a)}
        />{' '}
        —{' '}
        <span className="InputFromTo-to">
        <DayPickerInput
            // ref={el => (this.to = el)}
            value={to}
            placeholder=""
            format="MM/DD/YYYY"
            formatDate={formatDate}
            parseDate={parseDate}
            dayPickerProps={{
              selectedDays: [from, { from, to }],
              disabledDays: { before: from },
              modifiers,
              month: from,
              fromMonth: from,
              numberOfMonths: 1,
            }}
            onDayChange={(a) => setTo(a)}
          />
          
        </span>
        </td>

        
    )
}
