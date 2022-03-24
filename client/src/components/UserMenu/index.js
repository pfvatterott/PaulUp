import React, { useState, useEffect } from "react";
import { Dropdown, Button, Divider, Icon } from "react-materialize";
import { CirclePicker } from 'react-color'
import API from "../../utils/API"
import "./style.css"

export default function UserMenu(props) {

    useEffect(() => {

        console.log(props.userData)
    }, [props.userData])

    return (
        <Dropdown
            id={"UserDropdown"}
            className="userDropdownMenu"
            options={{
                alignment: 'left',
                autoTrigger: true,
                closeOnClick: true,
                constrainWidth: false,
                container: null,
                coverTrigger: false,
                hover: false,
                inDuration: 150,
                onCloseEnd: null,
                onCloseStart: null,
                onOpenEnd: null,
                onOpenStart: null,
                outDuration: 250
            }}
            trigger={props.userData._id ? (
                <img src={props.userData.image} className="circle user_image left"></img>
            ): 
            <Icon className='left empty_assignee_icon'>add_circle_outline</Icon>}
            >
            <a>
                <div>
                    <Icon className="left">delete</Icon>
                </div>
            Delete
            </a>
        </Dropdown>
    )
}
