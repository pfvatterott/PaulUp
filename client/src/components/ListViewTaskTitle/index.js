import React, { useState, useEffect } from "react";
import {Icon} from "react-materialize";
import API from "../../utils/API"
import "./style.css"

export default function ListViewTaskTitle(props) {
    const [taskNameEdit, setTaskNameEdit] = useState(false)
    const [newTaskName, setNewTaskName] = useState('')
    let editing = false
    let currentName

    function handleMouseDownEvent(e) {
        e.preventDefault()
        if (editing === true && !document.getElementById(props.taskID + 'title').contains(e.target)) {
            setTaskNameEdit(false)
            editing = false
            document.getElementById(props.taskID + 'title').textContent = currentName
        }
        else if (editing === false && !document.getElementById(props.taskID + 'title').contains(e.target)){
            setTaskNameEdit(false)
            editing = false
            document.getElementById(props.taskID + 'title').textContent = currentName
        }
    }

    useEffect(() => {
        // focuses on task name element
        // adjusts cursor to be at end of task name
        if (taskNameEdit === true) {
            var el = document.getElementById(props.taskID + 'title');
            var range = document.createRange();
            var sel = window.getSelection();
            if (el.textContent.length > 0) {
                range.setStart(el.childNodes[0], el.textContent.length);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                el.focus();
            }
            else {
                el.focus()
            }
        }
        API.getTask(props.taskID).then((getTaskRes) => {
            currentName = getTaskRes.data.task_name
            document.addEventListener('mousedown', handleMouseDownEvent)
            console.log(currentName)
        })
    }, [taskNameEdit])

    function handleTaskNameEdit() { 
        setTaskNameEdit(true)
        editing = true
    }

    function handleTaskNameChange(event) {
        const name = event.target.textContent;
        setNewTaskName(name)
    }

    function handleSaveTaskName(event) {
        if (event.key === 'Enter') {  
            setTaskNameEdit(false)
            editing = false
            currentName = newTaskName
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
