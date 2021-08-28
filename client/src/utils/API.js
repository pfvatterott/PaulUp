import axios from "axios";

export default {
  // Gets all books
  getSpaces: function() {
    return axios.get("/api/spaces");
  },
  // Gets the book with the given id
  getSpace: function(id) {
    return axios.get("/api/spaces/" + id);
  },
  // Deletes the book with the given id
  deleteSpace: function(id) {
    return axios.delete("/api/spaces/" + id);
  },
  // Saves a book to the database
  saveSpace: function(bookData) {
    return axios.post("/api/spaces", bookData);
  }
};
