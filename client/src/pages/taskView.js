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
    const [newTaskName, setNewTaskName] = useState('')
    const [listTasks, setListTasks] = useState([])
    let userIdVariable = location.state

    useEffect(() => {
        if (location.pathname.length > 30) {
            let currentListVar
            let newLocation = location.pathname.replace('/taskview/', '')
            API.getList(newLocation).then((getListResponse) => {
                console.log(getListResponse.data)
                setCurrentList(getListResponse.data)
                currentListVar = getListResponse.data._id
                handleGetListTasks(currentListVar)
            })
        }
    }, [location])



    function handleNewTaskNameChange(event) {
        const name = event.target.value;
        setNewTaskName(name)
    }

    function handleCreateNewTask() {
        setNewTaskName('')
        let newTask = {
            task_name: newTaskName,
            owner_id: userIdVariable,
            list_id: currentList._id,
            task_status: {
                type: 'open',
                status: currentList.statuses[0].open[0]
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

                    {/* starting something new here */}
                    {/* {currentList.statuses.map(item => {
                        <Row>
                            <h2>{item}</h2>
                        </Row>
                    })} */}

                    <Row>
                        <Col s={12}>
                            <h3>Open</h3>
                            <ul className="collection left-align taskViewCollection">
                                {listTasks.map(item => {
                                    if(item.task_status.status === 'OPEN')
                                        return <li className="collection-item" key={item._id}>
                                        <StatusBox id={item._id} status={item.task_status} updateLists={(a) => handleGetListTasks(a)} list_statuses={currentList.statuses}/>
                                        {item.task_name}
                                    </li>
                                    
                                })}
                                <li className="collection-item create_task_collection_item">
                                    <div className="input-field">
                                        <input placeholder="Create New Task" id="first_name" type="text" className="validate" onChange={handleNewTaskNameChange} value={newTaskName}
                                        onKeyPress={event => {
                                            if (event.key === 'Enter') {
                                              handleCreateNewTask()
                                            }
                                          }}/>
                                    </div>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                    <Row>
                        <Col s={12}>
                            <h3>In Progress</h3>
                            <ul className="collection left-align taskViewCollection">
                                {listTasks.map(item => {
                                    if(item.task_status === 'in progress')
                                        return <li className="collection-item" key={item._id}>
                                        <StatusBox id={item._id} status={item.task_status} updateLists={(a) => handleGetListTasks(a)} list_statuses={currentList.statuses}/>
                                        {item.task_name}
                                    </li>
                                    
                                })}
                                <li className="collection-item create_task_collection_item">
                                    <div className="input-field">
                                        <input placeholder="Create New Task" id="first_name" type="text" className="validate" onChange={handleNewTaskNameChange} value={newTaskName}
                                        onKeyPress={event => {
                                            if (event.key === 'Enter') {
                                              handleCreateNewTask()
                                            }
                                          }}/>
                                    </div>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                    <Row>
                        <Col s={12}>
                            <h3>Closed</h3>
                            <ul className="collection left-align taskViewCollection">
                                {listTasks.map(item => {
                                    if(item.task_status === 'closed')
                                        return <li className="collection-item" key={item._id}>
                                        <StatusBox id={item._id} status={item.task_status} updateLists={(a) => handleGetListTasks(a)} list_statuses={currentList.statuses}/>
                                        {item.task_name}
                                    </li>
                                    
                                })}
                                <li className="collection-item create_task_collection_item">
                                    <div className="input-field">
                                        <input placeholder="Create New Task" id="first_name" type="text" className="validate" onChange={handleNewTaskNameChange} value={newTaskName}
                                        onKeyPress={event => {
                                            if (event.key === 'Enter') {
                                              handleCreateNewTask()
                                            }
                                          }}/>
                                    </div>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
       
    )
}

export default taskView;