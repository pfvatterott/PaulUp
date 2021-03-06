import React, { useState, useEffect } from "react";
import { Dropdown, Collapsible, CollapsibleItem, Collection, CollectionItem, Icon } from 'react-materialize'
import { useLocation } from "react-router-dom";
import TaskView from "../TaskView/index"
import API from "../../utils/API"
import "./style.css"

export default function FavoritesMenu(props) {
    const [location, setLocation] = useState(useLocation())
    const [openTaskView, setOpenTaskView] = useState(false)
    const [taskViewTask, setTaskViewTask] = useState('')
    const [value, setValue] = useState(0)
    let userIdVariable = location.state

    useEffect(() => {
    }, [props.userFavorites, value])

    function handleOpenTaskView(task_id) {
        setTaskViewTask(task_id)
        setOpenTaskView(true)
    }

    function handleTaskViewClose() {
        setOpenTaskView(false)
    }

    function removeFavorite(x) {
        let data = props.userFavorites
        for(var i = 0; i < data.length; i++) {
            if(data[i].id == x.id) {
                data.splice(i, 1);
                break
            }
        }
        API.updateUser(userIdVariable, {favorites: data}).then((res) => {
            props.setUserFavorites(data)
            setValue(value + 1)
        })
        if (x.type === 'task') {
            API.getTask(x.id).then((res) => {
                let oldFavorited = res.data.favorited
                for (let i = 0; i < oldFavorited.length; i++) {
                    if (oldFavorited[i] === userIdVariable) {
                        oldFavorited.splice(i, 1);
                        break
                    }
                }
                let newFavorited = {
                    favorited: oldFavorited
                }
                API.updateTask(x.id, newFavorited).then((res) => {
                    props.setValue(props.value + 1)
                    props.setSideNavValue(props.sideNavValue + 1)
                })
            })
        }
        else if (x.type === 'space_item') {
            API.getSpace(x.id).then((res) => {
                let oldFavorited = res.data.favorited
                for (let i = 0; i < oldFavorited.length; i++) {
                    if (oldFavorited[i] === userIdVariable) {
                        oldFavorited.splice(i, 1);
                        break
                    }
                }
                let newFavorited = {
                    favorited: oldFavorited
                }
                API.updateSpace(x.id, newFavorited).then((res) => {
                    props.setValue(props.value + 1)
                    props.setSideNavValue(props.sideNavValue + 1)
                })
            })
        }
        else if (x.type === 'folder_item') {
            API.getFolder(x.id).then((res) => {
                let oldFavorited = res.data.favorited
                for (let i = 0; i < oldFavorited.length; i++) {
                    if (oldFavorited[i] === userIdVariable) {
                        oldFavorited.splice(i, 1);
                        break
                    }
                }
                let newFavorited = {
                    favorited: oldFavorited
                }
                API.updateFolder(x.id, newFavorited).then((res) => {
                    props.setValue(props.value + 1)
                    props.setSideNavValue(props.sideNavValue + 1)
                })
            })
        }
        else if (x.type === 'list_item' || 'folder_list_item') {
            API.getList(x.id).then((res) => {
                let oldFavorited = res.data.favorited
                for (let i = 0; i < oldFavorited.length; i++) {
                    if (oldFavorited[i] === userIdVariable) {
                        oldFavorited.splice(i, 1);
                        break
                    }
                }
                let newFavorited = {
                    favorited: oldFavorited
                }
                API.updateList(x.id, newFavorited).then((res) => {
                    props.setValue(props.value + 1)
                    props.setSideNavValue(props.sideNavValue + 1)
                })
            })
        }
    }

    function handleOpenListView(x) {
        props.handleOpenList(x.id)
    }

    return (
        <div>
            <Collapsible accordion>
            <CollapsibleItem
                expanded={false}
                header="Favorites"
                icon={<Icon>favorite_border</Icon>}
                node="div"
            >
                <Collection className="favoritesCollection">
                {props.userFavorites ? props.userFavorites.map(item => {
                    if (item.type === "task") {
                    return <CollectionItem>
                        <div className="left favoritesCollectionItem valign-wrapper" onClick={() => handleOpenTaskView(item.id)}>
                            <Icon className="favoritesCheck">check</Icon>
                            {item.name}
                        </div>
                        
                        <Dropdown
                            id={item.id.concat('', 'favoritesDropdown')}
                            className="dropdownMenuFavorites"
                            options={{
                                alignment: 'right',
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
                            trigger={<Icon className="favoritesEllipses right">more_horiz</Icon>}
                            >
                                <a onClick={() => removeFavorite(item)}>
                                    <div>
                                        <Icon className="left unfavorite_icon">do_not_disturb</Icon>
                                    </div>
                                Unfavorite
                                </a>        
                        </Dropdown>
                    </CollectionItem>
                    }
                    else if (item.type === "space_item") {
                        return <CollectionItem>
                        <div className="left favoritesCollectionItem valign-wrapper">
                            <Icon className="favoritesCheck">fiber_manual_record</Icon>
                            {item.name}
                        </div>
                        
                        <Dropdown
                            id={item.id.concat('', 'favoritesDropdown')}
                            className="dropdownMenuFavorites"
                            options={{
                                alignment: 'right',
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
                            trigger={<Icon className="favoritesEllipses right">more_horiz</Icon>}
                            >
                                <a onClick={() => removeFavorite(item)}>
                                    <div>
                                        <Icon className="left unfavorite_icon">do_not_disturb</Icon>
                                    </div>
                                Unfavorite
                                </a>        
                        </Dropdown>
                    </CollectionItem>
                    }
                    else if (item.type === "folder_item") {
                        return <CollectionItem>
                        <div className="left favoritesCollectionItem valign-wrapper">
                            <Icon className="favoritesCheck">folder</Icon>
                            {item.name}
                        </div>
                        
                        <Dropdown
                            id={item.id.concat('', 'favoritesDropdown')}
                            className="dropdownMenuFavorites"
                            options={{
                                alignment: 'right',
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
                            trigger={<Icon className="favoritesEllipses right">more_horiz</Icon>}
                            >
                                <a onClick={() => removeFavorite(item)}>
                                    <div>
                                        <Icon className="left unfavorite_icon">do_not_disturb</Icon>
                                    </div>
                                Unfavorite
                                </a>        
                        </Dropdown>
                    </CollectionItem>
                    }
                    else if (item.type === "folder_list_item" || "list_item") {
                        return <CollectionItem>
                        <div className="left favoritesCollectionItem valign-wrapper" onClick={() => handleOpenListView(item)}>
                            <Icon className="favoritesCheck">format_list_bulleted</Icon>
                            {item.name}
                        </div>
                        
                        <Dropdown
                            id={item.id.concat('', 'favoritesDropdown')}
                            className="dropdownMenuFavorites"
                            options={{
                                alignment: 'right',
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
                            trigger={<Icon className="favoritesEllipses right">more_horiz</Icon>}
                            >
                                <a onClick={() => removeFavorite(item)}>
                                    <div>
                                        <Icon className="left unfavorite_icon">do_not_disturb</Icon>
                                    </div>
                                Unfavorite
                                </a>        
                        </Dropdown>
                    </CollectionItem>
                    }
                }) : null}
                </Collection>
            </CollapsibleItem>
            </Collapsible>
            <TaskView open={openTaskView} task={taskViewTask} close={() => handleTaskViewClose()}/>
        </div>
    )
}
