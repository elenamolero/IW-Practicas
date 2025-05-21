import axios from "./axios.js";

export const groupClassRequest = (date) => axios.get(`/my-classes-by-day/${date}`);
export const reserveGroupClassRequest = (classId) =>
  axios.post(`/reserve-group-class/${classId}`);
export const cancelGroupClassReservationRequest = (classId) =>
  axios.patch(`/group-classes-cancel-reservation/${classId}`);