import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { regin, login, changeDateLogin } from "../http/userApi";
import { useContext, useState } from "react";
import { Container, Card, Form, Button, Row, Spinner } from "react-bootstrap"
import { Context } from "../index";
import { getOneUser } from "../http/userApi";

function Authorization() {
  const location = useLocation()
  const history = useNavigate()
  const isLogin = location.pathname === "/login"
  const isRegin = location.pathname === "/regin"
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { user } = useContext(Context)
  const [isLoading, setLoading] = useState(true)
  const handleClickBtn = async () => {
    setLoading(false)
    try {
      let res
      if (isLogin) {
        let data
        res = await login(email, password).then(async () => {
          await changeDateLogin(localStorage.getItem("id"))
          data = await getOneUser(email).then(data => data)
          if (!data) alert("Пользователь удалён!")
        }).catch((err) => alert(err.response.data.message)).finally(() => setLoading(true))
        if (data) {
          localStorage.setItem("userName", data.name)
          if (data.status === "Block") {
            user.setIsBlock(true)
            user.setIsAuth(false)
            history("/login")
            alert("Пользователь заблокирован!")
          } else if (data.status === "Delete") {
            user.setIsDelete(true)
            user.setIsAuth(false)
            history("/login")
            alert("Пользователь удалён!")
          } else {
            user.setIsBlock(false)
            user.setIsDelete(false)
            user.setIsAuth(true)
            history("/users")
          }
        }
      } else if (isRegin) {
        let res = await regin(email, password, name).then(() => history("/login")).catch((err) => alert(err.response.data.message)).finally(() => setLoading(true))
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
            <Button className="mt-3" variant={"outline-success"} onClick={() => handleClickBtn()}>{isLogin ? "Войти" : "Зарегистрироваться"}</Button>
          </Row>
        </Form>
        {isLoading ? "" : <Button className="mt-3 d-flex justify-content-center" variant="dark">
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Loading...
        </Button>}
      </Card>
    </Container>
  );
}

export default Authorization;