import React, { useState, useEffect } from "react";
import { Icon} from "react-materialize";
import { useLocation, Redirect } from "react-router-dom";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import API from "../../utils/API"
import "./style.css"

export default function TreeEllipsesMenu(props) {
    const [location, setLocation] = useState(useLocation())
    let userIdVariable = location.state
    let currentURL = window.location.href
    let currentList = currentURL.substring(currentURL.lastIndexOf("/") + 1);
    const [redirect, setRedirect] = useState(false)

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

    function addToFavorites() {
        console.log('working')
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

    const options = [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two', className: 'myOptionClassName' },
        {
         type: 'group', name: 'group1', items: [
           { value: 'three', label: 'Three', className: 'myOptionClassName' },
           { value: 'four', label: 'Four' }
         ]
        },
        {
         type: 'group', name: 'group2', items: [
           { value: 'five', label: 'Five' },
           { value: 'six', label: 'Six' }
         ]
        }
      ];
    const defaultOption = options[0];

    function testFunction(e) {
        console.log('working')
        console.log(e)
    }
    

    return (
        <div>
            { redirect ? (<Redirect push to={{pathname: '/workspace', state: userIdVariable}}/>) : null }
        {/* <Dropdown
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
                <a onClick={() => addToFavorites()}>
                    <div>
                        <Icon className="treeOptionsIcon left">add</Icon>
                    </div> {/* <Dropdown
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
                <a onClick={() => addToFavorites()}>
                    <div>
                        <Icon className="treeOptionsIcon left">add</Icon>
                    </div>
                    Favorite
                </a>
                <a onClick={() => addToFavorites()}>
                    <div>
                        <Icon className="treeOptionsIcon left">add</Icon>
                    </div>
                    Favorite
                </a>
        </Dropdown>
                    Favorite
                </a>
                <a onClick={() => addToFavorites()}>
                    <div>
                        <Icon className="treeOptionsIcon left">add</Icon>
                    </div>
                    Favorite
                </a>
        </Dropdown> */}
       <Dropdown 
            options={options} 
            placeholder={<Icon className="treeOptionsIcon left">add</Icon>} 
            arrowClosed={<span/>}
            arrowOpen={<span/>}
            onChange={(e) => testFunction(e)}
        />;
        </div>
    )
}
