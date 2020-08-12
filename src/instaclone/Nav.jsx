import React, { Component } from "react";
import {
  AppBar,
  Toolbar,
  Grid,
  Typography,
  Hidden,
  Avatar,
  IconButton,
  TextField,
  Tooltip,
  ButtonGroup,
  InputAdornment,
  Divider,
  Button,
  Badge,
  CardHeader,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import AddBoxIcon from "@material-ui/icons/AddBox";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Link, Redirect, withRouter } from "react-router-dom";
import GroupIcon from "@material-ui/icons/Group";
import { ContextApi } from "./contextapi";
import "./css/profile.css";
import SearchIcon from "@material-ui/icons/Search";
import UnfriendAlert from "./unfriendalert";
import "./css/route.css";
import CloseIcon from "@material-ui/icons/Close";
import { getToken, removeToken, getUsername } from "./common";

class AppNav extends Component {
  state = {
    isopen: false,
    users: [],
    searchres: "",
    clicked: false,
  };
  constructor(props) {
    super(props);
  }
  handleLogOut = () => {
    this.setState({ isopen: !this.state.isopen });
  };
  logoutUser = () => {
    this.handleLogOut();
    removeToken();
    this.props.history.push("/register");
  };
  getUsers = (e) => {
    this.setState({ searchres: e.target.value });
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `https://saiteja0413.pythonanywhere.com/api/get_users/?search=${e.target.value}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        console.log(res);
        this.setState({ users: res });
      }
    };
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };
  render() {
    return (
      <ContextApi.Consumer>
        {(object) => {
          return (
            <>
              <AppBar position="sticky" className="nav">
                <Toolbar>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid
                      item
                      xs={12}
                      sm
                      style={{ textAlign: "center" }}
                      className="insta-title"
                    >
                      Instagram
                    </Grid>
                    <Hidden smDown>
                      <Grid item xs style={{ position: "relative" }}>
                        <TextField
                          variant="filled"
                          size="small"
                          style={{ color: "white" }}
                          placeholder="Search users"
                          onChange={(e) => {
                            this.getUsers(e);
                          }}
                          inputRef={this.inputref}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon
                                  size="small"
                                  style={{ marginTop: "4px", opacity: 0.5 }}
                                />
                              </InputAdornment>
                            ),
                            endAdornment: this.state.searchres !== "" && (
                              <InputAdornment position="end">
                                <CloseIcon
                                  size="small"
                                  style={{
                                    marginTop: "10px",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    if (this.state.clicked) {
                                      this.setState({ searchres: "" });
                                    }
                                  }}
                                />
                              </InputAdornment>
                            ),
                          }}
                          onBlur={() => {
                            this.setState({ searchres: "" });
                          }}
                        />
                        {this.state.users.length !== 0 &&
                          this.state.searchres !== "" &&
                          this.state.searchres.indexOf(" ") !== 0 && (
                            <div
                              style={{
                                position: "absolute",
                                bottm: 0,
                                left: 0,
                                overflow: "hidden",
                                background: "white",
                                minHeight: "0px",
                                maxHeight: "130px",
                                width: "256px",
                              }}
                            >
                              {this.state.users.map((e) => (
                                <>
                                  <CardHeader
                                    avatar={
                                      <Avatar
                                        style={{
                                          width: "26px",
                                          height: "26px",
                                        }}
                                        src={`e["image"]`}
                                      />
                                    }
                                    title={
                                      <Typography
                                        variant="body2"
                                        style={{ color: "black" }}
                                        component={Link}
                                        to={`/otheruser/${e["user"]["username"]}`}
                                        style={{
                                          color: "black",
                                          textDecoration: "none",
                                        }}
                                        onMouseDown={() => {
                                          this.props.history.push(
                                            `/otheruser/${e["user"]["username"]}`
                                          );
                                        }}
                                      >
                                        {e["user"]["username"]}{" "}
                                      </Typography>
                                    }
                                    subheader={
                                      <Typography
                                        variant="subtitle2"
                                        color="textSecondary"
                                      >
                                        {e["name"]}
                                      </Typography>
                                    }
                                    style={{
                                      margin: "2px 0px",

                                      height: "40px",
                                      padding: "4px",
                                      paddingLeft: "8px",
                                    }}
                                  />
                                  <Divider />
                                </>
                              ))}
                            </div>
                          )}
                      </Grid>
                    </Hidden>
                    <Hidden smDown>
                      <ButtonGroup size="small">
                        <Button
                          component={Link}
                          to="/"
                          style={{ border: "none" }}
                        >
                          <Tooltip title="Home">
                            <HomeIcon />
                          </Tooltip>
                        </Button>
                        <Button
                          component={Link}
                          to={`/profile/${getUsername()}`}
                          style={{ border: "none" }}
                        >
                          <Tooltip title="Profile">
                            <Avatar
                              src={`https://saiteja0413.pythonanywhere.com${object["userdetails"]["image"]}`}
                              style={{ width: "27px", height: "27px" }}
                              alt={object["userdetails"]["user"]["username"]}
                            ></Avatar>
                          </Tooltip>
                        </Button>
                        <Button
                          component={Link}
                          to="/add-post"
                          style={{ border: "none" }}
                          disableRipple
                        >
                          <Tooltip title="add  post">
                            <AddBoxIcon />
                          </Tooltip>
                        </Button>
                        <Button
                          style={{ border: "none" }}
                          component={Link}
                          to="/friend-requests"
                        >
                          <Tooltip title="Friend requests">
                            <Badge
                              badgeContent={object["requests"]}
                              color="secondary"
                              fontSize="small"
                              max={10}
                            >
                              <GroupIcon />
                            </Badge>
                          </Tooltip>
                        </Button>
                        <Button style={{ border: "none" }}>
                          <Tooltip title="Log Out">
                            <ExitToAppIcon
                              style={{ cursor: "pointer" }}
                              onClick={this.handleLogOut}
                            />
                          </Tooltip>
                        </Button>
                      </ButtonGroup>
                    </Hidden>
                  </Grid>
                </Toolbar>
              </AppBar>
              <UnfriendAlert
                open={this.state.isopen}
                handleClose={this.handleLogOut}
                image={object["userdetails"]["image"]}
                username={object["userdetails"]["user"]["username"]}
                logout={() => {
                  this.logoutUser();
                }}
                action="logout"
              />
            </>
          );
        }}
      </ContextApi.Consumer>
    );
  }
}

export default withRouter(AppNav);
