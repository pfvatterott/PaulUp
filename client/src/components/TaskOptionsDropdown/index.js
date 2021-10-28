import React, { useState, useEffect } from "react";
import { Dropdown, Button, Divider, Icon, Modal, TextInput } from "react-materialize";
import API from "../../utils/API"
import "./style.css"

export default function TaskOptionsDropdown(props) {
    const [openEditTaskModal, setOpenEditTaskModal] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");

    useEffect(() => {
        if (openEditTaskModal) {
            document.addEventListener('mousedown', handleMouseDownEvent)
            document.getElementById(props.id + "rename_task_form").focus()
        }
    }, [openEditTaskModal])

    function handleMouseDownEvent(e) {
        if (openEditTaskModal && !document.getElementById(props.id + 'editTaskModal').contains(e.target)) {
            document.removeEventListener('mousedown', handleMouseDownEvent)
            setOpenEditTaskModal(false);
            setNewTaskName("");
        }
    }

    function handleDeleteTask(id) {
        API.getList(props.list).then((getListResponse) => {
            let newTasksArray = getListResponse.data.tasks
            let otherTasksArray = []
            for (let i = 0; i < newTasksArray.length; i++) {
                if (newTasksArray[i] === props.id) {
                    newTasksArray.splice(i, 1)
                }
                else {
                    otherTasksArray.push(newTasksArray[i])
                }
            }
            let updatedList = {
                tasks: newTasksArray
            }
            console.log(otherTasksArray)
            for (let p = 0; p < otherTasksArray.length; p++) {
                API.getTask(otherTasksArray[p]).then((getTaskRes) => {
                    let newOrderIndex
                    if (getTaskRes.data.order_index > props.orderIndex) {
                        newOrderIndex = (getTaskRes.data.order_index - 1)
                        let newTaskData = {
                            order_index: newOrderIndex
                        }
                        API.updateTask(otherTasksArray[p], newTaskData).then((res1) => {
                        })
                    }
                })
                
            }
            API.updateList(props.list, updatedList).then((res) => {
            })
            API.deleteTask(props.id).then((deleteRes) => {
                props.handleGetListTasks(deleteRes.data.list_id);
            })
        })
    }

    function handleOpenEditTaskModal() {
        setOpenEditTaskModal(true);
    }

    function handleTaskNameChange(event) {
        const name = event.target.value;
        setNewTaskName(name);
    }

    function handleSaveTaskName(event) {
        if (event.key === 'Enter') {  
            setNewTaskName(false)
            let taskName = {
                task_name: newTaskName
            }
            props.updateTask(props.id, taskName)
            document.removeEventListener('mousedown', handleMouseDownEvent)
            setOpenEditTaskModal(false);
        }
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
                    <a onClick={() => handleOpenEditTaskModal()}>
                        <div>
                            <Icon className="left">edit</Icon>
                        </div>
                    Rename</a>
                    <a>
                        <div>
                            <Icon className="left">add</Icon>
                        </div> 
                    Add to Favorites</a>
                   
            </Dropdown>

            <Modal
                open={openEditTaskModal}
                id={props.id + 'editTaskModal'}
                className='center-align'
                actions={[]}
                options={{
                dismissible: true
                }}>
                <h3>Rename your list:</h3>
                <br></br>
                <TextInput
                onChange={handleTaskNameChange}
                id={props.id + "rename_task_form"}
                defaultValue={props.taskName}
                onKeyDown={handleSaveTaskName}
                ></TextInput>
            </Modal>
        </td>
    )
}
