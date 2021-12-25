import React, { useState, useEffect } from "react";
import { Dropdown, Button, Divider, Icon } from "react-materialize";
import { TwitterPicker } from 'react-color'
import API from "../../utils/API"
import "./style.css"

export default function StatusBoxChoose(props) {
    const [currentStatus, setCurrentStatus] = useState('')
    const [currentColor, setCurrentColor] = useState('')

    useEffect(() => {

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
                trigger={<div className='status_box left' key={props.id} style={{backgroundColor: 'red'}}></div>}
                >
                    <TwitterPicker onChange={(x) => handleColorChoice(x)}/>
                  
            </Dropdown>
        </div>
    )
}
