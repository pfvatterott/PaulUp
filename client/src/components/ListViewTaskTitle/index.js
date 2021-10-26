import React, { useState, useEffect } from "react";
import {Icon} from "react-materialize";
import API from "../../utils/API"
import "./style.css"

export default function ListViewTaskTitle(props) {
    const [taskNameEdit, setTaskNameEdit] = useState(false)
    const [newTaskName, setNewTaskName] = useState('')

    useEffect(() => {
        if (taskNameEdit === true) {
            var el = document.getElementById(props.taskID + 'title');
            var range = document.createRange();
            var sel = window.getSelection();
            range.setStart(el.childNodes[0], el.textContent.length);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            el.focus();
        }
    }, [taskNameEdit])

    function handleTaskNameEdit(id, name) { 
        setTaskNameEdit(true)
    }

    function handleTaskNameChange(event) {
        const name = event.target.textContent;
        setNewTaskName(name)
    }

    function handleSaveTaskName(event) {
        if (event.key === 'Enter') {
            console.log(newTaskName)
            setTaskNameEdit(false)
            let taskName = {
                task_name: newTaskName
            }
            API.updateTask(props.taskID, taskName)
        }
    }

    return (
        <td className="task_title_col" style={{minWidth: `${props.taskName.length * 9}px`}}>
            <span className="task_title" id={props.taskID + 'title'} onClick={(taskNameEdit === false ? (() => props.handleOpenTaskView(props.taskID)): null)} contentEditable={taskNameEdit} onInput={handleTaskNameChange} onKeyDown={handleSaveTaskName}>{props.taskName}</span>
            <Icon className='edit_button' onClick={(e) => handleTaskNameEdit(props.taskID, props.taskName)}>edit</Icon>
        </td>
    )
}
