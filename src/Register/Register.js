import React from 'react';
import './Register.css';
import * as B from 'bootstrap';
import { Redirect } from 'react-router-dom';
import SecondaryHeader from '../SecondaryHeader/SecondaryHeader';

class Register extends React.Component {
  constructor() {
    super();

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
    this.register = this.register.bind(this);
    this.changeRegistrationStatus = this.changeRegistrationStatus.bind(this);

    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      emailValidationState: '',
      passwordValidationState: '',
      confirmPasswordValidationState: '',
      isRegistered: false,
    };
  }

  getValidationStateForEmail() {
    const { email } = this.state;
    if (email.indexOf('@') > -1) {
      this.setState({ emailValidationState: 'success' });
    } else {
      this.setState({ emailValidationState: 'error' });
    }
  }

  getValidationStateForPassword() {
    const { password } = this.state;
    const { length } = password;
    if (length > 7) {
      this.setState({ passwordValidationState: 'success' });
    } else {
      this.setState({ passwordValidationState: 'error' });
    }
  }

  getValidationStateForConfirmPassword() {
    const { password } = this.state;
    const { confirmPassword } = this.state;
    if (password === confirmPassword && confirmPassword.length > 0) {
      this.setState({ confirmPasswordValidationState: 'success' });
    } else {
      this.setState({ confirmPasswordValidationState: 'error' });
    }
  }

  getValidationState(type) {
    if (type === 'email') {
      this.getValidationStateForEmail();
    } else {
      this.getValidationStateForPassword();
      this.getValidationStateForConfirmPassword();
    }
  }

  callAPI = (content, callback) => {
    const Http = new XMLHttpRequest();
    const url = 'http://localhost:8080/register';
    Http.open('POST', url);
    Http.onreadystatechange = function () {
      if (Http.readyState === XMLHttpRequest.DONE) {
        callback(Http.response);
      }
    };
    Http.setRequestHeader('Content-Type', 'application/json');
    Http.send(content);
  }

  changeRegistrationStatus(status) {
    if (status === 'true') {
      this.setState({
        isRegistered: true,
      });
    }
  }

  register() {
    const {
      email, password, emailValidationState,
      passwordValidationState, confirmPasswordValidationState,
    } = this.state;
    if (emailValidationState === 'success'
      && passwordValidationState === 'success'
      && confirmPasswordValidationState === 'success') {
      const jsonBody = JSON.stringify({ email, password });
      this.callAPI(jsonBody, this.changeRegistrationStatus);
    }
    this.getValidationState('email');
    this.getValidationState('password');
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value },
      () => this.getValidationState('email'));
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value },
      () => this.getValidationState('password'));
  }

  handleConfirmPasswordChange(e) {
    this.setState({ confirmPassword: e.target.value },
      () => this.getValidationState('confirmPassword'));
  }

  render() {
    const {
      emailValidationState, value, passwordValidationState,
      confirmPasswordValidationState, isRegistered,
    } = this.state;
    return (
      <div>
        <SecondaryHeader />
        <div className="register-content">
          <h2 className="register-heading">Register</h2>
          <br />
          <form className="form-register">
            <B.FormGroup
              controlId="formBasicText"
              validationState={emailValidationState}
            >
              <B.FormControl
                type="text"
                value={value}
                placeholder="Email"
                onChange={this.handleEmailChange}
              />
              <B.FormControl.Feedback />
            </B.FormGroup>
          </form>
          <form>
            <B.FormGroup
              controlId="formBasicText"
              validationState={passwordValidationState}
            >
              <B.FormControl
                type="password"
                value={value}
                placeholder="Password"
                onChange={this.handlePasswordChange}
              />
              <B.FormControl.Feedback />
              <B.HelpBlock>Password must be atlest 8 characters long.</B.HelpBlock>
            </B.FormGroup>
          </form>
          <form>
            <B.FormGroup
              controlId="formBasicText"
              validationState={confirmPasswordValidationState}
            >
              <B.FormControl
                type="password"
                value={value}
                placeholder="Confirm Password"
                onChange={this.handleConfirmPasswordChange}
              />
              <B.FormControl.Feedback />
              <B.HelpBlock>Password must match.</B.HelpBlock>
            </B.FormGroup>
          </form>
          <B.Button
            bsStyle="primary"
            onClick={this.register}
          >
            Register
          </B.Button>
        </div>
        {isRegistered ? <Redirect to="/login" /> : <div />}
      </div>
    );
  }
}

export default Register;
