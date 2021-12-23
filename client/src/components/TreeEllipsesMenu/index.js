import React, { useState, useEffect } from "react";
import { Icon, Dropdown} from "react-materialize";
import { useLocation, Redirect } from "react-router-dom";
import API from "../../utils/API"
import "./style.css"

export default function TreeEllipsesMenu(props) {
    const [location, setLocation] = useState(useLocation())
    let userIdVariable = location.state
    let currentURL = window.location.href
    let currentList = currentURL.substring(currentURL.lastIndexOf("/") + 1);
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        console.log(props)
    }, [])

    function deleteHierarchy() {
        // If deleting a space, delete all folders and tasks in that space. Also delete all favorites that lived in that space.
        API.getUser(userIdVariable).then((userRes) => {
            let userFavorites = userRes.data.favorites

            if (props.data.class === "space_item") {
                API.getSpaceLists(props.data.id).then((getSpaceListsRes) => {
                    for (let i = 0; i < getSpaceListsRes.data.length; i++) {
                        // If URL is set to a List that lives in the deleted Space, redirect to Workspace
                        if (getSpaceListsRes.data[i]._id === currentList) {
                            setRedirect(true)
                        }
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
                                                API.updateUser(userIdVariable, newFavorites).then((res) => {
                                                    props.setUserFavorites(userFavorites)
                                                })
                                            }
                                        }
                                        API.deleteTask(getListTasksRes.data[p]._id).then((deleteTaskRes) => {
                                        })   
                                        if (getFolderListsRes.data[p]._id === currentList) {
                                            console.log('working?')
                                            setRedirect(true)
                                        }                   
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

    function handleAddToFavorites() {
        API.getUser(userIdVariable).then((userRes) => {
            let userFavorites = userRes.data.favorites
            userFavorites.push({
                id: props.data.id,
                name: props.data.name,
                type: props.data.class
            })
            let newFavorites = {
                favorites: userFavorites
            }
            API.updateUser(userIdVariable, newFavorites).then((res) => {
                props.setUserFavorites(userFavorites)
            })
            // Finds which type of item it is so correct API call is made
            if (props.data.class === "space_item") {
                API.getSpace(props.data.id).then((getSpaceRes) => {
                    let oldFavorites = getSpaceRes.data.favorited
                    oldFavorites.push(userIdVariable)
                    let newFavorites = {
                        favorited: oldFavorites
                    }
                    API.updateSpace(getSpaceRes.data._id, newFavorites).then((res) => {
                    })
                })
            }
        })
    }

    function handleRemoveFromFavorites() {
        API.getUser(userIdVariable).then((userRes) => {
            let userFavorites = userRes.data.favorites
            for(var i = 0; i < userFavorites.length; i++) {
                if(userFavorites[i].id == props.data.id) {
                    userFavorites.splice(i, 1);
                    break
                }
            }
            let newFavorites = {
                favorites: userFavorites
            }
            API.updateUser(userIdVariable, newFavorites).then((res) => {
                props.setUserFavorites(userFavorites)
            })
            // Finds which type of item it is so correct API call is made
            if (props.data.class === "space_item") {
                API.getSpace(props.data.id).then((getSpaceRes) => {
                    let oldFavorited = getSpaceRes.data.favorited
                    for (let i = 0; i < oldFavorited.length; i++) {
                        if (oldFavorited[i] === userIdVariable) {
                            oldFavorited.splice(i, 1);
                            break
                        }
                    }
                    let newFavorited = {
                        favorited: oldFavorited
                    }
                    API.updateSpace(props.data.id, newFavorited).then((updateSpaceRes) => {
                        
                    })
                })
            }

        })
    }


    return (
        <div>
            { redirect ? (<Redirect push to={{pathname: '/workspace', state: userIdVariable}}/>) : null }
        <Dropdown
            id={props.data.id.concat('', 'TreeOptionsDropdown')}
            className="treeOptionsDropdown"
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
            trigger={<Icon className="treeOptionsEllipses right">more_horiz</Icon>}
            >
                <a onClick={() => deleteHierarchy()}>
                    <div>
                        <Icon className="treeOptionsIcon left">delete</Icon>
                    </div>
                    Delete
           
                </a>
                {/* If favorited, display remove favorites */}
                {props.data.favorited && props.data.favorited.includes(userIdVariable) ? (
                <a onClick={() => handleRemoveFromFavorites()}>
                    <div>
                        <Icon className="treeOptionsIcon left">do_not_disturb</Icon>
                    </div>
                    Remove Favorite
                </a>
                ) :
                <a onClick={() => handleAddToFavorites()}>
                    <div>
                        <Icon className="treeOptionsIcon left">add</Icon>
                    </div>
                    Favorite
                </a>
                }
               
        </Dropdown>
        </div>
    )
}
