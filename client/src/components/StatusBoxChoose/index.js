import React, { useState, useEffect } from "react";
import { Dropdown, Button, Divider, Icon } from "react-materialize";
import { CirclePicker } from 'react-color'
import API from "../../utils/API"
import "./style.css"

export default function StatusBoxChoose(props) {
    const [currentColor, setCurrentColor] = useState(props.info.color)

    function handleColorChoice(x) {
        for (let i = 0; i < props.statusSet.length; i++) {
            if (props.statusSet[i].index === props.info.index) {
                setCurrentColor(x.hex)
                let newStatusColor = props.info
                newStatusColor.color = x.hex
                let newStatusSet = props.statusSet
                newStatusSet[props.info.index] = newStatusColor
                props.setStatusColor(newStatusSet)
            }
        }
    }


    return (
        <div>
            <Dropdown
                id={props.id}
                className="dropdownMenu"
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
                trigger={<div className='status_box left' key={props.id} style={{backgroundColor: currentColor}}></div>}
                >
                    <CirclePicker className="circleColorPicker" onChange={(x) => handleColorChoice(x)}/>
                  
            </Dropdown>
        </div>
    )
}
