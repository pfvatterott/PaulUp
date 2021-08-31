import React, { useState, useEffect } from "react";
import { SideNav, Button, Col, Row, Modal, TextInput } from 'react-materialize'
import API from "../../utils/API"
import TreeMenu from 'react-simple-tree-menu';
import '../../../node_modules/react-simple-tree-menu/dist/main.css';

export default function CustomSideNav() {
  const [userWorkspaceData, setUserWorkspaceData] = useState([])
  const [openCreateSpaceModal, setOpenCreateSpaceModal] = useState(false)



  useEffect(() => {
    handleGetSpaces()
  }, [])

  function handleGetSpaces() {
    API.getUserSpaces('PaulVatterott').then((getUserSpacesResponse) => {
      console.log(getUserSpacesResponse)
      setUserWorkspaceData(getUserSpacesResponse)
      handleTreeRefresh(getUserSpacesResponse)
    })
  }

  function handleTreeRefresh(data) {
    console.log(data.data[0])
  }

  function resetCreateSpaceModal() {
    setOpenCreateSpaceModal(false)
  }

  function handleOpenCreateSpaceModal() {
    setOpenCreateSpaceModal(true)

  }
    

  function handleCreateSpace() {
    if (userWorkspaceData.data) {
      if (userWorkspaceData.data[0].spaces) {
        console.log(userWorkspaceData.data[0])
        console.log('this needs work')
      }
    }
    else {
      let updatedSpacesData = {
        workspace_name: userWorkspaceData.data[0].workspace_name,
        workspace_owner: userWorkspaceData.data[0].workspace_owner,
        spaces: {
          space_name: 'space name!',
          space_id: '1234'
        }
      }
      API.updateUserSpaces(userWorkspaceData.data[0]._id, updatedSpacesData)

    }
    

  }

  const treeData = {
      'node': {               // key
        label: 'Node 1 at the first level',
        index: 0, // decide the rendering order on the same level
          // any other props you need, e.g. url
        nodes: {
          'second-level-node-1': {
            label: 'Node 1 at the second level',
            index: 0,
            nodes: {
              'third-level-node-1': {
                label: 'Node 1 at the third level',
                index: 0,
                nodes: {} // you can remove the nodes property or leave it as an empty array
              },
            },
          },
        },
      },
      'first-level-node-2': {
        label: 'Node 2 at the first level',
        index: 1,
      },
      };
       

  return (
      <div>
        <SideNav>
            <Row>
                <Col s={12}>
                    <h3 className="left">ClickUp</h3>
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
