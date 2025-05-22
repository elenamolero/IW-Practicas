import axios from "./axios.js";

export const registerRequest= (user) =>axios.post(`/register`,user);

export const loginRequest= (user) =>axios.post(`/login`,user);

export const verifyTokenRequet = () => {
    console.log("Llamando a /verify desde verifyTokenRequet");
    return axios.get('http://localhost:4000/api/verify', {
        withCredentials: true
    });
};