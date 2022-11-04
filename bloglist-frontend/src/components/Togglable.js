import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

const Togglable = ({ buttonLabel, children }) => {
  const [visible, setVisible] = useState(false);
  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button variant="primary" id="create-blog" onClick={toggleVisibility}>
          {buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <Button
          variant="secondary"
          id="cancel-create-blog"
          onClick={toggleVisibility}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
