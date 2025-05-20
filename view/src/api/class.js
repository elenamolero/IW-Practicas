import axios from "./axios.js";

export const groupClassRequest = (date) => axios.get(`/my-classes-by-day/${date}`);