import React, { useState, useEffect } from "react";
import {Icon} from "react-materialize";
import "./style.css"

export default function ListViewTaskTitle(props) {
    const [taskNameEdit, setTaskNameEdit] = useState(false)

    function handleTaskNameEdit(id, name) { 
        console.log(name)
        setTaskNameEdit(true)
    }



    return (
        <td className="task_title_col" style={{minWidth: `${props.taskName.length * 9}px`}}>
            <span className="task_title" autoFocus onClick={(taskNameEdit === false ? (() => props.handleOpenTaskView(props.taskID)): null)} contentEditable={taskNameEdit}>{props.taskName}</span>
            <Icon className='edit_button' onClick={(e) => handleTaskNameEdit(props.taskID, props.taskName)}>edit</Icon>
        </td>
    )
}
