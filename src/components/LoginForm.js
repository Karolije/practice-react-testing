import React from "react";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: {
        value: "",
        error: "",
      },
      password: {
        value: "",
        error: "",
      },
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  checkValue(value) {
    if (value.length <= 3) {
      throw new Error("The field is too short!");
    }
  }

  handleChange = (e) => {
    const { name: field, value } = e.target;

    if (typeof this.state[field] !== "undefined") {
      try {
        this.checkValue(value);
        this.setState({
          [field]: {
            value,
            error: "",
          },
        });
      } catch (err) {
        this.setState({
          [field]: {
            value,
            error: err.message,
          },
        });
      }
    }
  };

  throwError() {
    throw new Error("Incorrect data!");
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { tryAuth } = this.props;
    const { login, password } = this.state;

    const authResp = tryAuth(login.value, password.value);

    if (typeof authResp.then === "function") {
      authResp.catch(() => this.setState({ hasError: true }));
    } else if (!authResp) {
      this.setState({ hasError: true });
    }
  };

  render() {
    const { login, password, hasError } = this.state;

    if (hasError) {
      return <h1>Incorrect data.</h1>;
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <p>
          <label>
            login:
            <input
              name="login"
              value={login.value}
              onChange={this.handleChange}
            />
            {login.error && <strong>{login.error}</strong>}
          </label>
        </p>
        <p>
          <label>
            password:
            <input
              name="password"
              value={password.value}
              onChange={this.handleChange}
            />
            {password.error && <strong>{password.error}</strong>}
          </label>
        </p>
        <p>
          <button>send</button>
        </p>
      </form>
    );
  }
}

export default LoginForm;
