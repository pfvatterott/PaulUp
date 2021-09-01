import axios from "axios";

export default {
  // Gets all spaces
  getSpaces: function() {
    return axios.get("/api/spaces");
  },
  // Gets the space with the given id
  getSpace: function(id) {
    return axios.get("/api/spaces/" + id);
  },
  // Deletes the space with the given id
  deleteSpace: function(id) {
    return axios.delete("/api/spaces/" + id);
  },
  // Saves a space to the database
  saveSpace: function(spaceData) {
    return axios.post("/api/spaces", spaceData);
  },
  //get a space with given user id
  getUserWorkspaces: function(id) {
    return axios.get("/api/workspaces/user/" + id)
  },
  updateUserSpaces: function(spaceId, spaceData) {
    return axios.put("/api/spaces/" + spaceId, spaceData)
  },
  getUser: function(id) {
    return axios.get("/api/users/" + id);
  },
  getUserByGoogleId: function(id) {
    return axios.get("/api/users/google/" + id);
  },
  saveUser: function(userData) {
    return axios.post("/api/users", userData);
  },
  updateUser: function(userId, userData) {
    return axios.put("/api/users/" + userId, userData)
  },
  saveWorkspace: function(spaceData) {
    return axios.post("/api/workspaces", spaceData);
  },
  updateWorkspace: function(workSpaceId, workspaceData) {
    return axios.put("/api/workspaces/" + workSpaceId, workspaceData)
  },
  getWorkspace: function(id) {
    return axios.get("/api/workspaces/" + id);
  },
  getWorkspaceSpaces: function(id) {
    return axios.get("/api/spaces/workspace/" + id);
  },
};
