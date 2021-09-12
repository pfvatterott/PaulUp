import React, { useState, useEffect } from "react";
import "./style.css"

export default function StatusBox(props) {

    useEffect(() => {
        console.log(props)
    }, [])
    return (
        <div>
            <div className='status_box left' ></div>
        </div>
    )
}
