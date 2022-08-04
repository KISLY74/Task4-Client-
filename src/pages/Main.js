import { Button, ButtonGroup, Form, Table, ProgressBar, Spinner } from 'react-bootstrap';
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Context } from "../index";
import { getUsers, getOneUser, changeStatus, getCountUsersStatus } from '../http/userApi';
import { useNavigate } from 'react-router-dom';

const Main = observer(() => {
  const { user } = useContext(Context)
  const [users, setUsers] = useState([])
  const [usersValues, setUsersValues] = useState([])
  const [headers, setHeaders] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [usersStatus, setUsersStatus] = useState({})
  let checkboxes = []
  document.querySelectorAll(".checkbox").forEach(e => checkboxes.push(e.firstChild))
  const call = async () => {
    try {
      let res = await getUsers().finally(() => setLoading(true))
      setUsers(res)
      setUsersValues(res.map(e => Object.values(e)))
      setHeaders(Object.keys(res[0]))
    } catch (e) {
      console.log(e)
    }
    let data = await getOneUser(localStorage.getItem("email")).then(data => data)
    if (!data) {
      user.setIsAuth(false)
      user.setIsDelete(true)
    } else if (data.status === "Block") {
      user.setIsAuth(false)
      user.setIsBlock(true)
    } else {
      user.setIsAuth(true)
      user.setIsBlock(false)
    }
    let countsObj = await getCountUsersStatus()
    setUsersStatus(countsObj)
    return users
  }
  useEffect(() => {
    setLoading(false)
    call()
  }, [])
  const setNoneCheckBoxes = () => {
    users.map((e, i) => {
      if (e.status === "Delete" && checkboxes[i]) {
        checkboxes[i].style.display = "none"
      }
    })
  }
  setNoneCheckBoxes()
  const handleClickChangeStatus = (event) => {
    checkboxes.map(async (e, i) => {
      if (checkboxes[i].checked && users[i].status !== "Delete") {
        await changeStatus(users[i].id, event.target.textContent).finally(() => setLoading(true))
        checkboxes[i].checked = false
        document.querySelector(".checkbox-all").firstChild.checked = false
        call()
      }
    })
    setNoneCheckBoxes()
  }
  const handleClickCheckboxAll = () => {
    if (document.querySelector(".checkbox-all").firstChild.checked) {
      checkboxes.map(e => e.checked = true)
    } else {
      checkboxes.map(e => e.checked = false)
    }
  }
  const handleClickCheckbox = () => {
    if (checkboxes.every(e => e.checked)) {
      document.querySelector(".checkbox-all").firstChild.checked = true
    } else {
      document.querySelector(".checkbox-all").firstChild.checked = false
    }
  }
  return (
    user.isAuth ?
      <div>
        <ProgressBar className="mt-5">
          <ProgressBar striped variant="success" now={usersStatus.unblock * 100 / users.length} key={1} label="Unblock" />
          <ProgressBar variant="warning" now={usersStatus.block * 100 / users.length} key={2} label="Block" />
          <ProgressBar striped variant="danger" now={usersStatus.delete * 100 / users.length} key={3} label="Delete" />
        </ProgressBar>
        <ButtonGroup className="mt-3" aria-label="Basic example" onClick={(e) => handleClickChangeStatus(e)}>
          <Button variant="success">Unblock</Button>
          <Button variant="warning">Block</Button>
          <Button variant="danger">Delete</Button>
        </ButtonGroup >
        {isLoading ? <Table className="mt-3" striped bordered hover variant="dark">
          <thead>
            <tr>
              <th className="d-flex">
                <Form.Check className="checkbox-all" aria-label="option 1" onClick={() => handleClickCheckboxAll()} />
                SelectAll/Unselected
              </th>
              {headers ? headers.map((e, i) => (i !== 2 && i !== 7 && i !== 8) ? <th>{`${e}`}</th> : "") : ""}
            </tr>
          </thead>
          <tbody>
            {usersValues ? usersValues.map((el, ind) => el ? <tr key={ind}><td><Form.Check onClick={() => handleClickCheckbox()} className="checkbox" key={ind} /></td>{el.map((e, i) => (i !== 2 && i !== 7 && i !== 8) ? <td key={i}>{`${e}`}</td> : '')}</tr> : '') : ''}
          </tbody>
        </Table > : <Spinner className="position-absolute top-50 start-50" animation="border" />}
      </div > : <h1 className="d-flex justify-content-center">{user.isDelete ? `Пользователь ${localStorage.getItem("userName")} удалён` : user.isBlock ? `Пользователь ${localStorage.getItem("userName")} заблокирован!` : "Для управления пользователями необходимо авторизоваться"}</h1>);
})

export default Main;