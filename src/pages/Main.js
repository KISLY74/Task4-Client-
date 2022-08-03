import ProgressBar from 'react-bootstrap/ProgressBar';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { Table } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { Context } from "../index";
import { getUsers } from "../http/userApi";

const Main = observer(() => {
  const { user } = useContext(Context)
  const [users, setUsers] = useState([])
  const [headers, setHeaders] = useState([])
  const call = async () => {
    try {
      let res = await getUsers()
      setUsers(res.map(e => Object.values(e)))
      setHeaders(Object.keys(res[0]))
    } catch (e) {
      console.log(e)
    }
  }
  call()
  return (
    user.isAuth ?
      <div>
        <ProgressBar className="mt-5">
          <ProgressBar striped variant="success" now={35} key={1} label="Unblock" />
          <ProgressBar variant="warning" now={20} key={2} label="Block" />
          <ProgressBar striped variant="danger" now={10} key={3} label="Delete" />
        </ProgressBar>
        <Table className="mt-5" striped bordered hover variant="dark">
          <thead>
            <tr>
              <th className="d-flex">
                <Form.Check aria-label="option 1" />
                Select all
              </th>
              {headers ? headers.map((e, i) => (i !== 2 && i !== 7 && i !== 8) ? <th>{`${e}`}</th> : "") : ""}
            </tr>
          </thead>
          <tbody>
            {users ? users.map((el, ind) => el ? <tr key={ind}><td><Form.Check key={ind} /></td>{el.map((e, i) => (i !== 2 && i !== 7 && i !== 8) ? <td key={i}>{`${e}`}</td> : '')}</tr> : '') : ''}
          </tbody>
        </Table >
        <ButtonGroup className="d-flex" aria-label="Basic example">
          <Button variant="success">Unblock</Button>
          <Button variant="warning">Block</Button>
          <Button variant="danger">Delete</Button>
        </ButtonGroup >
      </div > : <h1 className="d-flex justify-content-center">Для управления пользователями необходимо авторизоваться</h1>);
})

export default Main;