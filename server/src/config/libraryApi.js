
const axios = require("axios");

const libraryApi = axios.create({
  baseURL: process.env.LIBRARY_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = libraryApi;
