import React, { useState, useEffect } from "react";
import { Redirect, useParams, BrowserRouter as Router, useLocation } from "react-router-dom";
import { Col, Row, TextInput, Button, Collection, CollectionItem } from "react-materialize";
import CustomSideNav from "../components/CustomSideNav";
import "./styles/taskViewStyle.css"
import API from "../utils/API";
import StatusBox from "../components/StatusBox";

function taskView() {
    const location = useLocation()
    const [currentList, setCurrentList] = useState([])
    const [listStatuses, setListStatuses] = useState([])
    const [newTaskName, setNewTaskName] = useState('')
    const [listTasks, setListTasks] = useState([])
    const [value, setValue] = useState(0);
    let userIdVariable = location.state

    useEffect(() => {
        if (location.pathname.length > 30) {
            let currentListVar
            let newLocation = location.pathname.replace('/taskview/', '')
            API.getList(newLocation).then((getListResponse) => {
                for (let j = 0; j < getListResponse.data.statuses.length; j++) {
                    getListResponse.data.statuses[j].showing = false
                }
                setListStatuses(getListResponse.data.statuses)
                console.log(getListResponse.data.statuses)
                setCurrentList(getListResponse.data)
                currentListVar = getListResponse.data._id
                handleGetListTasks(currentListVar)
            })            
        }
    }, [location])

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
        console.log(id)
        let newStatusArray = listStatuses
        for (let i = 0; i < newStatusArray.length; i++) {
            if (newStatusArray[i]._id === id) {
                newStatusArray[i].showing = true
            }
            else {
                newStatusArray[i].showing = false
            }
        }
        console.log(newStatusArray)
        setListStatuses(newStatusArray)
        setNewTaskName('')
        const forceUpdate = useForceUpdate();
    }

    return (
        <div>
            <Row>
                <Col s={0} l={4}>
                    <CustomSideNav></CustomSideNav>
                </Col>
                <Col s={12} l={7} className="container">
                    <Row>
                        <Col s={12}>
                        <h2>{currentList.list_name}</h2>
                        </Col>
                    </Row>

                    {listStatuses ? listStatuses.map(item => (
                        <Row key={item._id}>
                            <Col s={12}>
                                <h3>{item.name}</h3>
                                <ul className="collection left-align taskViewCollection">
                                    {listTasks.map(task => {
                                        if(task.task_status.status === item.name)
                                            return <li className="collection-item" key={task._id}>
                                            <StatusBox id={task._id} status={task.task_status} updateLists={(a) => handleGetListTasks(a)} list_statuses={currentList.statuses}/>
                                            {task.task_name}
                                        </li> 
                                    })}
                                    
                                    { item.showing ? (
                                         <li className="collection-item create_task_collection_item">
                                         <div className="input-field">
                                             <input placeholder="Create New Task" id="first_name" type="text" className="validate" onChange={handleNewTaskNameChange} value={newTaskName}
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
        </div>
       
    )
}

export default taskView;