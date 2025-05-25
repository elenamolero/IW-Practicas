import axios from "./axios.js";

export const registerRequest= (user) =>axios.post(`/register`,user);

export const loginRequest= (user) =>axios.post(`/login`,user);

export const verifyTokenRequet = () => {
    console.log("Llamando a /verify desde verifyTokenRequet");
    return axios.get('http://localhost:4000/api/verify', {
        withCredentials: true
    });
};

export const getMemberByIdRequest = (id) => {
  return axios.get(`http://localhost:4000/api/member/${id}`, {
    withCredentials: true,
  });
}

export const updateUserMemberRequest = (user) => {
  return axios.put("http://localhost:4000/api/update", user, {
    withCredentials: true,
  });
}

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

export const getAllTrainersRequest = () =>
  axios.get("http://localhost:4000/api/trainers", { withCredentials: true });