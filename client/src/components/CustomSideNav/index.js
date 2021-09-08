import React, { useState, useEffect } from "react";
import { SideNav, Button, Col, Row, Modal, TextInput } from 'react-materialize'
import { useLocation } from "react-router-dom";
import API from "../../utils/API"
import TreeMenu, { ItemComponent } from 'react-simple-tree-menu';
import '../../../node_modules/react-simple-tree-menu/dist/main.css';

export default function CustomSideNav() {
  const [workspaceData, setWorkspaceData] = useState([])
  const [openCreateSpaceModal, setOpenCreateSpaceModal] = useState(false)
  const [openCreateWorkspaceModal, setOpenCreateWorkspaceModal] = useState(false)
  const [openCreateNewFolderOrListModal, setOpenCreateNewFolderOrListModal] = useState(false)
  const [openCreateListModal, setOpenCreateListModal] = useState(false)
  const [openCreateFolderModal, setOpenCreateFolderModal] = useState(false)
  const [openCreateNewListForFolderModal, setOpenCreateNewListForFolderModal] = useState(false)
  const [currentSpace, setCurrentSpace] = useState('')
  const [currentFolder, setCurrentFolder] = useState('')
  const [userData, setUserData] = useState([])
  const [treeData, setTreeData] = useState({})
  const [ workspaceName, setWorkspaceName ] = useState('')
  const [ newSpaceName, setNewSpaceName ] = useState('')
  const [ listName, setListName ] = useState('')
  const [ folderName, setFolderName ] = useState("")
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

  function handleFolderNameChange(event) {
    const name = event.target.value;
    setFolderName(name)
  }

  function handleCreateWorkspace() {
    setOpenCreateWorkspaceModal(false)
    const newWorkspace = {
      workspace_name: workspaceName,
      owner_id: userID
    }
    API.saveWorkspace(newWorkspace).then((createWorkspaceResponse) => {
      setWorkspaceData(createWorkspaceResponse.data)
      API.getUser(userID).then((getUserResponse) => {
        let workSpacesArray =getUserResponse.data.workspaces
        workSpacesArray.push(createWorkspaceResponse.data._id)
        let newWorkspaceData = {
          workspaces: workSpacesArray
        }
        API.updateUser(userID, newWorkspaceData).then((updateUserResponse) => {
          handleGetWorkspaces()
          handleGetUser()
        })
      })
    })
  }

  function handleGetWorkspaces() {  
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
      let newTreeData = []
      for (let i = 0; i < spacesArray.length; i++) {
        let nodeArray = []
        // Creating nodes for folder-less Lists
        API.getSpaceLists(spacesArray[i]._id).then((getSpaceListsResponse) => {
          if (getSpaceListsResponse.data.length !== 0) {
            for (let g = 0; g < getSpaceListsResponse.data.length; g++) {
              let listObj = {
                key: getSpaceListsResponse.data[g]._id,
                label: getSpaceListsResponse.data[g].list_name,
                order_index: (getSpaceListsResponse.data[g].order_index + spacesArray[i].folders.length),
              }
              nodeArray.push(listObj)
            }
            nodeArray.push({
              key: 'create_new',
              label: 'Create new Folder or List',
              onClickNode: 'openCreateFolderList',
              id: '123'
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
            order_index: spacesArray[i].order_index,
            nodes: nodeArray
          }
          newTreeData.push(spaceTreeData)
        })
        // Creating nodes for Folders
        API.getSpaceFolders(spacesArray[i]._id).then((getSpaceFolderResponse) => {
          for (let j = 0; j < getSpaceFolderResponse.data.length; j++) {
            let listArray = []
            if (getSpaceFolderResponse.data[j].lists.length === 0 ) {
                listArray.push({
                key: 'create_new',
                label: 'Create new List',
                onClickNode: 'openCreateListForFolder',
                id: '123'
              })
              let folderObj = {
                key: getSpaceFolderResponse.data[j]._id,
                label: getSpaceFolderResponse.data[j].folder_name,
                order_index: getSpaceFolderResponse.data[j].order_index,
                nodes: listArray
              }
              nodeArray.unshift(folderObj)
              nodeArray.sort((a, b) => parseFloat(a.order_index) - parseFloat(b.order_index));
            }
            else {
              API.getFolderLists(getSpaceFolderResponse.data[j]._id).then((getFolderListsResponse) => {
                  for (let o = 0; o < getFolderListsResponse.data.length; o++) {
                    let listObj = {
                      key: getFolderListsResponse.data[o]._id,
                      label: getFolderListsResponse.data[o].list_name,
                      order_index: getFolderListsResponse.data[o].order_index
                    }
                    listArray.push(listObj)
                  }
                  listArray.sort((a, b) => parseFloat(a.order_index) - parseFloat(b.order_index));
                  listArray.push({
                    key: 'create_new',
                    label: 'Create new List',
                    onClickNode: 'openCreateListForFolder',
                    id: '123'
                  })
                  let folderObj = {
                    key: getSpaceFolderResponse.data[j]._id,
                    label: getSpaceFolderResponse.data[j].folder_name,
                    order_index: getSpaceFolderResponse.data[j].order_index,
                    nodes: listArray
                  }
                  nodeArray.unshift(folderObj)
                  nodeArray.sort((a, b) => parseFloat(a.order_index) - parseFloat(b.order_index));
                
              })
            }
          }
        })
      }

      setTimeout(function () {
        newTreeData.sort((a, b) => parseFloat(a.order_index) - parseFloat(b.order_index));
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

  function resetCreateFolderModal() {
    setOpenCreateFolderModal(false)
  }

  function resetCreateNewListForFolderModal() {
    setOpenCreateNewListForFolderModal(false)
  }

  function handleOpenCreateSpaceModal() {
    setOpenCreateSpaceModal(true)
  }

  function handleOpenCreateFolderModal() {
    setOpenCreateFolderModal(true)
    resetCreateFolderOrList()
  }

  function handleOpenCreateNewFolderOrListModal(key) {
    setOpenCreateNewFolderOrListModal(true)
    let newKey = key.replace('/create_new', '')
    setCurrentSpace(newKey)
  }

  function handleOpenCreateListForFolder(key) {
    setOpenCreateNewListForFolderModal(true)
    let newKey = key.replace('/create_new', '')
    newKey = newKey.substring(newKey.indexOf("/") + 1);
    setCurrentFolder(newKey)
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
        handleGetUser()
      })
    })
  }

  function handleCreateList() {
    setOpenCreateListModal(false)
    API.getSpace(currentSpace).then((spaceResponse) => {
      let newList = {
        list_name: listName,
        owner_id: userID,
        space_id: spaceResponse.data._id,
        order_index: spaceResponse.data.lists.length
      }
      API.saveList(newList).then((saveListResponse) => {
        let updatedListArray = spaceResponse.data.lists
        updatedListArray.push(saveListResponse.data._id)
        let newSpaceData = {
          lists: updatedListArray
        }
        API.updateSpace(spaceResponse.data._id, newSpaceData).then((updateSpaceResponse) => {
          handleGetWorkspaces()
          handleGetUser()
        })
      })
    })
  }

  function handleCreateFolder() {
    setOpenCreateFolderModal(false)
    API.getSpace(currentSpace).then((spaceResponse) => {
      let newFolder = {
        folder_name: folderName,
        owner_id: userID,
        space_id: spaceResponse.data._id,
        order_index: spaceResponse.data.folders.length
      }
      API.saveFolder(newFolder).then((saveFolderResponse) => {
        console.log(saveFolderResponse.data)
        let updatedFolderArray = spaceResponse.data.folders
        updatedFolderArray.push(saveFolderResponse.data._id)
        let newSpaceData = {
          folders: updatedFolderArray
        }
        API.updateSpace(spaceResponse.data._id, newSpaceData).then((updateSpaceResponse) => {
          handleGetWorkspaces()
          handleGetUser()
        })
      })
    })
  }

  function handleCreateListForFolder() {
    setOpenCreateNewListForFolderModal(false)
    API.getFolder(currentFolder).then((getFolderResponse) => {
      let newList = {
        list_name: listName,
        owner_id: userID,
        folder_id: getFolderResponse.data._id,
        order_index: getFolderResponse.data.lists.length
      }
      API.saveList(newList).then((saveListResponse) => {
        let updatedListArray = getFolderResponse.data.lists
        updatedListArray.push(saveListResponse.data._id)
        let newFolderData = {
          lists: updatedListArray
        }
        API.updateFolder(getFolderResponse.data._id, newFolderData).then((updateFolderResponse) => {
          handleGetWorkspaces()
          handleGetUser()
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
                else if (onClickNode === 'openCreateListForFolder') {
                  handleOpenCreateListForFolder(key)
                }
              }}
              debounceTime={75}
            >
            </TreeMenu>
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
        <a><Button id="modalBtn" modal="close" onClick={handleOpenCreateFolderModal}>Create new Folder</Button></a>
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

      {/* Create new Folder */}
      <Modal
        open={openCreateFolderModal}
        className='center-align'
        actions={[]}
        options={{
          dismissible: false
        }}>
        <h3>Name your Folder:</h3>
        <br></br>
        <TextInput
          onChange={handleFolderNameChange}
          id="folder_name_form"
          placeholder="Folder Name"
        />
        <br></br>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={handleCreateFolder}>Create Folder</Button></a>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={resetCreateFolderModal}>Cancel</Button></a>
      </Modal>

       {/* Create new List for Folder*/}
       <Modal
        open={openCreateNewListForFolderModal}
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
        <a><Button id="modalBtn" modal="close" onClick={handleCreateListForFolder}>Create List</Button></a>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={resetCreateNewListForFolderModal}>Cancel</Button></a>
      </Modal>

    </div>


  )
}
