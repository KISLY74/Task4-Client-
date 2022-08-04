import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Context } from "./index";
import NavBar from "./components/NavBar"
import { check } from "./http/userApi";
import { Spinner } from "react-bootstrap";
import { BrowserRouter } from 'react-router-dom';
import AppRouter from "./components/AppRouter";

const App = observer(() => {
  const { user } = useContext(Context)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    check().then(data => {
      if (user.isBlock || user.isDelete) {
        user.setIsAuth(false)
        user.setUser({})
      } else {
        user.setIsAuth(true)
        user.setUser(true)
      }
    }).catch(e => console.log(e)).finally(() => { setLoading(false) })
  }, [])

  if (loading) {
    return <Spinner className="position-absolute top-50 start-50" animation="border" />
  }

  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter >
  );
})

export default App;