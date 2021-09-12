import React, { useState, useEffect } from "react";
import { Redirect, useParams, BrowserRouter as Router, useLocation } from "react-router-dom";
import { Col, Row, TextInput, Button, Collection, CollectionItem } from "react-materialize";
import CustomSideNav from "../components/CustomSideNav";
import "./styles/taskViewStyle.css"
import API from "../utils/API";

function taskView() {
    const location = useLocation()
    const [currentList, setCurrentList] = useState({})
    const [newTaskName, setNewTaskName] = useState('')
    const [listTasks, setListTasks] = useState([])
    let userIdVariable = location.state

    useEffect(() => {
        if (location.pathname.length > 30) {
            let currentListVar
            let newLocation = location.pathname.replace('/taskview/', '')
            API.getList(newLocation).then((getListResponse) => {
                setCurrentList(getListResponse.data)
                currentListVar = getListResponse.data._id
                console.log(getListResponse.data)
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
                    console.log(getListResponse.data)
                    setCurrentList(getListResponse.data)
                    handleGetListTasks(currentList._id)
                })
            })
        })
    }

    function handleGetListTasks(id) {
        API.getListTasks(id).then((getListTasksRes) => {
            console.log(getListTasksRes.data)
            setListTasks(getListTasksRes.data)
        })
    }

    return (
        <div>
            <Row>
                <Col s={4}>
                    <CustomSideNav></CustomSideNav>
                </Col>
                <Col s={7} className="container">
                    <Row>
                        <Col s={12}>
                        <h2>{currentList.list_name}</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col s={12}>
                            <ul class="collection left-align">
                                {listTasks.map(item => (
                                    <li class="collection-item">{item.task_name}</li>
                                ))}
                                <li class="collection-item">
                                    <div class="input-field">
                                        <input placeholder="Create New Task" id="first_name" type="text" class="validate" onChange={handleNewTaskNameChange} value={newTaskName}
                                        onKeyPress={event => {
                                            if (event.key === 'Enter') {
                                              handleCreateNewTask()
                                            }
                                          }}/>
                                    </div>
                                </li>
                                {/* <li class="collection-item">Alvin</li>
                                <li class="collection-item">Alvin</li>
                                <li class="collection-item">Alvin</li> */}
                            </ul>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
       
    )
}

export default taskView;