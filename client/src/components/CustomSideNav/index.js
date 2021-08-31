import React, { useState, useEffect } from "react";
import { SideNav, Button, Col, Row, Modal, TextInput } from 'react-materialize'
import { useLocation } from "react-router-dom";
import API from "../../utils/API"
import TreeMenu from 'react-simple-tree-menu';
import '../../../node_modules/react-simple-tree-menu/dist/main.css';

export default function CustomSideNav() {
  const [userWorkspaceData, setUserWorkspaceData] = useState([])
  const [openCreateSpaceModal, setOpenCreateSpaceModal] = useState(false)
  const [userData, setUserData] = useState([])
  const [treeData, setTreeData] = useState({})
  const location = useLocation()
  const userID = location.state


  useEffect(() => {
    handleGetSpaces()
    handleGetUser()
  }, [])


  function handleGetSpaces() {
    API.getUserSpaces(userID).then((getUserSpacesResponse) => {
      console.log(getUserSpacesResponse.data)
      setUserWorkspaceData(getUserSpacesResponse)
      if (getUserSpacesResponse.data.length !== 0) {
        handleTreeRefresh(getUserSpacesResponse)
      }
    })
  }

  function handleGetUser() {
    API.getUser(userID).then((getUserResponse) => {
      setUserData(getUserResponse.data[0])
    })
  }

  function handleTreeRefresh(data) {
    console.log(data)
    let newTreeData = {}
    // for (let i = 0; i < data.data.length; i++) {
    //   const element = array[i];

    // }
    setTreeData([
      {
        key: data.data[0].spaces.space_id,
        label: data.data[0].spaces.space_name,
        nodes: [
          {
            key: data.data[0].spaces.lists.list_id,
            label: data.data[0].spaces.lists.list_name,
            nodes: [
              {
                key: 'third-level-node-1',
                label: 'Last node of the branch',
                nodes: [] // you can remove the nodes property or leave it as an empty array
              },
            ],
          },
        ],
      },
      {
        key: 'first-level-node-2',
        label: 'Node 2 at the first level',
      },
    ])
  }

  function resetCreateSpaceModal() {
    setOpenCreateSpaceModal(false)
  }

  function handleOpenCreateSpaceModal() {
    setOpenCreateSpaceModal(true)

  }


  function handleCreateSpace() {
    if (userWorkspaceData.data.length === 0) {
      let spaceData = {
        workspace_name: 'WorkSpace Name!',
        workspace_owner: userData.firstName + " " + userData.lastName,
        workspace_ownerId: userID,
        spaces: {
          space_name: 'testing',
          space_id: '123',
          lists: {
            list_name: 'List',
            list_id: '123',
          }
        }
      }
      API.saveSpace(spaceData).then((saveSpaceResponse) => {
        console.log(saveSpaceResponse.data._id)
        let oldUserData = userData
        console.log(oldUserData)
        if (oldUserData.workspaces.length === 0) {
          oldUserData.workspaces = [saveSpaceResponse.data._id]
          console.log(oldUserData)
          API.updateUser(userID, oldUserData).then((updateUserResponse) => {
            console.log(updateUserResponse)
            handleGetSpaces()
          })
        }
      })
    }
    else {
      let updatedSpacesData = {
        workspace_name: 'WorkSpace Name!',
        workspace_owner: userData.firstName + " " + userData.lastName,
        workspace_ownerId: userID,
        spaces: {
          space_name: 'space name!',
          space_id: '1234'
        }
      }
      API.updateUserSpaces(userWorkspaceData.data[0]._id, updatedSpacesData)

    }


  }


  return (
    <div>
      <SideNav>
        <Row>
          <Col s={12}>
            <h3 className="left">PaulUp</h3>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <Button
              onClick={handleOpenCreateSpaceModal}
            >New Space</Button>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <TreeMenu data={treeData} />
          </Col>
        </Row>
      </SideNav>
      <Modal
        open={openCreateSpaceModal}
        className='center-align'
        actions={[]}
        options={{
          dismissible: false
        }}>
        <h3>Name your Space:</h3>
        <br></br>
        <TextInput
          id="space_name"
          placeholder="Space Name"
        />
        <br></br>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={handleCreateSpace}>Create Space</Button></a>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={resetCreateSpaceModal}>Cancel</Button></a>
      </Modal>
    </div>

  )
}
