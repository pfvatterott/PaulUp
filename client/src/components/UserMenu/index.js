import React, { useState, useEffect } from "react";
import { Dropdown, Icon, Modal, Collection, CollectionItem, Row, Col, TextInput, Button } from "react-materialize";
import API from "../../utils/API"
import "./style.css"

export default function UserMenu(props) {
    const [openWorkspaceSettingsModal, setOpenWorkspaceSettingsModal] = useState(false)
    const [addNewUserText, setAddNewUserText] = useState("")

    useEffect(() => {
        console.log(props.workspaceData.owner_id)
        console.log(props.workspaceData.users)
    }, [props.workspaceData.owner_id])


    function handleOpenWorkspaceSettingsModal() {
        setOpenWorkspaceSettingsModal(true)
    }

    function handleCloseWorkspaceSettingsModal() {
        setOpenWorkspaceSettingsModal(false)
    }

    function handleRemoveUser(user_id) {
        API.getUser(user_id).then(userRes => {
            let oldWorkspaceArray = userRes.data.workspaces
            for (let i = 0; i < oldWorkspaceArray.length; i++) {
                if (oldWorkspaceArray[i] === props.workspaceData._id) {
                    oldWorkspaceArray.splice(i,1)
                }
            }
            API.updateUser(user_id, { workspaces: oldWorkspaceArray})
        })
        let oldUserArray = props.workspaceData.users
        for (let j = 0; j < oldUserArray.length; j++) {
            if (oldUserArray[j].id === user_id) {
                oldUserArray.splice(j,1)
            }
        }
        API.updateWorkspace(props.workspaceData._id, { users: oldUserArray }).then(res => {
            props.handleGetWorkspaces()
            props.loadUsers()
        })
    }

    function handleAddUserInput(event) {
        const name = event.target.value;
        setAddNewUserText(name)
    }

    function handleAddNewUser() {
        if (addNewUserText.length > 0) {
            API.getUserByEmail(addNewUserText).then(newUserRes => {
                if(newUserRes.data.length === 0) {
                    alert('User not found')
                    return
                }
                else {
                    for (let i = 0; i < props.workspaceData.users.length; i++) {
                        if (props.workspaceData.users[i].id === newUserRes.data[0]._id) {
                            alert('User already in workspace')
                            return
                        }
                    }
                    let newUser = {
                        id: newUserRes.data[0]._id,
                        first_name: newUserRes.data[0].firstName,
                        last_name: newUserRes.data[0].lastName,
                        img: newUserRes.data[0].image
                    } 
                    let newUserArray = props.workspaceData.users
                    newUserArray.push(newUser)
                    console.log(newUserArray)
                    API.updateWorkspace(props.workspaceData._id, { users: newUserArray }).then(res => {
                        props.loadUsers()
                        props.handleGetWorkspaces()
                    })
                    let newWorkspaceArray = newUserRes.data[0].workspaces
                    newWorkspaceArray.push(props.workspaceData._id)
                    API.updateUser(newUserRes.data[0]._id, { workspaces: newWorkspaceArray })
                }
            })
        }
    }

    return (
        <div>
        <Dropdown
            id="user_settings_dropdown"
            className="userDropdownMenu"
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
            trigger={props.userData._id ? (
                <img src={props.userData.image} className="circle user_image_settings left"></img>
            ): 
            <Icon></Icon>}
            >
            <a className="userDropdownItem" onClick={() => handleOpenWorkspaceSettingsModal()}>
                <div>
                    <Icon className="left settings">settings</Icon>
                </div>
            Workspace Settings
            </a>
            <a className="userDropdownItem">
                <div>
                    <Icon className="left settings">person</Icon>
                </div>
            User Settings
            </a>
        </Dropdown>
        

        {/* Workspace Settings Modal */}
        <Modal
            open={openWorkspaceSettingsModal}
            className='center-align'
            actions={[]}
            options={{
                dismissible: false
            }}>
            <Row>
                <Col s={12}>
                    <h3>Workspace Settings</h3>
                </Col>
            </Row>
            <br></br>
            <Row>
                <Col s={12}>
                    <h4 className="left">Add new users</h4>
                </Col>
            </Row>
            <Row>
                <Col s={10}>
                    <TextInput id="add_user_search" placeholder="Search by email" onChange={handleAddUserInput}></TextInput>
                </Col>
                <Col s={2}>
                    <Button onClick={handleAddNewUser}>Add User</Button>
                </Col>
            </Row>
            <br></br>
            <Row>
                <Col s={12}>
                    <h4 className="left">Existing users</h4>
                </Col>
            </Row>
            <Row>
                <Col s={12}>
                    <Collection>
                        {props.workspaceData.users ? props.workspaceData.users.map(user => {
                            if (user.id === props.workspaceData.owner_id)                            
                            return <CollectionItem className="avatar workspaceSettingsUserItem">
                                <img
                                    className="circle existingUserImage"
                                    src={user.img}
                                />
                                <span className="left workspace_settings_user_name">{user.first_name} {user.last_name}</span>                               
                            </CollectionItem>
                            else if (user.id != props.workspaceData.owner_id)
                            return <CollectionItem className="avatar workspaceSettingsUserItem">
                                <img
                                    className="circle existingUserImage"
                                    src={user.img}
                                />
                                <span className="left workspace_settings_user_name">{user.first_name} {user.last_name}</span>                               
                                <Icon className="right workspace_settings_user_trash" onClick={() => handleRemoveUser(user.id)}>delete</Icon>
                            </CollectionItem>
                    }):null}
                    </Collection>
                </Col>
            </Row>
           
            <br></br>
            <Row>
                <Col s={12}>
                    <Button onClick={handleCloseWorkspaceSettingsModal}>Close</Button>
                </Col>
            </Row>
            <br></br>
            
        </Modal>
        </div>
    )
}
