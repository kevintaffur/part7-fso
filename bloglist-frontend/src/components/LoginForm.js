const LoginForm = ({ username, setUsername, password, setPassword, handleLogin }) => (
  <form onSubmit={handleLogin}>
    username: <input
      type="text"
      value={username}
      name="Username"
      id="username"
      onChange={({ target }) => setUsername(target.value)}
    />
    <br />
    password: <input
      type="password"
      value={password}
      name="Password"
      id="password"
      onChange={({ target }) => setPassword(target.value)}
    />
    <br />
    <button type="submit" id="login-button">login</button>
  </form>
);

export default LoginForm;