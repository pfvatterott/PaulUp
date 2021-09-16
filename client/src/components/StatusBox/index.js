import React, { useState, useEffect } from "react";
import { Dropdown, Button, Divider, Icon } from "react-materialize";
import API from "../../utils/API"
import "./style.css"

export default function StatusBox(props) {
    const [currentStatus, setCurrentStatus] = useState('')
    const [currentColor, setCurrentColor] = useState('')

    useEffect(() => {
        setCurrentStatus(props.status)
        for (let i = 0; i < props.list_statuses.length; i++) {
            if (props.list_statuses[i].name === props.status.status) {
                setCurrentColor(props.list_statuses[i].color)
            }    
        }
    }, [])

    useEffect(() => {
        for (let i = 0; i < props.list_statuses.length; i++) {
            if (props.list_statuses[i].name === currentStatus) {
                setCurrentColor(props.list_statuses[i].color)
            }    
        }
    }, [currentStatus])

    function handleStatusChange(status, status_type) {
        let newTaskData = {
            task_status: {
                type: status_type,
                status: status
            }
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
                    constrainWidth: false,
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
                   {props.list_statuses.map(item => (
                        <a key={item._id} onClick={() => handleStatusChange(item.name, item.type)}>
                            <div className='status_box left' key={props.id} style={{backgroundColor: item.color}}></div>
                        {item.name}
                        </a>
                   ))}
            </Dropdown>
        </div>
    )
}
