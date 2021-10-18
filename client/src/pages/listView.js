import React, { useState, useEffect } from "react";
import { Redirect, useParams, BrowserRouter as Router, useLocation } from "react-router-dom";
import { Col, Row, Button, Icon, Dropdown, Divider } from "react-materialize";
import ListViewTaskTitle from "../components/ListViewTaskTitle";
import CustomSideNav from "../components/CustomSideNav";
import TaskView from "../components/TaskView"
import TaskOptionsDropdown from "../components/TaskOptionsDropdown";
import "./styles/listViewStyle.css"
import API from "../utils/API";
import StatusBox from "../components/StatusBox";
import DateSelector from "../components/DateSelector";
// import { List } from "@material-ui/icons";



function taskView() {
    const location = useLocation()
    const [currentList, setCurrentList] = useState([])
    const [listStatuses, setListStatuses] = useState([])
    const [newTaskName, setNewTaskName] = useState('')
    const [listTasks, setListTasks] = useState([])
    const [taskNameLabel, setTaskNameLabel]= useState('Task Name')
    const [openTaskView, setOpenTaskView] = useState(false)
    const [taskViewTask, setTaskViewTask] = useState('')
    const [value, setValue] = useState(0);
    const [taskNameEdit, setTaskNameEdit] = useState(false)
    let userIdVariable = location.state

    useEffect(() => {
        if (location.pathname.length > 30) {
            let currentListVar
            let newLocation = location.pathname.replace('/listview/', '')
            API.getList(newLocation).then((getListResponse) => {
                for (let j = 0; j < getListResponse.data.statuses.length; j++) {
                    getListResponse.data.statuses[j].showing = false
                }
                setListStatuses(getListResponse.data.statuses)
                setCurrentList(getListResponse.data)
                currentListVar = getListResponse.data._id
                handleGetListTasks(currentListVar)
            })            
        }
    }, [location, openTaskView])

    // forces re-render of DOM
    function useForceUpdate() {
        let newValue = value + 1
        setValue(newValue)
    }


    function handleNewTaskNameChange(event) {
        const name = event.target.value;
        setNewTaskName(name)
    }

    function handleCreateNewTask(name, type) {
        setNewTaskName('')
        let statusArray = listStatuses
        for (let i = 0; i < statusArray.length; i++) {
            if (statusArray[i].showing === true) {
                statusArray[i].showing = false
            }
        }
        let newTask = {
            task_name: newTaskName,
            owner_id: userIdVariable,
            list_id: currentList._id,
            task_status: {
                type: type,
                status: name
            },
            order_index: currentList.tasks.length
        }
        API.saveTask(newTask).then((saveTaskResponse) => {
            let newTaskArray = currentList.tasks
            newTaskArray.push(saveTaskResponse.data._id)
            let newTaskData = {
                tasks: newTaskArray
            }
            API.updateList(currentList._id, newTaskData).then((updateListResponse) => {
                API.getList(currentList._id).then((getListResponse) => {
                    setCurrentList(getListResponse.data)
                    handleGetListTasks(currentList._id)
                })
                })
        })
    }

    function handleGetListTasks(id) {
        API.getListTasks(id).then((getListTasksRes) => {
            setListTasks(getListTasksRes.data)
        })
    }

    function handleOpenCreateTaskInput(id) {
        let newStatusArray = listStatuses
        for (let i = 0; i < newStatusArray.length; i++) {
            if (newStatusArray[i]._id === id) {
                newStatusArray[i].showing = true
            }
            else {
                newStatusArray[i].showing = false
            }
        }
        setListStatuses(newStatusArray)
        setNewTaskName('')
        const forceUpdate = useForceUpdate();
    }

    function handleSortByTaskName() {
        console.log('working')
        if (taskNameLabel === 'Task Name') {
            setTaskNameLabel("↓ Task Name")
            let listArray = listTasks
            listArray.sort((a, b) => a.task_name.localeCompare(b.task_name))
            setListTasks(listArray)
        }
        else if (taskNameLabel === "↓ Task Name") {
            setTaskNameLabel("↑ Task Name")
            let listArray = listTasks
            listArray.sort((a, b) => b.task_name.localeCompare(a.task_name))
            setListTasks(listArray)
        }
        else {
            setTaskNameLabel('Task Name')
            handleGetListTasks(currentList._id)
        }
    }

    function handleTaskNameEdit(id, name) { 
        console.log(name)
        setTaskNameEdit(true)
    }

    function handleOpenTaskView(task_id) {
        setTaskViewTask(task_id)
        setOpenTaskView(true)
    }
    

    function handleTaskViewClose() {
        setOpenTaskView(false)
    }


    return (
        <div>
            <Row>
                <Col s={0} l={3}>
                    <CustomSideNav></CustomSideNav>
                </Col>
                <Col s={12} l={8} className="container">
                    <Row>
                        <Col s={3}>
                            <h3 className="left">{currentList.list_name}</h3>
                        </Col>
                        <Col s={9}></Col>
                    </Row>

                    {listStatuses ? listStatuses.map(item => (
                        <Row key={item._id}>
                            <Col s={12}>
                                <Row>
                                    <Col s={3}>
                                        <h5 className="left">{item.name}</h5>
                                    </Col>
                                </Row>
                                 <table>
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th onClick={() => handleSortByTaskName()} className='task_name'>{taskNameLabel}</th>
                                        <th className="right">Start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                                        Due&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {listTasks.map(task => {
                                        if(task.task_status.status === item.name)
                                            return <tr className="collection-item" key={task._id}>
                                            <td className="status_box"><StatusBox id={task._id} status={task.task_status} updateLists={(a) => handleGetListTasks(a)} list_statuses={currentList.statuses}/></td>
                                            <ListViewTaskTitle taskName={task.task_name} taskID={task._id} handleOpenTaskView={(x) => handleOpenTaskView(x)}/>   
                                            <DateSelector id={task._id} startDate={task.start_date} dueDate={task.due_date}></DateSelector>
                                            <TaskOptionsDropdown id={task._id} list={task.list_id} orderIndex={task.order_index}/>
                                        </tr>
                                    })}         
                                    </tbody>
                                </table>


                                <ul className="collection left-align taskViewCollection">
                                    { item.showing ? (
                                         <li className="collection-item create_task_collection_item">
                                         <div className="input-field">
                                             <input autoFocus placeholder="Create New Task" id="first_name" type="text" className="validate" onChange={handleNewTaskNameChange} value={newTaskName}
                                             onKeyPress={event => {
                                                 if (event.key === 'Enter') {
                                                 handleCreateNewTask(item.name, item.type)
                                                 }
                                             }}/>
                                         </div>
                                     </li>
                                    ) : <Button flat node="button" waves="light" onClick={() => handleOpenCreateTaskInput(item._id)}>+ Task</Button>}
                                </ul>   
                            </Col>
                        </Row>
                    )): null }
                </Col>
            </Row>
            <TaskView open={openTaskView} task={taskViewTask} close={() => handleTaskViewClose()}/>
        </div>
       
    )
}

export default taskView;    