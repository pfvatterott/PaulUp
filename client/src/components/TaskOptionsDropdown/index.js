import React, { useState, useEffect } from "react";
import { Dropdown, Button, Divider, Icon } from "react-materialize";
import API from "../../utils/API"
import "./style.css"

export default function TaskOptionsDropdown(props) {

    function handleDeleteTask(id) {
        console.log(props.id)
    }


    return (
        <td>
            <Dropdown
                id={props.id.concat('', 'TaskOptionsDropdown')}
                className="dropdownMenuTaskoptions"
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
                trigger={<Icon className="listViewEllipses">more_horiz</Icon>}
                >
                    <a onClick={() => handleDeleteTask(props.id)}>
                        <div>
                            <Icon className="left">delete</Icon>
                        </div>
                    Delete
                    </a>
                    <a>Rename</a>
                    <a>Add to Favorites</a>
                   
            </Dropdown>
        </td>
    )
}
