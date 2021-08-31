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
  getUserSpaces: function(id) {
    return axios.get("/api/spaces/user/" + id)
  },
  updateUserSpaces: function(spaceId, spaceData) {
    return axios.put("/api/spaces/" + spaceId, spaceData)
  },
  getUser: function(id) {
    return axios.get("/api/users/" + id);
  },
  saveUser: function(userData) {
    return axios.post("/api/users", userData);
  },
  updateUser: function(userId, userData) {
    return axios.put("/api/users/" + userId, userData)
  }
};
