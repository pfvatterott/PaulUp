import React, { useState, useEffect } from "react";
import { Dropdown, Button, Divider, Icon } from "react-materialize";
import { CirclePicker } from 'react-color'
import API from "../../utils/API"
import "./style.css"

export default function StatusBoxChoose(props) {
    const [currentStatus, setCurrentStatus] = useState('')
    const [currentColor, setCurrentColor] = useState('')

    useEffect(() => {
        if (props.type === 'open') {
            setCurrentColor('#D3D3D3')
        }
        else if (props.type === 'in_progress') {
            setCurrentColor('#A875FF')
        }
        else if (props.type === 'done') {
            setCurrentColor('#6BC950')
        }
    }, [])

    function handleColorChoice(x) {
        console.log(x)
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
