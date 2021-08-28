import React from 'react'
import { SideNav, Button, Col, Row } from 'react-materialize'

export default function CustomSideNav() {
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
                    <Button>New Space</Button>
                </Col>
            </Row>
        </SideNav>

    )
}
