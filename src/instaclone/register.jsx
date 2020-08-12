import React, { Component } from "react";
import {
  TextField,
  Paper,
  Button,
  Collapse,
  Typography,
  Grid,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Hidden,
  IconButton,
} from "@material-ui/core";
import Favorite from "@material-ui/icons/Favorite";
import { Alert } from "@material-ui/lab";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Redirect, Link, withRouter } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { ContextApi } from "./contextapi";
import { setToken } from "./common";
import { AccountCircle, Lock } from "@material-ui/icons";
import SaveIcon from "@material-ui/icons/Save";
import "./css/route.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.usernameRef = new React.createRef();
    this.emailRef = new React.createRef();
    this.pass1Ref = new React.createRef();
    this.pass2Ref = new React.createRef();
    this.otpRef = new React.createRef();
    this.recoverusernameRef = new React.createRef();
    this.newOTPRef = new React.createRef();
    this.newpassRef = new React.createRef();
  }
  state = {
    isopen: false,
    msg: "",
    showpassword1: false,
    showpassword2: false,
    isopen2: false,
    showpassword3: false,
    isopen3: false,
    activestep: 1,
    username: "",
    password: "",
    registerusername: "",
    pass1: "",
    pass2: "",
    email: "",
    registerstep: 0,
    otp: "",
    loginstep: 0,
    newotp: "",
    recoverusername: "",
  };
  registerUser = () => {
    if (this.pass1Ref.current.value !== this.pass2Ref.current.value) {
      this.setState({ msg: "passwords donot match", isopen: true });
    } else {
      var body = {
        username: this.usernameRef.current.value.toLowerCase(),
        email: this.state.email,
        password: this.pass1Ref.current.value,
      };
      var xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://saiteja0413.pythonanywhere.com/api/register_user`,
        true
      );
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var res = JSON.parse(xhr.responseText);
          console.log(res);
          if (res["status"]["type"] == "success") {
            this.setState({ msg: "Successfully registered", isopen2: true });
            this.setState({ activestep: 1 });
          } else {
            this.setState({
              msg: "A user with username already exists",
              isopen: true,
            });
          }
        }
      };
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send(JSON.stringify(body));
    }
    this.disappearAlert();
  };
  loginuser = () => {
    var xhr = new XMLHttpRequest();
    var body = {
      username: this.state.username,
      password: this.state.password,
    };

    xhr.open("POST", `https://saiteja0413.pythonanywhere.com/api/login1`, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        setToken(res["token"], this.state.username.toLowerCase());
        this.props.history.push("/");
      } else if (xhr.readyState == 4 && xhr.status == 400) {
        this.setState({ msg: "invalid username or password", isopen3: true });
        this.disappearAlert();
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(body));
  };

  disappearAlert = () => {
    setTimeout(() => {
      this.setState({ isopen: false, isopen2: false, isopen3: false });
    }, 3000);
  };

  changetoLogin = () => {
    this.setState({ activestep: 1 });
  };
  changetoSignUp = () => {
    this.setState({ activestep: 0 });
  };
  checkEmail = () => {
    if (!this.emailRef.current.value.includes("@gmail.com")) {
      this.setState({ msg: "Incorrect Email", isopen: true });
    } else {
      this.setState({ registerstep: 1 });
      var xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        `https://saiteja0413.pythonanywhere.com/api/send_otp${this.emailRef.current.value}`,
        true
      );
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var res = JSON.parse(xhr.responseText);

          this.setState({ otp: res["otp"] });
        }
      };
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send();
    }
    this.disappearAlert();
  };
  verifyOTP = () => {
    if (this.otpRef.current.value !== this.state.otp) {
      this.setState({ msg: "Incorrect OTP", isopen: true });
    } else {
      this.setState({ registerstep: 2 });
    }
    this.disappearAlert();
  };

  //send otp during recover
  sendOTP = () => {
    var xhr = new XMLHttpRequest();
    this.setState({ recoverusername: this.recoverusernameRef.current.value });
    xhr.open(
      "GET",
      `https://saiteja0413.pythonanywhere.com/api/recover_otp${this.recoverusernameRef.current.value}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        if (res["status"] == "error") {
          this.setState({ msg: "No user exists", isopen3: true });
        } else {
          this.setState({ newotp: res["otp"] });
          this.setState({ loginstep: 2 });
        }
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
    this.disappearAlert();
  };

  //verify the recover otp sent
  verifyrecoverOTP = () => {
    if (this.state.newotp !== this.newOTPRef.current.value) {
      this.setState({ msg: "Incorrect OTP", isopen3: true });
    } else {
      this.setState({ loginstep: 3 });
    }
    this.disappearAlert();
  };
  changepassword = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/reset_pass${this.state.recoverusername}/${this.newpassRef.current.value}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
  };
  render() {
    return (
      <Grid container justify="flex-start" alignItems="center">
        <Grid item xs={12} sm={5} className="text-grid">
          <div className="textwrapper">
            <br />
            <SwipeableViews
              index={this.state.activestep}
              className="text-swipable"
              enableMouseEvents
              axis={"y"}
              slideCount={2}
              animateHeight
            >
              <div className="div1">
                <Typography variant="h4" component="h4">
                  Hello Friend,
                </Typography>
                <Typography variant="body1" component="p">
                  Enter your personal details and start exploring new Friends
                </Typography>
              </div>
              <div className="div2">
                <Typography variant="h4">Welcome Back!</Typography>
                <Typography variant="body1">
                  To keep connected with us please Login with your credentials
                </Typography>
              </div>
            </SwipeableViews>
          </div>
        </Grid>
        <Grid item xs={12} sm className="grid2">
          <div className="wrapper">
            <Hidden xsDown>
              <div className="title">Instagram</div>
            </Hidden>
            <SwipeableViews
              index={this.state.activestep}
              enableMouseEvents
              className="swipable"
            >
              <Paper
                style={{
                  padding: "14px",

                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="register-paper"
              >
                <div className="register-title">sign up</div>
                <Stepper
                  activeStep={this.state.registerstep}
                  alternativeLabel
                  style={{
                    padding: 0,
                  }}
                >
                  <Step style={{ fontSize: "0.3rem" }}>
                    <StepLabel>Email</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>verification</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>submit</StepLabel>
                  </Step>
                </Stepper>
                <Collapse in={this.state.isopen} style={{ margin: "10px 0px" }}>
                  <Alert
                    severity="error"
                    variant="filled"
                    style={{ padding: "0 10px" }}
                  >
                    <Typography variant="body2"> {this.state.msg}</Typography>
                  </Alert>
                </Collapse>
                <Collapse
                  in={this.state.isopen2}
                  style={{ margin: "10px 0px" }}
                >
                  <Alert
                    severity="success"
                    variant="filled"
                    style={{ padding: "0px 10px" }}
                  >
                    <Typography variant="body2"> {this.state.msg}</Typography>
                  </Alert>
                </Collapse>
                {this.state.registerstep === 0 && (
                  <TextField
                    size="small"
                    variant="filled"
                    required
                    value={this.state.email}
                    label="email"
                    onChange={(e) => {
                      this.setState({ email: e.target.value });
                    }}
                    inputRef={this.emailRef}
                  />
                )}
                {this.state.registerstep === 1 && (
                  <TextField
                    label="OTP"
                    inputRef={this.otpRef}
                    ssize="small"
                    variant="filled"
                  />
                )}
                {this.state.registerstep === 2 && (
                  <>
                    <TextField
                      size="small"
                      variant="filled"
                      required
                      label="username"
                      value={this.state.registerusername}
                      onChange={(e) => {
                        this.setState({ registerusername: e.target.value });
                      }}
                      inputRef={this.usernameRef}
                      style={{
                        margin: "4px auto",
                        width: "80%",
                        padding: 0,
                        fontSize: "0.3rem",
                      }}
                    />
                    <TextField
                      size="small"
                      type={this.state.showpassword1 ? "text" : "password"}
                      required
                      value={this.state.pass1}
                      variant="filled"
                      onChange={(e) => {
                        this.setState({ pass1: e.target.value });
                      }}
                      label="password"
                      inputRef={this.pass1Ref}
                      style={{ margin: "4px auto" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              disableRipple
                              onClick={() => {
                                this.setState({
                                  showpassword1: !this.state.showpassword1,
                                });
                              }}
                            >
                              {this.state.showpassword1 ? (
                                <Visibility size="small" />
                              ) : (
                                <VisibilityOff size="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      size="small"
                      type={this.state.showpassword2 ? "text" : "password"}
                      required
                      label="password2"
                      inputRef={this.pass2Ref}
                      value={this.state.pass2}
                      variant="filled"
                      style={{
                        margin: "4px auto",
                        marginLeft: "auto",
                      }}
                      onChange={(e) => {
                        this.setState({ pass2: e.target.value });
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              disableRipple
                              onClick={() => {
                                this.setState({
                                  showpassword2: !this.state.showpassword2,
                                });
                              }}
                            >
                              {this.state.showpassword2 ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />{" "}
                  </>
                )}
                <br />
                <br />
                {this.state.registerstep !== 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      this.setState({
                        registerstep: this.state.registerstep - 1,
                      });
                    }}
                  >
                    Back
                  </Button>
                )}
                {this.state.registerstep === 0 && (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      this.checkEmail();
                    }}
                  >
                    submit
                  </Button>
                )}
                {this.state.registerstep == 1 && (
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                      this.verifyOTP();
                    }}
                  >
                    Verify
                  </Button>
                )}
                {this.state.registerstep === 2 && (
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                      this.registerUser();
                    }}
                    disabled={
                      this.state.registerusername === "" ||
                      this.state.pass1 === "" ||
                      this.state.pass2 === ""
                    }
                  >
                    Sign Up
                  </Button>
                )}
                <br />
                <br />
                <Typography variant="body2" component="p">
                  Already have an Account?{" "}
                  <span
                    onClick={() => {
                      this.changetoLogin();
                    }}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    <b> login </b>{" "}
                  </span>
                </Typography>
                <br />
              </Paper>
              <div className="paper2">
                <Paper className="paper2-form">
                  <div className="login-title">Login</div>
                  <Collapse
                    in={this.state.isopen3}
                    style={{ margin: "10px 0px" }}
                  >
                    <Alert
                      severity="error"
                      variant="filled"
                      style={{ padding: "0px 10px" }}
                    >
                      <Typography variant="body2"> {this.state.msg}</Typography>
                    </Alert>
                  </Collapse>
                  <div className="paper2-inputs">
                    {this.state.loginstep == 0 && (
                      <>
                        <Grid
                          container
                          spacing={1}
                          alignContent="center"
                          justify="center"
                          alignItems="flex-end"
                        >
                          <Grid item xs={2}>
                            <AccountCircle size="small" />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              size="small"
                              required
                              label="username"
                              onChange={(e) => {
                                this.setState({ username: e.target.value });
                              }}
                              style={{ margin: "4px auto", width: "100%" }}
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          spacing={2}
                          alignContent="center"
                          justify="center"
                          alignItems="flex-end"
                        >
                          <Grid item xs={2}>
                            <Lock size="small" />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              size="small"
                              type={
                                this.state.showpassword3 ? "text" : "password"
                              }
                              required
                              label="password"
                              onChange={(e) => {
                                this.setState({ password: e.target.value });
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      disableRipple
                                      onClick={() => {
                                        this.setState({
                                          showpassword3: !this.state
                                            .showpassword3,
                                        });
                                      }}
                                    >
                                      {this.state.showpassword3 ? (
                                        <Visibility size="small" />
                                      ) : (
                                        <VisibilityOff size="small" />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>
                        <br />
                        <Typography
                          variant="subtitle2"
                          onClick={() => {
                            this.setState({ loginstep: 1 });
                          }}
                          style={{ cursor: "pointer", fontWeight: "bold" }}
                        >
                          Forgot password?
                        </Typography>
                      </>
                    )}
                    {this.state.loginstep == 1 && (
                      <>
                        <TextField
                          inputRef={this.recoverusernameRef}
                          variant="outlined"
                          label="Username"
                          size="small"
                        />
                        <br />
                        <br />
                        <Button
                          onClick={() => {
                            this.setState({ loginstep: 0 });
                          }}
                          variant="outlined"
                          size="small"
                          color="secondary"
                        >
                          {" "}
                          Cancel{" "}
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            this.sendOTP();
                          }}
                          color="primary"
                        >
                          Submit
                        </Button>
                      </>
                    )}
                    {this.state.loginstep === 2 && (
                      <>
                        <TextField
                          variant="outlined"
                          size="small"
                          inputRef={this.newOTPRef}
                          label="OTP"
                          helperText="Enter the OTP we have sent to your Gmail"
                        />
                        <br />
                        <br />
                        <Button
                          onClick={() => {
                            this.setState({ loginstep: 0 });
                          }}
                          variant="outlined"
                          size="small"
                          color="secondary"
                        >
                          {" "}
                          Cancel{" "}
                        </Button>
                        <Button
                          color="primary"
                          variant="contained"
                          size="small"
                          onClick={() => {
                            this.verifyrecoverOTP();
                          }}
                        >
                          verify
                        </Button>
                      </>
                    )}

                    {this.state.loginstep === 3 && (
                      <>
                        <TextField
                          type="password"
                          inputRef={this.newpassRef}
                          size="small"
                          variant="contained"
                          label="New Password"
                        />
                        <br />
                        <br />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            this.changepassword();
                            this.setState({ loginstep: 0 });
                          }}
                          color="primary"
                        >
                          confirm{" "}
                        </Button>
                      </>
                    )}
                  </div>

                  <br />
                  <Typography variant="body2">
                    Don't have an account? No problem,{" "}
                    <b>
                      <span
                        onClick={() => {
                          this.changetoSignUp();
                        }}
                        style={{ color: "blue", cursor: "pointer" }}
                      >
                        signup!
                      </span>
                    </b>
                  </Typography>
                  <br />
                  {this.state.loginstep === 0 && (
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => {
                        this.loginuser();
                      }}
                      disabled={
                        this.state.username === "" || this.state.password === ""
                      }
                    >
                      login
                    </Button>
                  )}
                </Paper>
              </div>
            </SwipeableViews>
          </div>
          <Typography className="love-by-saiteja" variant="body1">
            Made with <Favorite fontSize="small" color="secondary" /> by Saiteja
            Balla
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(Register);
