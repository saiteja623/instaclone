import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import AppNav from "./Nav";
import Home from "./home";
import "./css/route.css";
import Profile from "./profile.jsx";
import UploadPost from "./uploadpost";
import FriendRequest from "./friendrequests";
import {
  BottomNavigation,
  Hidden,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
} from "@material-ui/core";
import BottomNav from "./bottomnav";
import { Context } from "./contextapi";
import PostImageFull from "./postimagefull";
import Register from "./register";
import { getToken } from "./common";

class Routing extends Component {
  state = {
    userimage: "",
  };
  componentDidMount = () => {};
  render() {
    return (
      <div>
        <Hidden xsDown>
          <Context>
            <Router basename={window.location.pathname || ""}>
              <Route
                path="/register"
                render={(props) =>
                  getToken() === null ? (
                    <Register {...props} />
                  ) : (
                    <Redirect push to="/" />
                  )
                }
              />
              <Route
                path="/"
                exact
                render={(props) =>
                  getToken() !== null ? (
                    <>
                      <AppNav />
                      <Home {...props} />
                    </>
                  ) : (
                    <Redirect push to="/register" />
                  )
                }
              />
              <Route
                path="/profile/:username"
                exact
                render={(props) =>
                  getToken() !== null ? (
                    <>
                      <AppNav />
                      <Profile key={props.match.params.username} {...props} />
                    </>
                  ) : (
                    <Redirect push to="/register" />
                  )
                }
              ></Route>
              <Route
                path="/otheruser/:username"
                exact
                render={(props) =>
                  getToken() !== null ? (
                    <>
                      <AppNav />
                      <Profile key={props.match.params.username} {...props} />
                    </>
                  ) : (
                    <Redirect push to="/register" />
                  )
                }
              ></Route>
              <Route
                path="/add-post"
                exact
                render={(props) =>
                  getToken() !== null ? (
                    <>
                      <AppNav />
                      <UploadPost {...props} />
                    </>
                  ) : (
                    <Redirect push to="/register" />
                  )
                }
              ></Route>
              <Route
                path="/friend-requests"
                exact
                render={(props) =>
                  getToken() !== null ? (
                    <>
                      <AppNav />
                      <FriendRequest {...props} />
                    </>
                  ) : (
                    <Redirect push to="/register" />
                  )
                }
              ></Route>{" "}
            </Router>
          </Context>
        </Hidden>

        <Hidden smUp>
          <Router basename={window.location.pathname || ""}>
            <Context>
              <Grid container direction="column">
                <Grid
                  item
                  xs={2}
                  style={{
                    position: "sticky",
                    minWidth: "100%",
                    zIndex: "100",
                  }}
                >
                  <AppNav />
                </Grid>

                <Route
                  path="/register"
                  render={(props) =>
                    getToken() === null ? (
                      <Register {...props} />
                    ) : (
                      <Redirect push to="/" />
                    )
                  }
                />
                <Route
                  path="/"
                  exact
                  render={(props) =>
                    getToken() !== null ? (
                      <>
                        <Grid
                          item
                          style={{
                            minWidth: "100%",
                            height: "80vh",
                            alignItems: "center",
                            overflow: "scroll",
                          }}
                        >
                          <Home {...props} />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          style={{
                            minWidth: "100%",
                            position: "fixed ",
                            bottom: 0,
                          }}
                        >
                          <BottomNav />
                        </Grid>
                      </>
                    ) : (
                      <Redirect push to="/register" />
                    )
                  }
                />
                <Route
                  path="/profile/:username"
                  exact
                  render={(props) =>
                    getToken() !== null ? (
                      <>
                        <Grid
                          item
                          style={{
                            minWidth: "100%",
                            height: "80vh",
                            alignItems: "center",
                            overflow: "scroll",
                          }}
                        >
                          <Profile
                            key={props.match.params.username}
                            {...props}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          style={{
                            minWidth: "100%",
                            position: "fixed ",
                            bottom: 0,
                          }}
                        >
                          <BottomNav />
                        </Grid>
                      </>
                    ) : (
                      <Redirect push to="/register" />
                    )
                  }
                ></Route>
                <Route
                  path="/otheruser/:username"
                  exact
                  render={(props) =>
                    getToken() !== null ? (
                      <>
                        <Grid
                          item
                          style={{
                            minWidth: "100%",
                            height: "80vh",
                            alignItems: "center",
                            overflow: "scroll",
                          }}
                        >
                          <Profile
                            key={props.match.params.username}
                            {...props}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          style={{
                            minWidth: "100%",
                            position: "fixed ",
                            bottom: 0,
                          }}
                        >
                          <BottomNav />
                        </Grid>
                      </>
                    ) : (
                      <Redirect push to="/register" />
                    )
                  }
                ></Route>
                <Route
                  path="/add-post"
                  exact
                  render={(props) =>
                    getToken() !== null ? (
                      <>
                        <Grid
                          item
                          style={{
                            minWidth: "100%",
                            height: "80vh",
                            alignItems: "center",
                            overflow: "scroll",
                          }}
                        >
                          <UploadPost {...props} />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          style={{
                            minWidth: "100%",
                            position: "fixed ",
                            bottom: 0,
                          }}
                        >
                          <BottomNav />
                        </Grid>
                      </>
                    ) : (
                      <Redirect push to="/register" />
                    )
                  }
                ></Route>
                <Route
                  path="/friend-requests"
                  exact
                  render={(props) =>
                    getToken() !== null ? (
                      <>
                        <Grid
                          item
                          style={{
                            minWidth: "100%",
                            height: "80vh",
                            alignItems: "center",
                            overflow: "scroll",
                          }}
                        >
                          <FriendRequest {...props} />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          style={{
                            minWidth: "100%",
                            position: "fixed ",
                            bottom: 0,
                          }}
                        >
                          <BottomNav />
                        </Grid>
                      </>
                    ) : (
                      <Redirect push to="/register" />
                    )
                  }
                ></Route>
              </Grid>
            </Context>
          </Router>
        </Hidden>
      </div>
    );
  }
}

export default Routing;
