import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { regin, login } from "../http/userApi";
import { useContext, useState } from "react";
import { Container, Card, Form, Button, Row } from "react-bootstrap"
import { Context } from "../index";
import { getOneUser } from "../http/userApi";

function Authorization() {
  const location = useLocation()
  const history = useNavigate()
  const isLogin = location.pathname === "/login"
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { user } = useContext(Context)
  const click = async () => {
    try {
      let res
      if (isLogin) {
        res = await login(email, password)
        let data = await getOneUser(email).then(data => data)
        localStorage.setItem("userName", data.name)
        if (data.status === "Block") {
          user.setIsBlock(true)
          user.setIsAuth(false)
        } else {
          user.setIsBlock(false)
          user.setIsAuth(true)
        }
        history("/users")
      } else {
        res = await regin(email, password, name)
      }
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? "Авторизация" : "Регистрация"}</h2>
        <Form className="d-flex flex-column">
          {!isLogin ? <Form.Control
            className="mt-3"
            placeholder="Имя пользователя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          /> : ""}
          <Form.Control
            className="mt-3"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control
            className="mt-3"
            placeholder="Введите пароль"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Row className="d-flex justify-content-between mt-3">
            {isLogin ? <div>Нет аккаунта?
              <NavLink style={{ textDecoration: "none" }} to="/regin"> Зарегистрируйтесь!</NavLink>
            </div> : <div>Есть аккаунт?
              <NavLink style={{ textDecoration: "none" }} to="/login"> Войдите!</NavLink>
            </div>}
            <Button className="mt-3" variant={"outline-success"} onClick={() => click()}>{isLogin ? "Войти" : "Зарегистрироваться"}</Button>
          </Row>
        </Form>
      </Card>
    </Container>
  );
}

export default Authorization;