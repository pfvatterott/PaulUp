import React, { useState, useEffect } from "react";
import { Icon, Dropdown} from "react-materialize";
import API from "../../utils/API"
import "./style.css"

export default function TreeEllipsesMenu(props) {

    useEffect(() => {
      
    }, [])

    function deleteHierarchy() {

        // If deleting a space, delete all folders and tasks in that space. Also delete all favorites that lived in that space.
        console.log(props.data.class)
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
                        <Icon className="left">delete</Icon>
                    </div>
                    Delete
                </a>
        </Dropdown>
    )
}
