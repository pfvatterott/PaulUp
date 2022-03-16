import React, { useState, useEffect } from "react";
import "./style.css"
import { Icon, Dropdown } from "react-materialize";
import API from "../../utils/API"


export default function AssigneeSelector(props) {
  const [userArray, setUserArray] = useState([])

  function addAssignee(user) {
    console.log(user)
    let newAssignee = {
      task_assignee: user,
    }
    API.updateTask(props.id, newAssignee)
  }
 
  
  useEffect(() => {
    if (props.workspaceUsers.length > 0) {
      let userArray = []
      for (let i = 0; i < props.workspaceUsers.length; i++) {
        let userHTML = 
          <a onClick={() => addAssignee(props.workspaceUsers[i].id)}>
            <img src={props.workspaceUsers[i].img} className="circle user_image left"></img>
            <div className="dropdown_selection_text">{props.workspaceUsers[i].first_name} {props.workspaceUsers[i].last_name}</div>
          </a>
        userArray.push(userHTML)
      }
      setUserArray(userArray)
    }
  }, [props.workspaceUsers])

  return <div>
    {props.workspaceUsers.length > 0 ? (
    <Dropdown
                id={props.id + "AssigneeDropdown"}
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
                trigger={<Icon className='left empty_assignee_icon'>add_circle_outline</Icon>}
                >
                
                {userArray}
                   
            </Dropdown>
    ):null}
  </div>;
}
