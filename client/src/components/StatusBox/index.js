import React, { useState, useEffect } from "react";
import { Dropdown, Button, Divider, Icon } from "react-materialize";
import API from "../../utils/API"
import "./style.css"

export default function StatusBox(props) {
    const [currentTask, setCurrentTask] = useState('')

    useEffect(() => {
        console.log(props)
        setCurrentTask(props._id)
    }, [])

    function handleStatusChange(status) {
        let newTaskData = {
            task_status: status
        }
        API.updateTask(props.id, newTaskData).then((updateTaskRes) => {
            console.log(updateTaskRes)
        })
    }
    
    return (
        <div>
            <Dropdown
                id={props.id}
                options={{
                    alignment: 'left',
                    autoTrigger: true,
                    closeOnClick: true,
                    constrainWidth: true,
                    container: null,
                    coverTrigger: false,
                    hover: false,
                    inDuration: 150,
                    onCloseEnd: null,
                    onCloseStart: null,
                    onOpenEnd: null,
                    onOpenStart: null,
                    outDuration: 250
                }}
                trigger={<div className='status_box left' key={props.id}></div>}
                >
                <a onClick={() => handleStatusChange('open')}>
                    Open
                </a>
                <Divider />
                <a onClick={() => {handleStatusChange('in progress')}}>
                    In Progress
                </a>
                <Divider />
                <a onClick={() => {handleStatusChange('closed')}}>
                    Closed
                </a>
            </Dropdown>
        </div>
    )
}
