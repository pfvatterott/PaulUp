import React, { useState, useEffect } from "react";
import { SideNav, Button, Col, Row, Modal, TextInput, Icon, Collapsible, CollapsibleItem , Collection, CollectionItem} from 'react-materialize'
import { TreeViewComponent } from '@syncfusion/ej2-react-navigations';
import { enableRipple } from '@syncfusion/ej2-base';
import { useLocation, Redirect } from "react-router-dom";
import FavoritesMenu from "../FavoritesMenu/index.js";
import TreeEllipsesMenu from "../TreeEllipsesMenu/index.js";
import API from "../../utils/API"
import "./style.css"
import GoogleLogin from "react-google-login";
import '../../../node_modules/react-simple-tree-menu/dist/main.css';
import StatusBoxChoose from "../StatusBoxChoose/index.js";

export default function CustomSideNav(props) {
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
  const [forceUpdate, setForceUpdate] = useState(0);
  const [openCreateSpaceStatuses, setOpenCreateSpaceStatuses] = useState(false)
  const [sideNavValue, setSideNavValue] = useState(0)
  const [newOpenStatuses, setNewOpenStatuses] = useState([{
    type: 'open',
    color: '#D3D3D3',
    name: 'open',
    index: 0
    }
  ])
  const [newInProgressStatuses, setNewInProgressStatuses] = useState([{
    type: 'in progress',
    color: '#A875FF',
    name: 'in progress',
    index: 0
  }])
  const [newClosedStatuses, setNewClosedStatuses] = useState([{
    type: 'done',
    color: '#6BC950',
    name: 'done',
    index: 0
  }]);
  const [createOpenStatusInput, setCreateOpenStatusInput] = useState(false)
  const [createInProgressStatusInput, setCreateInProgressStatusInput] = useState(false)
  const [createDoneStatusInput, setCreateDoneStatusInput] = useState(false)
  const [newStatusName, setNewStatusName] = useState('')
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
    
    var x = document.getElementsByClassName("rstm-tree-item-level0")
  }, [sideNavValue])


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
        handleTreeRefreshNew(getUserWorkspacesResponse.data[0]._id)
      }
      else {
        console.log('need to set up a way to switch workspaces')
      }
    })
  }

  function handleGetUser() {
    API.getUser(userIdVariable).then((getUserResponse) => {
      setUserData(getUserResponse.data)
      if (props.handleSetUserFavorites) {
        props.handleSetUserFavorites(getUserResponse.data.favorites)
      }
    })
  }

  function resetCreateSpaceStatusesModal() {
    setOpenCreateSpaceStatuses(false)
    setNewSpaceName('')
  }

  function resetCreateSpaceModal() {
    setOpenCreateSpaceModal(false)
    setNewSpaceName('')
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
    setCurrentFolder(key)
  }

  function handleOpenCreateListModal() {
    setOpenCreateNewFolderOrListModal(false)
    setOpenCreateListModal(true)
  }

  function handleOpenCreateSpaceStatuses() {
    setOpenCreateSpaceModal(false)
    setOpenCreateSpaceStatuses(true)
  }


  function handleCreateSpace() {
    setOpenCreateSpaceModal(false)
    setOpenCreateSpaceStatuses(false)
    let openStatuses = newOpenStatuses
    let inProgressStatuses = newInProgressStatuses
    let closedStatuses = newClosedStatuses
    for (let i = 0; i < inProgressStatuses.length; i++) {
      inProgressStatuses[i].index = openStatuses.length + i
    }
    for (let p = 0; p < closedStatuses.length; p++) {
      closedStatuses[p].index = openStatuses.length + inProgressStatuses.length + p
    }
    let newStatuses = [...openStatuses, ...inProgressStatuses, ...closedStatuses]
    let spaceData = {
      space_name: newSpaceName,
      owner_id: userIdVariable,
      workspace_id: workspaceData._id,
      order_index: workspaceData.spaces.length,
      statuses: newStatuses
    }
    API.saveSpace(spaceData).then((saveSpaceResponse) => {
      setNewSpaceName('')
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
          // navigates to new list
          setCurrentList(saveListResponse.data._id)
          setRedirectToList(true)
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
          // navigates to new list
          setCurrentList(saveListResponse.data._id)
          setRedirectToList(true)
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

  function handleTreeRefreshNew(workspace_id) {
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
                id: getSpaceListsResponse.data[g]._id,
                name: getSpaceListsResponse.data[g].list_name,
                order_index: (getSpaceListsResponse.data[g].order_index + spacesArray[i].folders.length),
                onClickNode: 'openList',
                class: 'list_item',
                favorited: getSpaceListsResponse.data[g].favorited
              }
              nodeArray.push(listObj)
            }
            nodeArray.push({
              id: spacesArray[i]._id,
              name: 'Create new Folder or List',
              class: 'create_new',
              onClickNode: 'openCreateFolderList',
            })
          }
          else {
            nodeArray = [{
              id: spacesArray[i]._id,
              class: 'create_new',
              name: 'Create new Folder or List',
              onClickNode: 'openCreateFolderList'
            }]
          }
          let spaceTreeData = {
            id: spacesArray[i]._id,
            name: spacesArray[i].space_name,
            onClickNode: '123',
            order_index: spacesArray[i].order_index,
            subChild: nodeArray,
            class: 'space_item',
            favorited: spacesArray[i].favorited,
            expanded: true
          }
          newTreeData.push(spaceTreeData)
        })
        // Creating nodes for Folders
        API.getSpaceFolders(spacesArray[i]._id).then((getSpaceFolderResponse) => {
          for (let j = 0; j < getSpaceFolderResponse.data.length; j++) {
            let listArray = []
            if (getSpaceFolderResponse.data[j].lists.length === 0 ) {
                listArray.push({
                name: 'Create new List',
                onClickNode: 'openCreateListForFolder',
                class: 'create_new_list_for_folder',
                id: getSpaceFolderResponse.data[j]._id
              })
              let folderObj = {
                id: getSpaceFolderResponse.data[j]._id,
                name: getSpaceFolderResponse.data[j].folder_name,
                order_index: getSpaceFolderResponse.data[j].order_index,
                class: 'folder_item',
                subChild: listArray,
                favorited: getSpaceFolderResponse.data[j].favorited,
              }
              nodeArray.unshift(folderObj)
              nodeArray.sort((a, b) => parseFloat(a.order_index) - parseFloat(b.order_index));
            }
            else {
              API.getFolderLists(getSpaceFolderResponse.data[j]._id).then((getFolderListsResponse) => {
                  for (let o = 0; o < getFolderListsResponse.data.length; o++) {
                    let listObj = {
                      id: getFolderListsResponse.data[o]._id,
                      name: getFolderListsResponse.data[o].list_name,
                      order_index: getFolderListsResponse.data[o].order_index,
                      onClickNode: 'openFolderList',
                      class: 'folder_list_item',
                      favorited: getFolderListsResponse.data[o].favorited
                    }
                    listArray.push(listObj)
                  }
                  listArray.sort((a, b) => parseFloat(a.order_index) - parseFloat(b.order_index));
                  listArray.push({
                    id: getSpaceFolderResponse.data[j]._id,
                    name: 'Create new List',
                    onClickNode: 'openCreateListForFolder',
                    class: 'create_new_list_for_folder',
                  })
                  let folderObj = {
                    id: getSpaceFolderResponse.data[j]._id,
                    name: getSpaceFolderResponse.data[j].folder_name,
                    order_index: getSpaceFolderResponse.data[j].order_index,
                    favorited: getSpaceFolderResponse.data[j].favorited,
                    subChild: listArray,
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
        const newData = {dataSource: newTreeData,  id: 'id', text: 'name', child: 'subChild'}
        setTreeData(newData)
      }, 1000)
    })
  }

  function handleSetSideNavValue(x) {
    setSideNavValue(x)
  }


  function nodeTemplate(data) {
    if (data.class === 'space_item') { return (<div>
      <Icon className="left treeIcon">fiber_manual_record</Icon>
      <p className="left">{data.name}</p>
      <TreeEllipsesMenu className="right" data={data} sideNavValue={sideNavValue} setSideNavValue={(x) => handleSetSideNavValue(x)} userFavorites={props.userFavorites} setUserFavorites={(x) => props.handleSetUserFavorites(x)}/>
      </div>)}
    else if (data.class === 'folder_item') { return (<div>
      <Icon className="left">folder</Icon>
      <TreeEllipsesMenu className="right" data={data} sideNavValue={sideNavValue} setSideNavValue={(x) => handleSetSideNavValue(x)} userFavorites={props.userFavorites} setUserFavorites={(x) => props.handleSetUserFavorites(x)}/>
      <p>{data.name}</p>
      </div>)}
    else if (data.class === 'folder_list_item') { return (<div onClick={() => handleOpenFolderList(data.id)}>
      <Icon className="left">format_list_bulleted</Icon>
      <TreeEllipsesMenu className="right" data={data} sideNavValue={sideNavValue} setSideNavValue={(x) => handleSetSideNavValue(x)} userFavorites={props.userFavorites} setUserFavorites={(x) => props.handleSetUserFavorites(x)}/>
      <p>{data.name}</p>
      </div>)}
    else if (data.class === 'list_item') { return (<div onClick={() => handleOpenList(data.id)}>
      <Icon className="left">format_list_bulleted</Icon>
      <TreeEllipsesMenu className="right" data={data} sideNavValue={sideNavValue} setSideNavValue={(x) => handleSetSideNavValue(x)} userFavorites={props.userFavorites} setUserFavorites={(x) => props.handleSetUserFavorites(x)}/>
      <p>{data.name}</p>
      </div>)}
    else if (data.class === 'create_new_list_for_folder') { return (<div onClick={() => handleOpenCreateListForFolder(data.id)}>
      <Icon className="left">add</Icon>
      <p>{data.name}</p>
      </div>)}
    else {
      return (<div onClick={() => handleOpenCreateNewFolderOrListModal(data.id)}>
      <Icon className="left">add</Icon>
      <p>{data.name}</p>
    </div>)};
  }

  function handleStatusColorChange(x) {
    if (x.type === 'open') {
      setNewOpenStatuses(x) 
    }
    else if (x.type === 'in progress') {
      setNewInProgressStatuses(x)
    }
    else if (x.type === 'done') {
      setNewClosedStatuses(x)
    }
  }

  function handleOpenCreateStatusInput(x) {
      if (x === 'open') {
        setCreateOpenStatusInput(true)
        setCreateInProgressStatusInput(false)
        setCreateDoneStatusInput(false)
      }
      else if (x === 'in progress') {
        setCreateOpenStatusInput(false)
        setCreateInProgressStatusInput(true)
        setCreateDoneStatusInput(false)
      }
      else if (x === 'done') {
        setCreateOpenStatusInput(false)
        setCreateInProgressStatusInput(false)
        setCreateDoneStatusInput(true)
      }
  }

  function handleNewStatusNameChange(event) {
    const name = event.target.value;
    setNewStatusName(name)
  }

  function handleCreateNewStatus(type) {
    setCreateOpenStatusInput(false)
    setCreateInProgressStatusInput(false)
    setCreateDoneStatusInput(false)
    if (newStatusName !== '') {
      if (type === 'open') {
        let newStatus = newOpenStatuses
        newStatus.push({
          type: 'open', 
          color: '#D3D3D3',
          name: newStatusName,
          index: newStatus.length
        })
        setNewOpenStatuses(newStatus)
        setNewStatusName('')
      }
      else if (type === 'in progress') {
        let newStatus = newInProgressStatuses
        newStatus.push({
          type: 'in progress', 
          color: '#A875FF',
          name: newStatusName,
          index: newStatus.length
        })
        setNewInProgressStatuses(newStatus)
        setNewStatusName('')
      }
      else if (type === 'done') {
        let newStatus = newClosedStatuses
        newStatus.push({
          type: 'done', 
          color: '#6BC950',
          name: newStatusName,
          index: newStatus.length
        })
        setNewClosedStatuses(newStatus)
        setNewStatusName('')
      }
    }
  }

  function handleDeleteStatus(type, index) {
    if (type === 'open') {
      let newStatus = newOpenStatuses
      newStatus.splice(index, 1)
      for (let i = 0; i < newStatus.length; i++) {
        if (newStatus[i].index > index) {
          newStatus[i].index -= 1
        }
      }
      setNewOpenStatuses(newStatus)
      setForceUpdate(forceUpdate + 1)
    }
    else if (type === 'in progress') {
      let newStatus = newInProgressStatuses
      newStatus.splice(index, 1)
      for (let i = 0; i < newStatus.length; i++) {
        if (newStatus[i].index > index) {
          newStatus[i].index -= 1
        }
      }
      setNewInProgressStatuses(newStatus)
      setForceUpdate(forceUpdate + 1)
    }
    else if (type === 'done') {
      let newStatus = newClosedStatuses
      newStatus.splice(index, 1)
      for (let i = 0; i < newStatus.length; i++) {
        if (newStatus[i].index > index) {
          newStatus[i].index -= 1
        }
      }
      setNewClosedStatuses(newStatus)
      setForceUpdate(forceUpdate + 1)
    }
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
        <Row className="left-align">
          <Col s={12} className="left-align">
            <FavoritesMenu value={props.value} setValue={(x) => props.setValue(x)} userFavorites={props.userFavorites} setUserFavorites={(x) => props.handleSetUserFavorites(x)} sideNavValue={sideNavValue} setSideNavValue={(x) => handleSetSideNavValue(x)} handleOpenList={(x) => handleOpenList(x)}/>
          </Col>
        </Row>
        <Row className="left-align">
          <Col s={12} className="left-align">
            <Collapsible accordion>
            <CollapsibleItem
                expanded={true}
                header="Spaces"
                icon={<Icon>fiber_manual_record</Icon>}
                node="div"
            >
              <Row>
                <Col s={12} className="center-align">
                  <Button
                    onClick={handleOpenCreateSpaceModal}
                  >New Space</Button>
                </Col>
              </Row>
              <Row>
                <Col s={12}>
                  <TreeViewComponent fields={treeData} allowDragAndDrop={true} nodeTemplate={(newList) => nodeTemplate(newList)} expandOn={'Auto'} enablePersistence={true}/>
                </Col>
              </Row>
            </CollapsibleItem>
            </Collapsible>

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
        <a><Button id="modalBtn" modal="close" onClick={handleOpenCreateSpaceStatuses}>Next</Button></a>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={resetCreateSpaceModal}>Cancel</Button></a>
      </Modal>

      {/* Set Space Statuses Modal */}

      <Modal
        open={openCreateSpaceStatuses}
        className='center-align'
        actions={[]}
        options={{
          dismissible: false
        }}>
        <h4>Create your Statuses:</h4>
        <br></br>
        <Row>
          <Col s={12}>
            <h5>Open</h5>
            <Collection className="createStatusesModalCollection">
              {newOpenStatuses? newOpenStatuses.map(item => (
                <div>
                <CollectionItem>
                  <StatusBoxChoose info={item} statusSet={newOpenStatuses} setStatusColor={(x) => handleStatusColorChange(x)}/>
                  <div className="left">{item.name}</div>
                  <a className="right">
                    <Icon className="left statusTrashIcon" onClick={() => handleDeleteStatus(item.type, item.index)}>delete</Icon>
                  </a>
               </CollectionItem>  
               </div>
              )) : null}
              <CollectionItem className="collection left-align taskViewCollection">
                  { createOpenStatusInput ? (
                    <li className="collection-item create_task_collection_item">
                      <div className="input-field">
                          <input autoFocus placeholder="Create New Status" id="first_name" type="text" className="validate" onChange={handleNewStatusNameChange} value={newStatusName}
                          onKeyPress={event => {
                              if (event.key === 'Enter') {
                                handleCreateNewStatus('open')
                              }
                          }}/>
                      </div>
                    </li>
                  ) : <Button flat node="button" waves="light" onClick={() => handleOpenCreateStatusInput('open')}>+ Status</Button>}
              </CollectionItem> 
            </Collection>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <h5>In Progress</h5>
            <Collection className="createStatusesModalCollection">
              {newInProgressStatuses? newInProgressStatuses.map(item => (
                <div>
                <CollectionItem>
                  <StatusBoxChoose info={item} statusSet={newInProgressStatuses} setStatusColor={(x) => handleStatusColorChange(x)}/>
                  <div className="left">{item.name}</div>
                  <a className="right">
                    <Icon className="left statusTrashIcon" onClick={() => handleDeleteStatus(item.type, item.index)}>delete</Icon>
                  </a>
                </CollectionItem>
                </div>
              )) : null}
               <CollectionItem className="collection left-align taskViewCollection">
                    { createInProgressStatusInput ? (
                          <li className="collection-item create_task_collection_item">
                          <div className="input-field">
                              <input autoFocus placeholder="Create New Status" id="first_name" type="text" className="validate" onChange={handleNewStatusNameChange} value={newStatusName}
                              onKeyPress={event => {
                                  if (event.key === 'Enter') {
                                    handleCreateNewStatus('in progress')
                                  }
                              }}/>
                          </div>
                      </li>
                    ) : <Button flat node="button" waves="light" onClick={() => handleOpenCreateStatusInput('in progress')}>+ Status</Button>}
                </CollectionItem>  
            </Collection>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <h5>Closed</h5>
            <Collection className="createStatusesModalCollection">
              {newClosedStatuses? newClosedStatuses.map(item => (
                <div>
                <CollectionItem>
                  <StatusBoxChoose info={item} statusSet={newClosedStatuses} setStatusColor={(x) => handleStatusColorChange(x)}/>
                  <div className="left">{item.name}</div>
                  <a className="right">
                    <Icon className="left statusTrashIcon" onClick={() => handleDeleteStatus(item.type, item.index)}>delete</Icon>
                  </a>
                </CollectionItem>
                </div>
              )) : null}
              <CollectionItem className="collection left-align taskViewCollection">
                    { createDoneStatusInput ? (
                          <li className="collection-item create_task_collection_item">
                          <div className="input-field">
                              <input autoFocus placeholder="Create New Status" id="first_name" type="text" className="validate" onChange={handleNewStatusNameChange} value={newStatusName}
                              onKeyPress={event => {
                                  if (event.key === 'Enter') {
                                    handleCreateNewStatus('done')
                                  }
                              }}/>
                          </div>
                      </li>
                    ) : <Button flat node="button" waves="light" onClick={() => handleOpenCreateStatusInput('done')}>+ Status</Button>}
                </CollectionItem>  
            </Collection>
          </Col>
        </Row>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={handleCreateSpace}>Create Space</Button></a>
        <br></br><br></br>
        <a><Button id="modalBtn" modal="close" onClick={resetCreateSpaceStatusesModal}>Cancel</Button></a>
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
