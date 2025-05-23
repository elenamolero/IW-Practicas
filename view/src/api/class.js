import axios from "./axios.js";

export const groupClassRequest = (date) => axios.get(`/my-classes-by-day/${date}`);
export const reserveGroupClassRequest = (classId) =>
  axios.post(`/reserve-group-class/${classId}`);
export const cancelGroupClassReservationRequest = (classId) =>
  axios.patch(`/group-classes-cancel-reservation/${classId}`);
export const deleteGroupClassRequest = (classId) =>
  axios.delete(`/delete-group-class/${classId}`);
export const createGroupClassRequest = (classData) =>
  axios.post("/create-group-class", classData, { withCredentials: true });