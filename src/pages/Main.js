import { Button, ButtonGroup, Form, Table, ProgressBar, Spinner } from 'react-bootstrap';
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Context } from "../index";
import { getUsers, getOneUser, changeStatus, getCountUsersStatus } from '../http/userApi';
import { useNavigate } from 'react-router-dom';

const Main = observer(() => {
  const history = useNavigate()
  const { user } = useContext(Context)
  const [users, setUsers] = useState([])
  const [usersValues, setUsersValues] = useState([])
  const [headers, setHeaders] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [usersStatus, setUsersStatus] = useState({})
  let checkboxes = []
  console.log(user)
  document.querySelectorAll(".checkbox").forEach(e => checkboxes.push(e.firstChild))
  const checkUserStatus = async () => {
    let data = await getOneUser(localStorage.getItem("email")).then(data => data)
    if (!data) {
      user.setIsAuth(false)
      user.setIsDelete(true)
      history("/regin")
    } else if (data.status === "Block") {
      user.setIsAuth(false)
      user.setIsBlock(true)
      history("/login")
    } else {
      user.setIsAuth(true)
      user.setIsDelete(false)
      user.setIsBlock(false)
    }
  }
  const updateTableUsers = async () => {
    setLoading(false)
    try {
      let res = await getUsers().finally(() => setLoading(true))
      setUsers(res)
      setUsersValues(res.map(e => Object.values(e)))
      setHeaders(Object.keys(res[0]))
    } catch (e) {
      console.log(e)
    }
    return users
  }
  const updateProgressBar = async () => {
    let countsObj = await getCountUsersStatus()
    setUsersStatus(countsObj)
  }
  useEffect(() => {
    setLoading(false)
    updateTableUsers()
    checkUserStatus()
    updateProgressBar()
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
    checkUserStatus().then(() => {
      checkboxes.map(async (e, i) => {
        if (checkboxes[i].checked && users[i].status !== "Delete") {
          await changeStatus(users[i].id, event.target.textContent).finally(() => setLoading(true))
          checkboxes[i].checked = false
          document.querySelector(".checkbox-all").firstChild.checked = false
          updateTableUsers()
          updateProgressBar()
          setNoneCheckBoxes()
        }
      })
    })
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
    <div>
      {user.isAuth ?
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
            {isLoading ? "" : <Button className="d-flex justify-content-center" variant="dark">
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Loading...
            </Button>}
          </ButtonGroup>
          <Table className="mt-3" striped bordered hover variant="dark">
            <thead>
              <tr>
                <th className="d-flex">
                  <Form.Check className="checkbox-all" aria-label="option 1" onClick={() => handleClickCheckboxAll()} />
                  SelectAll/Unselected
                </th>
                {headers ? headers.map((e, i) => (i !== 2) ? <th>{`${e}`}</th> : "") : ""}
              </tr>
            </thead>
            <tbody>
              {usersValues ? usersValues.map((el, ind) => el ? <tr key={ind}><td><Form.Check onClick={() => handleClickCheckbox()} className="checkbox" key={ind} /></td>{el.map((e, i) => (i !== 2) ? <td key={i}>{`${e}`}</td> : '')}</tr> : '') : ''}
            </tbody>
          </Table >
        </div > : ""}
    </div >)
})

export default Main;