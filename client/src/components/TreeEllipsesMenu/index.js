import React, { useState, useEffect } from "react";
import { Icon, Dropdown} from "react-materialize";
import { useLocation } from "react-router-dom";
import API from "../../utils/API"
import "./style.css"

export default function TreeEllipsesMenu(props) {
    const [location, setLocation] = useState(useLocation())
    let userIdVariable = location.state

    function deleteHierarchy() {
        // If deleting a space, delete all folders and tasks in that space. Also delete all favorites that lived in that space.
        console.log(props.data.class)
        API.getUser(userIdVariable).then((userRes) => {
            let userFavorites = userRes.data.favorites
            if (props.data.class === "space_item") {
                API.getSpaceLists(props.data.id).then((getSpaceListsRes) => {
                    for (let i = 0; i < getSpaceListsRes.data.length; i++) {
                        API.getListTasks(getSpaceListsRes.data[i]._id).then((getListTasksRes) => {
                            for (let p = 0; p < getListTasksRes.data.length; p++) {
                                for (let j = 0; j < userFavorites.length; j++) {
                                    if (userFavorites[j].id === getListTasksRes.data[p]._id) {
                                        userFavorites.splice(j, 1)
                                        let newFavorites = {
                                            favorites: userFavorites
                                        }
                                        API.updateUser(userIdVariable, newFavorites).then((res) => {props.setUserFavorites(userFavorites)})
                                    }
                                }
                                API.deleteTask(getListTasksRes.data[p]._id).then((deleteTaskRes) => {
                                })                      
                            }
                        })
                    }
                    for (let s = 0; s < getSpaceListsRes.data.length; s++) {
                        API.deleteList(getSpaceListsRes.data[s]._id).then((deleteListRes) => {
                            
                        })
                    }
                })
                API.getSpaceFolders(props.data.id).then((getSpaceFoldersRes) => {
                    for (let i = 0; i < getSpaceFoldersRes.data.length; i++) {
                        API.getFolderLists(getSpaceFoldersRes.data[i]._id).then((getFolderListsRes) => {
                            for (let p = 0; p < getFolderListsRes.data.length; p++) {
                                API.getListTasks(getFolderListsRes.data[p]._id).then((getListTasksRes) => {
                                    for (let p = 0; p < getListTasksRes.data.length; p++) {
                                        for (let j = 0; j < userFavorites.length; j++) {
                                            if (userFavorites[j].id === getListTasksRes.data[p]._id) {
                                                userFavorites.splice(j, 1)
                                                let newFavorites = {
                                                    favorites: userFavorites
                                                }
                                                API.updateUser(userIdVariable, newFavorites).then((res) => {props.setUserFavorites(userFavorites)})
                                            }
                                        }
                                        API.deleteTask(getListTasksRes.data[p]._id).then((deleteTaskRes) => {
                                        })                      
                                    }
                                })
                                API.deleteList(getFolderListsRes.data[p]._id).then((deleteListRes) => {
                                })                      
                            }
                        })
                        API.deleteFolder(getSpaceFoldersRes.data[i]._id).then((deleteFolderRes) => {
                        })
                    }
                })
                API.deleteSpace(props.data.id).then((deleteSpaceRes) => {
                    props.setSideNavValue(props.sideNavValue + 1)
                })
            }
        })
    }

    return (
        <Dropdown
            id={props.data.id.concat('', 'TreeOptionsDropdown')}
            className="treeOptionsDropdown"
            options={{
                alignment: 'left',
                autoTrigger: true,
                closeOnClick: true,
                constrainWidth: false,
                container: null,
                coverTrigger: true,
                hover: false,
                inDuration: 150,
                onCloseEnd: null,
                onCloseStart: null,
                onOpenEnd: null,
                onOpenStart: null,
                outDuration: 250
            }}
            trigger={<Icon className="treeOptionsEllipses right">more_horiz</Icon>}
            >
                <a onClick={() => deleteHierarchy()}>
                    <div>
                        <Icon className="treeOptionsIcon left">delete</Icon>
                    </div>
                    Delete
           
                </a>
                <a>
                    <div>
                        <Icon className="treeOptionsIcon left">add</Icon>
                    </div>
                    Favorite
                </a>
        </Dropdown>
    )
}
