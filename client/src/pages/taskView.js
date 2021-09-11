import React, { useState, useEffect } from "react";
import { Redirect, useParams, BrowserRouter as Router, useLocation } from "react-router-dom";
import { Col, Row, Textarea, Button, Collection, CollectionItem } from "react-materialize";
import CustomSideNav from "../components/CustomSideNav";
import "./styles/taskViewStyle.css"
import API from "../utils/API";

function taskView() {
    const [location, setLocation] = useState(useLocation())
    const [currentList, setCurrentList] = useState({})

    useEffect(() => {
        if (location.pathname.length > 30) {
            let newLocation = location.pathname.replace('/taskview/', '')
            API.getList(newLocation).then((getListResponse) => {
                setCurrentList(getListResponse.data)
                console.log(getListResponse.data)
            })
        }
    }, [location])

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
                        <Collection>
                            <CollectionItem>
                                <span>hey</span>
                            </CollectionItem>
                        </Collection>
                    </Row>
                </Col>
            </Row>
        </div>
       
    )
}

export default taskView;