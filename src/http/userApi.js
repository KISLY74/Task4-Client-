import { $authHost, $host } from ".";
import jwt_decode from "jwt-decode"

export const regin = async (email, password, name) => {
  const { data } = await $host.post('api/user/regin', { email, password, name });
  localStorage.setItem("token", data.token)
  return data
}
export const login = async (email, password) => {
  const { data } = await $authHost.post('api/user/login', { email, password });
  localStorage.setItem("token", data.token)
  localStorage.setItem("email", jwt_decode(data.token).email)
  return data
}
export const check = async () => {
  const { data } = await $authHost.get('api/user/auth');
  localStorage.setItem("token", data.token)
  localStorage.setItem("email", jwt_decode(data.token).email)
  return data
}
export const getUsers = async () => {
  const { data } = await $host.get('api/user/all');
  return data
}
export const getOneUser = async (email) => {
  const { data } = await $host.post('api/user/get', { email });
  return data
}
export const changeStatus = async (email, status) => {
  const { data } = await $host.put('api/user/change/status', { email, status });
  return data
}
export const getCountUsersStatus = async () => {
  const { data } = await $host.get('api/user/status');
  return data
}