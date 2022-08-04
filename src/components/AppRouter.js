import { Route, Routes, Navigate } from 'react-router-dom';
import Main from '../pages/Main';
import Authorization from '../pages/Authorization';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="regin" element={<Authorization />} />
      <Route path="login" element={<Authorization />} />
      <Route path="users" element={<Main />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default AppRouter