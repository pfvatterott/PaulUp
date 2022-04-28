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
  getUserByEmail: function(id) {
    return axios.get("/api/users/email/" + id);
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
  saveList: function(listData) {
    return axios.post("/api/lists", listData);
  },
  updateSpace: function(spaceId, spaceData) {
    return axios.put("/api/spaces/" + spaceId, spaceData)
  },
  getSpaceLists: function(id) {
    return axios.get("/api/lists/space/" + id);
  },
  saveFolder: function(folderData) {
    return axios.post("/api/folders", folderData);
  },
  getSpaceFolders: function(id) {
    return axios.get("/api/folders/space/" + id);
  },
  getFolder: function(id) {
    return axios.get("/api/folders/" + id);
  },
  updateFolder: function(folderId, folderData) {
    return axios.put("/api/folders/" + folderId, folderData)
  },
  getFolderLists: function(id) {
    return axios.get("/api/lists/folder/" + id);
  },
  getList: function(id) {
    return axios.get("/api/lists/" + id);
  },
  saveTask: function(taskData) {
    return axios.post("/api/tasks", taskData);
  },
  updateList: function(listId, listData) {
    return axios.put("/api/lists/" + listId, listData)
  },
  getListTasks: function(id) {
    return axios.get("/api/tasks/list/" + id);
  },
  updateTask: function(taskId, taskData) {
    return axios.put("/api/tasks/" + taskId, taskData)
  },
  getTask: function(id) {
    return axios.get("/api/tasks/" + id);
  },
  deleteTask: function(id) {
    return axios.delete("/api/tasks/" + id);
  },
  deleteList: function(id) {
    return axios.delete("/api/lists/" + id);
  },
  deleteFolder: function(id) {
    return axios.delete("/api/folders/" + id);
  },
  createNewTaskHistory: function(taskHistoryData) {
    return axios.post("/api/taskHistory", taskHistoryData);
  }
};
