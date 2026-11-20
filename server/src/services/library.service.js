const axios = require("axios");

const libraryAPI = axios.create({
  baseURL: process.env.LIBRARY_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Example: retrieve books from the Library API
async function getBooks() {
  try {
    const response = await libraryAPI.get("/books");
    return response.data;
  } catch (error) {
    console.error(
      "Library API error:",
      error.response?.data || error.message
    );

    throw error;
  }
}

module.exports = {
  getBooks,
};