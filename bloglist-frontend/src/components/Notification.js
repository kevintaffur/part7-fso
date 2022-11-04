import { Alert } from "react-bootstrap";
import { useSelector } from "react-redux";

const Notification = () => {
  const { message, type } = useSelector((state) => state.notification);

  if (message === null && type === null) {
    return null;
  }
  return (
    <div className="container">
      <Alert variant={type}>{message}</Alert>
    </div>
  );
};

export default Notification;
