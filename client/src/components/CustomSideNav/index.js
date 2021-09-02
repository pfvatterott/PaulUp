import React, { useState, useEffect } from "react";
import { SideNav, Button, Col, Row, Modal, TextInput } from 'react-materialize'
import { useLocation } from "react-router-dom";
import API from "../../utils/API"
import TreeMenu from 'react-simple-tree-menu';
import '../../../node_modules/react-simple-tree-menu/dist/main.css';

export default function CustomSideNav() {
  const [workspaceData, setWorkspaceData] = useState([])
  const [openCreateSpaceModal, setOpenCreateSpaceModal] = useState(false)
  const [openCreateWorkspaceModal, setOpenCreateWorkspaceModal] = useState(false)
  const [openCreateNewFolderOrListModal, setOpenCreateNewFolderOrListModal] = useState(false)
  const [openCreateListModal, setOpenCreateListModal] = useState(false)
  const [currentSpace, setCurrentSpace] = useState('')
  const [userData, setUserData] = useState([])
  const [treeData, setTreeData] = useState({})
  const [ workspaceName, setWorkspaceName ] = useState('')
  const [ newSpaceName, setNewSpaceName ] = useState('')
  const [ listName, setListName ] = useState('')
  const location = useLocation()
  const userID = location.state


  useEffect(() => {
    handleGetWorkspaces()
    handleGetUser()
  }, [])

  function handleWorkspaceNameChange(event) {
    const name = event.target.value;
    setWorkspaceName(name)
  }

  function handleListNameChange(event) {
    const name = event.target.value;
    setListName(name)

  }

  function handleSpaceNameChange(event) {
    const name = event.target.value;
    setNewSpaceName(name)
  }

  function handleCreateWorkspace() {
    setOpenCreateWorkspaceModal(false)
    const newWorkspace = {
      workspace_name: workspaceName,
      owner_id: userID
    }
    API.saveWorkspace(newWorkspace).then((createWorkspaceResponse) => {
      setWorkspaceData(createWorkspaceResponse.data)
      handleGetUser()
    })
  }

  function handleGetWorkspaces() {
    console.log('its this')
    API.getUserWorkspaces(userID).then((getUserWorkspacesResponse) => {
      if (getUserWorkspacesResponse.data.length === 0) {
        setOpenCreateWorkspaceModal(true)
      }
      else if (getUserWorkspacesResponse.data.length === 1) {
        setWorkspaceData(getUserWorkspacesResponse.data[0])
        handleTreeRefresh(getUserWorkspacesResponse.data[0]._id)
      }
      else {
        console.log('need to set up a way to switch workspaces')
      }
    })
  }

  function handleGetUser() {
    API.getUser(userID).then((getUserResponse) => {
      setUserData(getUserResponse.data[0])
    })
  }

  function handleTreeRefresh(workspace_id) {
    API.getWorkspaceSpaces(workspace_id).then((workspaceSpacesResponse) => {
      const spacesArray = workspaceSpacesResponse.data
      console.log(spacesArray)
      let newTreeData = []
      for (let i = 0; i < spacesArray.length; i++) {
        API.getSpaceLists(spacesArray[i]._id).then((getSpaceListsResponse) => {
          console.log(getSpaceListsResponse)
          let nodeArray = []
          if (getSpaceListsResponse.data.length !== 0) {
            for (let g = 0; g < getSpaceListsResponse.data.length; g++) {
              let taskObj = {
                key: getSpaceListsResponse.data[g]._id,
                label: getSpaceListsResponse.data[g].list_name,
              }
              nodeArray.push(taskObj)
            }
            nodeArray.push({
              key: 'create_new',
              label: 'Create new Folder or List',
              onClickNode: 'openCreateFolderList'
            })
          }
          else {
            nodeArray = [{
              key: 'create_new',
              label: 'Create new Folder or List',
              onClickNode: 'openCreateFolderList'
            }]
          }
          let spaceTreeData = {
            key: spacesArray[i]._id,
            label: spacesArray[i].space_name,
            onClickNode: '123',
            nodes: nodeArray
          }
          newTreeData.push(spaceTreeData)
        })
      }
      setInterval(function () {
        setTreeData(newTreeData)
      }, 1000)
    })
  }

  function resetCreateSpaceModal() {
    setOpenCreateSpaceModal(false)
  }

  function resetCreateFolderOrList() {
    setOpenCreateNewFolderOrListModal(false)
  }

  function resetCreateListModal() {
    setOpenCreateListModal(false)
  }

  function handleOpenCreateSpaceModal() {
    setOpenCreateSpaceModal(true)
  }

  function handleOpenCreateNewFolderOrListModal(key) {
    setOpenCreateNewFolderOrListModal(true)
    let newKey = key.replace('/create_new', '')
    setCurrentSpace(newKey)
  }

  function handleOpenCreateListModal() {
    setOpenCreateNewFolderOrListModal(false)
    setOpenCreateListModal(true)
  }


  function handleCreateSpace() {
    setOpenCreateSpaceModal(false)
    let spaceData = {
      space_name: newSpaceName,
      owner_id: userID,
      workspace_id: workspaceData._id,
      order_index: workspaceData.spaces.length
    }
    API.saveSpace(spaceData).then((saveSpaceResponse) => {
      let spacesArray = workspaceData.spaces
      spacesArray.push(saveSpaceResponse.data._id)
      let newSpaceData = {
        spaces: spacesArray
      }
      API.updateWorkspace(workspaceData._id, newSpaceData).then((updateWorkspaceResponse) => {
        handleGetWorkspaces()
      })
    })
  }

  function handleCreateList() {
    console.log('works' + " " + listName + " " + currentSpace)
    API.getSpace(currentSpace).then((spaceResponse) => {
      console.log(spaceResponse.data)
      let newList = {
        list_name: listName,
        owner_id: userID,
        space_id: spaceResponse.data._id,
        order_index: spaceResponse.data.lists.length
      }
      API.saveList(newList).then((saveListResponse) => {
        console.log(saveListResponse.data)
        let updatedListArray = spaceResponse.data.lists
        updatedListArray.push(saveListResponse.data._id)
        let newSpaceData = {
          lists: updatedListArray
        }
        API.updateSpace(spaceResponse.data._id, newSpaceData).then((updateSpaceResponse) => {
          handleTreeRefresh()
        })
      })
    })
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
            <p className="left">Workspace: {workspaceData.workspace_name}</p>
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
            <TreeMenu 
              data={treeData}
              onClickItem={({ onClickNode, key }) => {
                if (onClickNode === 'openCreateFolderList') {
                  handleOpenCreateNewFolderOrListModal(key)
                }
              }}
            />
          </Col>
        </Row>
      </SideNav>

      {/* Create Space Modal */}
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
          onChange={handleSpaceNameChange}
          id="space_name"
          placeholder="Space Name"
        />
        <br></br>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={handleCreateSpace}>Create Space</Button></a>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={resetCreateSpaceModal}>Cancel</Button></a>
      </Modal>

      {/* Create Workspace Modal */}
      <Modal
        open={openCreateWorkspaceModal}
        className='center-align'
        actions={[]}
        options={{
          dismissible: false
        }}>
        <h3>Name your Workspace:</h3>
        <br></br>
        <TextInput
          onChange={handleWorkspaceNameChange}
          id="workspace_name_form"
          placeholder="Workspace Name"
        />
        <br></br>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={handleCreateWorkspace}>Create Workspace</Button></a>
      </Modal>

      {/* Create new Folder or List */}
      <Modal
        open={openCreateNewFolderOrListModal}
        className='center-align'
        actions={[]}
        options={{
          dismissible: false
        }}>
        <h3>New Folder or List?</h3>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={handleCreateWorkspace}>Create new Folder</Button></a>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={handleOpenCreateListModal}>Create new List</Button></a>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={resetCreateFolderOrList}>Cancel</Button></a>
      </Modal>

      {/* Create new List */}
      <Modal
        open={openCreateListModal}
        className='center-align'
        actions={[]}
        options={{
          dismissible: false
        }}>
        <h3>Name your List:</h3>
        <br></br>
        <TextInput
          onChange={handleListNameChange}
          id="list_name_form"
          placeholder="List Name"
        />
        <br></br>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={handleCreateList}>Create List</Button></a>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={resetCreateListModal}>Cancel</Button></a>
      </Modal>
    </div>

  )
}
