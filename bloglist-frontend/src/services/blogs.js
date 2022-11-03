import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getConfig = () => {
  return { headers: { Authorization: token } };
};

const getAll = async () => {
  const request = await axios.get(baseUrl, getConfig());
  return request.data;
};

const create = async (newBlog) => {
  const request = await axios.post(baseUrl, newBlog, getConfig());
  return request.data;
};

const update = async (updatedObject, id) => {
  const request = await axios.put(`${baseUrl}/${id}`, updatedObject, getConfig());
  return request.data;
};

const remove = async (id) => {
  return await axios.delete(`${baseUrl}/${id}`, getConfig());
};

export default { getAll, create, update, remove, setToken };