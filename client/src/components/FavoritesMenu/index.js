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
        API.getTask(x.id).then((res) => {
            let oldFavorited = res.data.favorited
            for (let i = 0; i < oldFavorited.length; i++) {
                if (oldFavorited[i] === x.id) {
                    oldFavorited.splice(i, 1);
                    break
                }
            }
            let newFavorited = {
                favorited: oldFavorited
            }
            API.updateTask(x.id, newFavorited).then((res) => {
                props.setValue(props.value + 1)
            })
        })
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
                <Collection>
                {props.userFavorites ? props.userFavorites.map(item => {
                    if (item.type === "task") {
                    return <CollectionItem>
                        <div className="left favoritesCollection valign-wrapper" onClick={() => handleOpenTaskView(item.id)}>
                            <Icon className="favoritesCheck">check</Icon>
                            {item.name}
                        </div>
                        
                        <Dropdown
                            id={item.id.concat('', 'favoritesDropdown')}
                            className="dropdownMenuFavorites"
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
