import React, { useState, useEffect } from "react";
import { SideNav, Button, Col, Row, Modal, TextInput, Icon } from 'react-materialize'
import { TreeViewComponent } from '@syncfusion/ej2-react-navigations';
import { enableRipple } from '@syncfusion/ej2-base';
import { useLocation, Redirect } from "react-router-dom";
import API from "../../utils/API"
import "./style.css"
import TreeMenu, { ItemComponent, defaultChildren } from 'react-simple-tree-menu';
import GoogleLogin from "react-google-login";
import '../../../node_modules/react-simple-tree-menu/dist/main.css';

export default function CustomSideNav() {
  const [workspaceData, setWorkspaceData] = useState([])
  const [openCreateSpaceModal, setOpenCreateSpaceModal] = useState(false)
  const [openCreateWorkspaceModal, setOpenCreateWorkspaceModal] = useState(false)
  const [openCreateNewFolderOrListModal, setOpenCreateNewFolderOrListModal] = useState(false)
  const [openCreateListModal, setOpenCreateListModal] = useState(false)
  const [openCreateFolderModal, setOpenCreateFolderModal] = useState(false)
  const [openCreateNewListForFolderModal, setOpenCreateNewListForFolderModal] = useState(false)
  const [redirectToList, setRedirectToList] = useState(false)
  const [currentSpace, setCurrentSpace] = useState('')
  const [currentFolder, setCurrentFolder] = useState('')
  const [currentList, setCurrentList] = useState('')
  const [userData, setUserData] = useState([])
  const [treeData, setTreeData] = useState({})
  const [ workspaceName, setWorkspaceName ] = useState('')
  const [ newSpaceName, setNewSpaceName ] = useState('')
  const [ listName, setListName ] = useState('')
  const [ folderName, setFolderName ] = useState("")
  const [redirect, setRedirect] = useState(false);
  const [userID, setUserID] = useState('')
  const [location, setLocation] = useState(useLocation())
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [newList, setNewList] = useState([])
  let userIdVariable = location.state
  enableRipple(true);


  useEffect(() => {
    if (!userIdVariable) {
      setTimeout(function () {
        handleGetWorkspaces()
        handleGetUser()
      }, 700)
    }
    else {
      handleGetWorkspaces()
      handleGetUser()
    }
    setNewList(newData)
    
    var x = document.getElementsByClassName("rstm-tree-item-level0")
  }, [])


  const googleSuccess = async (response) => {
    const userObj = response.profileObj
    const user = {
        email: userObj.email,
        firstName: userObj.givenName,
        lastName: userObj.familyName,
        image: userObj.imageUrl,
        googleId: userObj.googleId,
        listedItems: []
    }
    API.getUserByGoogleId(userObj.googleId).then(res => {
        if (res.data.length > 0) {
            setUserID(res.data[0]._id)
            userIdVariable = res.data[0]._id
            setRedirect(true)
        }
        else {
            API.saveUser(user).then(saveUserRes => {
                setUserID(saveUserRes.data._id)
                setRedirect(true)
            })
        }
    }).catch(error => console.log(error))

  }

  const googleFailure = (response) => {
    console.log("please enable cookies to access this app");
    alert("please enable cookies to access this app");
    console.log(response);
  };  

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
      owner_id: userIdVariable
    }
    API.saveWorkspace(newWorkspace).then((createWorkspaceResponse) => {
      setWorkspaceData(createWorkspaceResponse.data)
      API.getUser(userIdVariable).then((getUserResponse) => {
        let workSpacesArray =getUserResponse.data.workspaces
        workSpacesArray.push(createWorkspaceResponse.data._id)
        let newWorkspaceData = {
          workspaces: workSpacesArray
        }
        API.updateUser(userIdVariable, newWorkspaceData).then((updateUserResponse) => {
          handleGetWorkspaces()
          handleGetUser()
        })
      })
    })
  }

  function handleGetWorkspaces() {  
    API.getUserWorkspaces(userIdVariable).then((getUserWorkspacesResponse) => {
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
    API.getUser(userIdVariable).then((getUserResponse) => {
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
                onClickNode: 'openList',
                class: 'list_item'
              }
              nodeArray.push(listObj)
            }
            nodeArray.push({
              key: 'create_new',
              label: 'Create new Folder or List',
              class: 'create_new',
              onClickNode: 'openCreateFolderList',
              id: '123'
            })
          }
          else {
            nodeArray = [{
              key: 'create_new',
              class: 'create_new',
              label: 'Create new Folder or List',
              onClickNode: 'openCreateFolderList'
            }]
          }
          let spaceTreeData = {
            key: spacesArray[i]._id,
            label: spacesArray[i].space_name,
            onClickNode: '123',
            order_index: spacesArray[i].order_index,
            nodes: nodeArray,
            class: 'space_item',
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
                class: 'create_new',
                id: '123'
              })
              let folderObj = {
                key: getSpaceFolderResponse.data[j]._id,
                label: getSpaceFolderResponse.data[j].folder_name,
                order_index: getSpaceFolderResponse.data[j].order_index,
                class: 'folder_item',
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
                      order_index: getFolderListsResponse.data[o].order_index,
                      onClickNode: 'openFolderList',
                      class: 'list_item',
                    }
                    listArray.push(listObj)
                  }
                  listArray.sort((a, b) => parseFloat(a.order_index) - parseFloat(b.order_index));
                  listArray.push({
                    key: 'create_new',
                    label: 'Create new List',
                    onClickNode: 'openCreateListForFolder',
                    class: 'create_new',
                    id: '123'
                  })
                  let folderObj = {
                    key: getSpaceFolderResponse.data[j]._id,
                    label: getSpaceFolderResponse.data[j].folder_name,
                    order_index: getSpaceFolderResponse.data[j].order_index,
                    nodes: listArray,
                    class: 'folder_item',
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
      owner_id: userIdVariable,
      workspace_id: workspaceData._id,
      order_index: workspaceData.spaces.length,
      statuses: [
        {
          name: 'OPEN',
          type: 'open',
          color: "#D3D3D3",
          order_index: 0
        },
        {
          name: 'IN PROGRESS',
          type: 'in progress',
          color: "#A875FF",
          order_index: 1
        },
        {
          name: 'CLOSED',
          type: 'closed',
          color: "#6BC950",
          order_index: 2
        }
      ]
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
        owner_id: userIdVariable,
        space_id: spaceResponse.data._id,
        order_index: spaceResponse.data.lists.length,
        statuses: spaceResponse.data.statuses
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
        owner_id: userIdVariable,
        space_id: spaceResponse.data._id,
        order_index: spaceResponse.data.folders.length,
        statuses: spaceResponse.data.statuses
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
        owner_id: userIdVariable,
        folder_id: getFolderResponse.data._id,
        order_index: getFolderResponse.data.lists.length,
        statuses: getFolderResponse.data.statuses
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

  function handleOpenList(key) {
    let newKey = key.substring(key.indexOf("/") + 1);
    setCurrentList(newKey)
    setRedirectToList(true)
  }

  function handleOpenFolderList(key) {
    let newKey = key.substring(key.indexOf("/") + 1);
    newKey = newKey.substring(newKey.indexOf("/") + 1)
    setCurrentList(newKey)
    setRedirectToList(true)
  }

  const fields =  [
    { id: '01', name: 'Local Disk (C:)',
        subChild: [
            {
                id: '01-01', name: 'Program Files',
                subChild: [
                    { id: '01-01-01', name: '7-Zip' },
                    { id: '01-01-02', name: 'Git' },
                    { id: '01-01-03', name: 'IIS Express' },
                ]
            },
            {
                id: '01-02', name: 'Users',
                subChild: [
                    { id: '01-02-01', name: 'Smith' },
                    { id: '01-02-02', name: 'Public' },
                    { id: '01-02-03', name: 'Admin' },
                ]
            },
            {
                id: '01-03', name: 'Windows',
                subChild: [
                    { id: '01-03-01', name: 'Boot' },
                    { id: '01-03-02', name: 'FileManager' },
                    { id: '01-03-03', name: 'System32' },
                ]
            },
        ]
    },
    {
        id: '02', name: 'Local Disk (D:)',
        subChild: [
            {
                id: '02-01', name: 'Personals',
                subChild: [
                    { id: '02-01-01', name: 'My photo.png' },
                    { id: '02-01-02', name: 'Rental document.docx' },
                    { id: '02-01-03', name: 'Pay slip.pdf' },
                ]
            },
            {
                id: '02-02', name: 'Projects',
                subChild: [
                    { id: '02-02-01', name: 'ASP Application' },
                    { id: '02-02-02', name: 'TypeScript Application' },
                    { id: '02-02-03', name: 'React Application' },
                ]
            },
            {
                id: '02-03', name: 'Office',
                subChild: [
                    { id: '02-03-01', name: 'Work details.docx' },
                    { id: '02-03-02', name: 'Weekly report.docx' },
                    { id: '02-03-03', name: 'Wish list.csv' },
                ]
            },
        ]
    },
    {
        id: '03', name: 'Local Disk (E:)', icon: 'folder',
        subChild: [
            {
                id: '03-01', name: 'Pictures',
                subChild: [
                    { id: '03-01-01', name: 'Wind.jpg' },
                    { id: '03-01-02', name: 'Stone.jpg' },
                    { id: '03-01-03', name: 'Home.jpg' },
                ]
            },
            {
                id: '03-02', name: 'Documents',
                subChild: [
                    { id: '03-02-01', name: 'Environment Pollution.docx' },
                    { id: '03-02-02', name: 'Global Warming.ppt' },
                    { id: '03-02-03', name: 'Social Network.pdf' },
                ]
            },
            {
                id: '03-03', name: 'Study Materials',
                subChild: [
                    { id: '03-03-01', name: 'UI-Guide.pdf' },
                    { id: '03-03-02', name: 'Tutorials.zip' },
                    { id: '03-03-03', name: 'TypeScript.7z' },
                ]
            },
        ]
    }
];

  const newData = {dataSource: fields,  id: 'id', text: 'name', child: 'subChild'}

  function handleNodeClick(e) {
    console.log(e)
  }

  function nodeTemplate(data) {
    return (<div>
    <Icon>add</Icon>
    <div>{data.name}</div>
  </div>);
  }

  return (
    <div>
      { redirectToList ? (<Redirect push to={{pathname: '/listview/' + currentList, state: userID}}/>) : null }
      <GoogleLogin
        className="loginBtn"
        clientId={googleClientId}
        buttonText="Log in"
        onSuccess={googleSuccess}
        onFailure={googleFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
  
        
        />
      <SideNav>
        <Row>
          <Col s={12}>
            <h3 className="left padding-left">PaulUp</h3>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <p className="left padding-left">Workspace: {workspaceData.workspace_name}</p>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <Button
              onClick={handleOpenCreateSpaceModal}
            >New Space</Button>
          </Col>
        </Row>
        <Row className="left-align">
          <Col s={12} className="left-align">
            <TreeViewComponent fields={newList} allowDragAndDrop={true} className="left-align" cssClass={"custom"} nodeClicked={(event) => handleNodeClick(event)} nodeTemplate={(newList) => nodeTemplate(newList)}/>
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
                else if (onClickNode === 'openList') {
                  handleOpenList(key)
                }
                else if (onClickNode === 'openFolderList') {
                  handleOpenFolderList(key)
                }
              }}
              debounceTime={75}
            >
              {({ search, items }) => (
                <div>
                  <Row>
                    <Col s={12}>
                      <TextInput className='sidebar_search' onChange={e => search(e.target.value)} placeholder="Type and search"/>
                    </Col>
                  </Row>
                  <Row>
                    <Col s={12}>
                      <ul className="tree_element">
                          {items.map(({key, ...props}) => (
                            <div className={props.class}>
                            <ItemComponent key={key} {...props} />
                            </div>
                          ))}
                      </ul>
                    </Col>
                  </Row>
                </div>  
              )}
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
