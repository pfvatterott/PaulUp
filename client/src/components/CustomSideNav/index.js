import React from 'react'
import { SideNav, Button, Col, Row } from 'react-materialize'
import API from "../../utils/API"

export default function CustomSideNav() {

    function handleCreateSpace() {
        console.log('working')
        API.saveSpace({
            title: "working"
        }).then((saveSpaceResponse) => {
            console.log(saveSpaceResponse)
        })

    }

    return (
        <SideNav>
            <Row>
                <Col
                    s={12}
                >
                    <h3 className="left">ClickUp</h3>
                </Col>
            </Row>
            <Row>
                <Col
                    s={12}
                >
                    <Button
                        onClick={handleCreateSpace}
                    >New Space</Button>
                </Col>
            </Row>
        </SideNav>

    )
}
