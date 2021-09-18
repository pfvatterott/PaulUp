import React, { useState, useEffect } from "react";
import { Dropdown, Icon } from 'react-materialize'
import { useLocation, Redirect } from "react-router-dom";
import API from "../../utils/API"
import DayPicker, { DateUtils } from 'react-day-picker';
import Helmet from 'react-helmet';
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import "./style.css"

export default function DateSelector(props) {
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [setDay, setSetDay] = useState('')

    function handleDayClicked(day) {
        console.log(day)
        const range = DateUtils.addDayToRange(day, setDay);
        setSetDay(range)
        console.log(range)
    }

 

    return (
            <Dropdown
                id={props._id}
                options={{
                    alignment: 'left',
                    autoTrigger: true,
                    closeOnClick: true,
                    constrainWidth: false,
                    container: null,
                    coverTrigger: true,
                    hover: false,
                    inDuration: 150,
                    onCloseEnd: null,
                    onCloseStart: null,
                    onOpenEnd: null,
                    onOpenStart: null,
                    outDuration: 250
                }}
                trigger={<Icon className="right" style={{cursor: 'pointer'}}>date_range</Icon>}
                >
                <DayPicker
                    className="Selectable" 
                    selectedDays={[from, { from, to }]}
                    onDayClick={(a) => handleDayClicked(a)}>
                </DayPicker>
                <Helmet>
                    <style>
                    {`
  .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
    background-color: #f0f8ff !important;
    color: #4a90e2;
  }
  .Selectable .DayPicker-Day {
    border-radius: 0 !important;
  }
  .Selectable .DayPicker-Day--start {
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
  }
  .Selectable .DayPicker-Day--end {
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
  }
`}
                    </style>
                </Helmet>
            </Dropdown>
    )
}
