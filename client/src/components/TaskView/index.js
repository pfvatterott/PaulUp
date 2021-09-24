import React, { useState, useEffect } from "react";
import { Modal, Button , Row, Col, Textarea} from "react-materialize";
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import DateSelector from "../DateSelector"
import API from "../../utils/API"
import "./style.css"

export default function TaskView(props) {
    const [taskName, setTaskName] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [startDate, setStartDate] = useState('')
    const [description, setDescription] = useState({text: ''})


    useEffect(() => {
        if (props.task && props.open) {
            API.getTask(props.task).then((getTaskRes) => {
                setTaskName(getTaskRes.data.task_name)
                setDueDate(getTaskRes.data.due_date)
                setStartDate(getTaskRes.data.start_date)
                if (getTaskRes.data.task_description) {
                    setDescription(getTaskRes.data.task_description)
                }
                else {
                    setDescription({text: ''})
                }
                
            })
        }
    }, [props.open])

    function handleDescriptionChange(event) {
        setDescription({text: event})
    }

    function closeModal() {
        let newDescription = {
            task_description: description
        }
        API.updateTask(props.task, newDescription).then((res) => {
            setDescription({text: ''})
            props.close()
        })
    }
    

    return (
        <Modal
            open={props.open}
            id={props.task}
            className='task_view_modal'
            actions={[]}
            options={{
            dismissible: false
            }}>
                <Row>
                    <Col s={6}>
                        <h4>{taskName}</h4>
                    </Col>
                    <Col s={5}>
                        <DateSelector id={props.task} startDate={startDate} dueDate={dueDate}/>
                    </Col>
                    <Col s={1}>
                        <Button onClick={closeModal}className="right">Close</Button>
                    </Col>
                </Row>
                <Row>
                    <Col s={7}>
                        <ReactQuill key={props.task} className="descriptionBox"  value={description.text} onChange={handleDescriptionChange}/>
                    </Col>
                </Row>
          
           
        </Modal>
    )
}
