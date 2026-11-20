import api from "../config/api";

export const fetchLibraryBooks = async () => {
  const response = await api.get("/library/books");
  return response.data;
};

export const fetchBorrowings = async (facultyId: string) => {
  const response = await api.get(
    `/library/borrowings/${facultyId}`
  );

  return response.data;
};