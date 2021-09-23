import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-materialize";
import API from "../../utils/API"
import "./style.css"

export default function TaskView(props) {
    const [taskName, setTaskName] = useState('')

    useEffect(() => {
        if (props.task && props.open) {
            API.getTask(props.task).then((getTaskRes) => {
                console.log(getTaskRes)
                setTaskName(getTaskRes.data.task_name)
            })
        }
    }, [props.open])

    return (
        <Modal
            open={props.open}
            className='center-align'
            actions={[]}
            options={{
            dismissible: false
            }}>
            <h3>{taskName}</h3>
            <br></br>
            <br></br>
            <Button onClick={props.close}>Close</Button>
            <br></br><br></br>
           
        </Modal>
    )
}
