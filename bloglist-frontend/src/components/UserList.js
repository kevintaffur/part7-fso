import { Table } from "react-bootstrap";
import User from "./User";

const UserList = ({ users }) => (
  <>
    <h2>Users</h2>
    <Table striped bordered hover>
      <tbody>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
        {users.map((user) => (
          <User key={user.id} user={user} />
        ))}
      </tbody>
    </Table>
  </>
);

export default UserList;
