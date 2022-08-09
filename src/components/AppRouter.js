import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Main from '../pages/Main';
import Authorization from '../pages/Authorization';
import { useContext } from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';

const AppRouter = observer(() => {
  const user = useContext(Context)
  const history = useNavigate()
  if (user.isAuth === false) history("/login")
  return (
    <Routes>
      <Route path="regin" element={<Authorization />} />
      <Route path="login" element={<Authorization />} />
      <Route path="users" element={<Main />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
})

export default AppRouter