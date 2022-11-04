import { Button, Form } from "react-bootstrap";

const LoginForm = ({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
}) => (
  <Form onSubmit={handleLogin}>
    <Form.Group className="mb-3">
      <Form.Label>Username</Form.Label>
      <Form.Control
        type="text"
        value={username}
        name="Username"
        id="username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Password</Form.Label>
      <Form.Control
        type="password"
        value={password}
        name="Password"
        id="password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </Form.Group>
    <Button variant="primary" type="submit" id="login-button">
      login
    </Button>
  </Form>
);

export default LoginForm;
