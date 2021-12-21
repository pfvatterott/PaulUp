import React, { useState, useEffect } from "react";
import { SideNav, Button, Divider, Collapsible, CollapsibleItem, Collection, CollectionItem, Icon } from 'react-materialize'
import { useLocation } from "react-router-dom";
import TaskView from "../TaskView/index"
import API from "../../utils/API"
import "./style.css"

export default function FavoritesMenu(props) {
    const [location, setLocation] = useState(useLocation())
    const [openTaskView, setOpenTaskView] = useState(false)
    const [taskViewTask, setTaskViewTask] = useState('')
    let userIdVariable = location.state

    useEffect(() => {
    }, [props.userFavorites])

    function handleOpenTaskView(task_id) {
        setTaskViewTask(task_id)
        setOpenTaskView(true)
    }

    function handleTaskViewClose() {
        setOpenTaskView(false)
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
                    return <CollectionItem className="favoritesCollection" onClick={() => handleOpenTaskView(item.id)}>
                        <Icon>check</Icon> {item.name}
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
