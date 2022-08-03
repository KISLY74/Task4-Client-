import { $authHost, $host } from ".";

export const regin = async (email, password, name) => {
  const { data } = await $host.post('api/user/regin', { email, password, name });
  localStorage.setItem("token", data.token)
  return data
}
export const login = async (email, password) => {
  const { data } = await $authHost.post('api/user/login', { email, password });
  localStorage.setItem("token", data.token)
  return data
}
export const check = async () => {
  const { data } = await $authHost.get('api/user/auth');
  localStorage.setItem("token", data.token)
  return data
}
export const getUsers = async () => {
  const { data } = await $host.get('api/user/all');
  return data
}