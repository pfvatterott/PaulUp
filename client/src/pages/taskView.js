import React, { useState, useEffect } from "react";
import { Modal, Button , Row, Col, Textarea} from "react-materialize";
import { Redirect, useParams, BrowserRouter as Router, useLocation } from "react-router-dom";
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import DateSelector from "../components/DateSelector"
import API from "../utils/API"
import AssigneeSelector from "../components/AssigneeSelector"
import TaskViewHistory from "../components/TaskViewHistory"
import "./styles/taskViewStyle.css"

export default function TaskView(props) {
    const location = useLocation();
    const [taskName, setTaskName] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [startDate, setStartDate] = useState('')
    const [description, setDescription] = useState({text: ''})
    const [taskAssignee, setTaskAssignee] = useState('')
    const [currentList, setCurrentList] = useState('')
    const [workspaceUsers, setWorkspaceUsers] = useState([])
    const [value, setValue] = useState(0);
    const [redirectToList, setRedirectToList] = useState(false);
    let currentTask = location.pathname.replace('/task/', '')
    let userIdVariable = location.state



    useEffect(() => {
        console.log(currentTask)
        API.getTask(currentTask).then((getTaskRes) => {
            setTaskAssignee(getTaskRes.data.task_assignee)
            setTaskName(getTaskRes.data.task_name)
            setDueDate(getTaskRes.data.due_date)
            setStartDate(getTaskRes.data.start_date)
            if (getTaskRes.data.task_description) {
                setDescription(getTaskRes.data.task_description)
            }
            else {
                setDescription({text: ''})
            }
            API.getList(getTaskRes.data.list_id).then((getListRes) => {
                console.log(getListRes)
                setCurrentList(getListRes.data)
                loadUsers(getListRes.data)
            })
        })

        
        
    
    }, [])

    function loadUsers(listData) {
        if (listData.space_id) {
            API.getSpace(listData.space_id).then(SpaceRes => {
                API.getWorkspace(SpaceRes.data.workspace_id).then(workspaceRes => {
                  setWorkspaceUsers(workspaceRes.data.users)
                })
              })
        }
        else {
            API.getFolder(listData.folder_id).then(FolderRes => {
                API.getSpace(FolderRes.data.space_id).then(SpaceRes => {
                    API.getWorkspace(SpaceRes.data.workspace_id).then(workspaceRes => {
                      setWorkspaceUsers(workspaceRes.data.users)
                    })
                  })
            })
        }
       
    }

    function handleDescriptionChange(event) {
        setDescription({text: event})
    }

    function closeModal() {
        let newDescription = {
            task_description: description
        }
        API.updateTask(currentTask, newDescription).then((res) => {
            setDescription({text: ''})
            setRedirectToList(true)
        })
    }
    

    return (
        <Modal
            open={true}
            id={currentTask}
            className='task_view_modal'
            actions={[]}
            options={{
            dismissible: false
            }}>
                <Row>
                { redirectToList ? (<Redirect push to={{pathname: '/listview/' + currentList._id, state: userIdVariable}}/>) : null }
                    <Col s={3}>
                        <h4>{taskName}</h4>
                    </Col>
                    <Col s={3}>
                        { workspaceUsers ? (<AssigneeSelector currentList={currentList} workspaceUsers={workspaceUsers} id={currentTask} assignees={taskAssignee} value={value} setValue={(x) => setValue(x)} taskView={true} currentUser={userIdVariable}></AssigneeSelector> ) : null} 
                    </Col>
                    <Col s={5}>
                        <DateSelector id={currentTask} startDate={startDate} dueDate={dueDate}/>
                    </Col>
                    <Col s={1}>
                        <Button onClick={closeModal}className="right">Close</Button>
                    </Col>
                </Row>
                <Row>
                    <Col s={7}>
                        <ReactQuill key={currentTask} className="descriptionBox"  value={description.text} onChange={handleDescriptionChange}/>
                    </Col>
                    <Col s={5} className='taskViewHistoryCol'>
                        <TaskViewHistory task={currentTask} workspaceUsers={workspaceUsers}/>
                    </Col>
                </Row>
          
           
        </Modal>
    )
}
