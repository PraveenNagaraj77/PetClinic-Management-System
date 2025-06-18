import axios from "axios";

// 🔐 Axios instance with token injection
const api = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Use context if needed
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//
// 🔑 AUTH SERVICES
//
export const login = (credentials) => api.post("/auth/login", credentials);
export const register = (userData) => {
  const payload = { ...userData, username: userData.name };
  return api.post("/auth/register", payload);
};

//
// 👤 OWNER SERVICES
//
export const getAllOwners = () => api.get("/owners");
export const getOwnerById = (id) => api.get(`/owners/${id}`);
export const getMyOwnerProfile = () => api.get("/owners/me");
export const createOwner = (data) => api.post("/owners", data);
export const updateOwner = (id, data) => api.put(`/owners/${id}`, data);
export const deleteOwner = (id) => api.delete(`/owners/${id}`);

//
// 🐶 PET SERVICES
//
export const getAllPets = () => api.get("/pets");

export const getMyPets = () => api.get("/pets/mine");

export const getPetById = (id) => api.get(`/pets/${id}`);

export const getPetsByOwner = (ownerId) => api.get(`/pets/owner/${ownerId}`);

export const createPet = (ownerId, petData) =>
  api.post(`/pets/owner/${ownerId}`, petData);

export const updatePet = (id, data) =>
  api.put(`/pets/${id}`, data);

export const deletePet = (id) =>
  api.delete(`/pets/${id}`);

export const createPetForOwner = (petData) => api.post("/pets/mine", petData); // For USERs

//
// 👨‍⚕️ VET SERVICES
//
export const getAllVets = async () => {
  const res = await api.get("/vets");
  return res.data; // ✅ This should be an array
};
export const getVetById = async (id) => {
  const response = await api.get(`/vets/${id}`);
  return response.data; // ✅ return only the data
};
export const createVet = (data) => api.post("/vets", data);
export const updateVet = (id, data) => api.put(`/vets/${id}`, data);
export const deleteVet = (id) => api.delete(`/vets/${id}`);

//
// 📅 VISIT/APPOINTMENT SERVICES
//
export const getAllVisits = () => api.get("/visits");
export const getMyVisits = () => api.get("/visits/mine");
export const getVisitById = (id) => api.get(`/visits/${id}`);
export const createVisit = (visitData) => api.post("/visits", visitData);
export const updateVisit = (visitId, updatedVisit) => api.put(`/visits/${visitId}`, updatedVisit);
export const deleteVisit = (visitId) => api.delete(`/visits/${visitId}`);

export default api;
