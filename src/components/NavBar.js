import { Button, Navbar } from "react-bootstrap"
import Nav from "react-bootstrap/Nav"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { Context } from "../index"

const NavBar = observer(() => {
  const history = useNavigate()
  const userName = localStorage.getItem("userName")
  const { user } = useContext(Context)
  const logOut = () => {
    user.setUser({})
    user.setIsAuth(false)
    user.setIsDelete(false)
    user.setIsBlock(false)
    history("/login")
    localStorage.clear()
  }
  return (
    <Navbar className="d-flex justify-content-between" style={{ paddingLeft: 15, paddingRight: 15 }
    } bg="dark" variant="dark" >
      < h4 style={{ color: 'white' }}> {userName && !user.isBlock && user.isAuth ? userName : ""}</h4 >
      {
        user.isAuth ? <Nav className="ml-auto" style={{ color: 'white' }
        } >
          <Button variant={"outline-light"} onClick={() => logOut()}>Выйти</Button>
        </Nav > :
          <Nav style={{ color: 'white' }}>
            <Button variant={"outline-light"} onClick={() => history("/login")} >Авторизация</Button>
          </Nav>
      }
    </Navbar >
  )
})

export default NavBar