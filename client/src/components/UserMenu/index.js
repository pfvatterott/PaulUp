import React, { useState, useEffect } from "react";
import { Dropdown, Icon, Modal, Collection, CollectionItem } from "react-materialize";
import API from "../../utils/API"
import "./style.css"

export default function UserMenu(props) {
    const [openWorkspaceSettingsModal, setOpenWorkspaceSettingsModal] = useState(false)
    const [workspaceUsers, setWorkspaceUsers] = ([])

    useEffect(() => {
        setWorkspaceUsers(props.workspaceData.users)
    }, [props.workspaceData.users])

    function handleOpenWorkspaceSettingsModal() {
        setOpenWorkspaceSettingsModal(true)
        console.log(props.workspaceData)
    }

    return (
        <div>
        <Dropdown
            id="UserDropdown"
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
                <img src={props.userData.image} className="circle user_image left"></img>
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
            <h3>Workspace Settings</h3>
            <br></br>
            <h4 className="left">Users</h4>
            <Collection>
                {workspaceUsers.map(user => {
                    <CollectionItem>
                        <span>{user.first_name}</span>
                    </CollectionItem>
                })}

            </Collection>
            <br></br>
            <br></br><br></br>
            
        </Modal>
        </div>
    )
}
