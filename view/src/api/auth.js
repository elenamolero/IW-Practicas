import axios from "./axios.js";

export const registerRequest= (user) =>axios.post(`/register`,user);

export const loginRequest= (user) =>axios.post(`/login`,user);

export const verifyTokenRequet = () => {
    console.log("Llamando a /verify desde verifyTokenRequet");
    return axios.get('http://localhost:4000/api/verify', {
        withCredentials: true
    });
};

export const registerTrainer = async (formData) => {
  const res = await axios.post(
    "http://localhost:3000/api/register-trainer",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    }
  );
  return res.data;
};