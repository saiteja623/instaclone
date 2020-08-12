import React, { Component } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Avatar,
  AppBar,
  Badge,
  Toolbar,
  Grid,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import AddBoxIcon from "@material-ui/icons/AddBox";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FavoriteOutlinedIcon from "@material-ui/icons/FavoriteOutlined";
import { Link, withRouter } from "react-router-dom";
import "./css/profile.css";
import { ContextApi } from "./contextapi";
import { Context } from "./contextapi";
import UnfriendAlert from "./unfriendalert";
import { getToken, removeToken, getUsername } from "./common";

class BottomNav extends Component {
  state = {
    isopen: false,
  };
  handleLogOut = () => {
    this.setState({ isopen: !this.state.isopen });
  };
  logoutUser = () => {
    this.handleLogOut();
    removeToken();
    this.props.history.push("/register");
  };
  render() {
    return (
      <Context>
        <ContextApi.Consumer>
          {(object) => {
            return (
              <>
                <Grid
                  container
                  style={{ padding: "10px 0px", paddingLeft: "20px" }}
                >
                  <Grid item xs component={Link} to="/">
                    <HomeIcon style={{ color: "black" }} />
                  </Grid>
                  <Grid
                    item
                    xs
                    component={Link}
                    to={`/profile/${getUsername()}`}
                  >
                    <Avatar
                      style={{ width: "24px", height: "24px" }}
                      src={`https://saiteja0413.pythonanywhere.com${object["userdetails"]["image"]}`}
                    />
                  </Grid>

                  <Grid item xs component={Link} to="/add-post">
                    <AddBoxIcon style={{ color: "black" }} />
                  </Grid>
                  <Grid item xs component={Link} to="/friend-requests">
                    <Badge
                      badgeContent={object["requests"]}
                      color="secondary"
                      fontSize="small"
                      max={10}
                    >
                      <FavoriteOutlinedIcon style={{ color: "black" }} />
                    </Badge>
                  </Grid>
                  <Grid item xs>
                    <ExitToAppIcon
                      style={{ color: "black" }}
                      onClick={this.handleLogOut}
                    />
                  </Grid>
                </Grid>
                <UnfriendAlert
                  open={this.state.isopen}
                  handleClose={this.handleLogOut}
                  image={object["userdetails"]["image"]}
                  username={object["userdetails"]["user"]["username"]}
                  logout={this.logoutUser}
                  action="logout"
                />
              </>
            );
          }}
        </ContextApi.Consumer>
      </Context>
    );
  }
}

export default withRouter(BottomNav);
