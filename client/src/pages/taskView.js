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

    useEffect(() => {
        if (location.pathname.length > 30) {
            let newLocation = location.pathname.replace('/taskview/', '')
            API.getList(newLocation).then((getListResponse) => {
                setCurrentList(getListResponse.data)
                console.log(getListResponse.data)
            })
        }
    }, [location])

    function handleNewTaskNameChange(event) {
        const name = event.target.value;
        setNewTaskName(name)
    }

    function handleCreateNewList() {
        console.log(newTaskName)
        setNewTaskName('')
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
                                <li class="collection-item">
                                    <div class="input-field">
                                        <input placeholder="Create New Task" id="first_name" type="text" class="validate" onChange={handleNewTaskNameChange} value={newTaskName}
                                        onKeyPress={event => {
                                            if (event.key === 'Enter') {
                                              handleCreateNewList()
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