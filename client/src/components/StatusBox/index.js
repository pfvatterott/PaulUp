import React, { useState, useEffect } from "react";
import { Dropdown, Button, Divider, Icon } from "react-materialize";
import API from "../../utils/API"
import "./style.css"

export default function StatusBox(props) {
    const [currentTask, setCurrentTask] = useState('')
    const [currentStatus, setCurrentStatus] = useState('')
    const [currentColor, setCurrentColor] = useState('')

    useEffect(() => {
        setCurrentTask(props.id)
        setCurrentStatus(props.status)
        if (props.status === 'open') {
            setCurrentColor("#D3D3D3")
        }
        else if (props.status === 'in progress') {
            setCurrentColor("#A875FF")
        }
        else if (props.status === 'closed') {
            setCurrentColor("#6BC950")
        }
    }, [])

    useEffect(() => {
        if (currentStatus === 'open') {
            setCurrentColor("#D3D3D3")
        }
        else if (currentStatus === 'in progress') {
            setCurrentColor("#A875FF")
        }
        else if (currentStatus === 'closed') {
            setCurrentColor("#6BC950")
        }
    }, [currentStatus])

    function handleStatusChange(status) {
        let newTaskData = {
            task_status: status
        }
        API.updateTask(props.id, newTaskData).then((updateTaskRes) => {
            setCurrentStatus(status)
            props.updateLists(updateTaskRes.data.list_id)
        })
    }
    
    return (
        <div>
            <Dropdown
                id={props.id}
                className="dropdownMenu"
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
                trigger={<div className='status_box left' key={props.id} style={{backgroundColor: currentColor}}></div>}
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
