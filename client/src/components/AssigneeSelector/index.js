import React, { useState, useEffect } from "react";
import "./style.css"
import { Icon, Dropdown } from "react-materialize";
import API from "../../utils/API"


export default function AssigneeSelector(props) {
  const [userArray, setUserArray] = useState([])
  const [assignee, setAssignee] = useState({})
  const [taskView, setTaskView] = useState(false)

  function adjustAssignee(user) {
    let newAssignee = {
      task_assignee: user,
    }
    API.updateTask(props.id, newAssignee).then((updateTaskRes) => {
      if (user === '') {
        setAssignee({})
      }
      else {
        for (let i = 0; i < props.workspaceUsers.length; i++) {
          if (props.workspaceUsers[i].id === user) {
            setAssignee(props.workspaceUsers[i])
          }
        }
      }
      props.setValue(props.value + 1)
    })
    API.getTaskHistory(props.id).then((getTaskHistoryRes) => {
      let tempTaskHistory = getTaskHistoryRes.data[0].event
      let taskHistoryUser = ''
      if (user === '') {
        taskHistoryUser = 'unassigned'
      }
      else {
        taskHistoryUser = user
      }
      let newTaskHistory = {
        action: "task_assigned",
        user: props.currentUser,
        date: new Date(),
        to: taskHistoryUser
      }
      tempTaskHistory.push(newTaskHistory)
      API.updateTaskHistory(getTaskHistoryRes.data[0]._id, { event: tempTaskHistory }).then((updateTaskHistoryRes) => {})
    })
  }

  
  useEffect(() => {
    if (props.workspaceUsers.length > 0) {
      let userArray = []
      for (let i = 0; i < props.workspaceUsers.length; i++) {

        // if user is assignee of task
        if (props.workspaceUsers[i].id === props.assignees) {
          let userHTML = 
          <a onClick={() => adjustAssignee('')}>
            <img src={props.workspaceUsers[i].img} className="circle user_image_selected_assignee left"></img>
            <div className="dropdown_selection_text">{props.workspaceUsers[i].first_name} {props.workspaceUsers[i].last_name}</div>
          </a>
          userArray.push(userHTML)
        }

        // if user is not assignee of task
        else {
          let userHTML = 
          <a onClick={() => adjustAssignee(props.workspaceUsers[i].id)}>
            <img src={props.workspaceUsers[i].img} className="circle user_image_not_assigned left"></img>
            <div className="dropdown_selection_text">{props.workspaceUsers[i].first_name} {props.workspaceUsers[i].last_name}</div>
          </a>
          userArray.push(userHTML)
        }
      }
      setUserArray(userArray)
    }
    if(props.assignees && props.assignees.length > 0) {
      for (let i = 0; i < props.workspaceUsers.length; i++) {
        if (props.workspaceUsers[i].id === props.assignees) {
          setAssignee(props.workspaceUsers[i])
        }
      }
    }
    if (props.taskView) {
      setTaskView(true)
    }
  }, [props.workspaceUsers])

  return <td className="assigneeSelectorTd">
    {props.workspaceUsers.length > 0 ? (
    <Dropdown
                id={props.id + "AssigneeDropdown_taskView=" + taskView}
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
                trigger={assignee.id ? (
                  <img src={assignee.img} className="circle assignee_image left"></img>
                ): 
                // if no assignee
                <Icon className='left empty_assignee_icon'>add_circle_outline</Icon>}
                >
                {userArray}
            </Dropdown>
    ):null}
  </td>;
}
