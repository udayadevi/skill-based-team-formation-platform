import api from "./api";

export const createTeam = async (teamData) => {
  const response = await api.post("/teams/create", teamData);
  return response.data;
};

export const getAllTeams = async () => {
  const response = await api.get("/teams");
  return response.data;
};

export const joinTeam = async (id) => {
  const response = await api.put(`/teams/join/${id}`);
  return response.data;
};