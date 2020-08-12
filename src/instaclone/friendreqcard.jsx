import React, { Component } from "react";
import {
  CardHeader,
  Button,
  Avatar,
  Grid,
  Typography,
  Hidden,
} from "@material-ui/core";
import "./css/profile.css";
import { Link } from "react-router-dom";
import { getToken } from "./common";

class FriendReqCard extends Component {
  state = {
    accepted: false,
    declined: false,
  };

  acceptRequest = () => {
    this.setState({ accepted: true });
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/accept_request1${this.props.username}`,
      true
    );
    xhr.onreadystatechange = () => {};
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };
  deleteRequest = () => {
    this.setState({ declined: true });
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/delete_request1${this.props.username}`,
      true
    );
    xhr.onreadystatechange = () => {};
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };
  render() {
    return (
      !this.state.declined && (
        <>
          <CardHeader
            className="friendreq-card"
            avatar={
              <>
                <Hidden xsDown>
                  <Avatar
                    src={`https://saiteja0413.pythonanywhere.com${this.props.profilepic}`}
                  />
                </Hidden>
                <Hidden smUp>
                  <Avatar
                    src={`https://saiteja0413.pythonanywhere.com${this.props.profilepic}`}
                    style={{ width: "20px", height: "20px" }}
                  />
                </Hidden>
              </>
            }
            title={
              this.state.accepted ? (
                <Typography
                  variant="subtitle2"
                  style={{ textDecoration: "none", color: "black" }}
                  component={Link}
                  to={`otheruser/${this.props.username}`}
                >
                  Yor are now friends with{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {this.props.username}
                  </span>
                </Typography>
              ) : (
                <Typography
                  variant="body1"
                  style={{ textDecoration: "none", color: "black" }}
                  component={Link}
                  to={`otheruser/${this.props.username}`}
                >
                  <span style={{ fontWeight: "bold" }}>
                    {" "}
                    {this.props.username}
                  </span>
                </Typography>
              )
            }
            subheader={
              !this.state.accepted && (
                <Typography variant="body2">{this.props.nickname} </Typography>
              )
            }
            action={
              !this.state.accepted && (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    style={{
                      margin: "10px 4px",
                      marginLeft: "20px",
                    }}
                    onClick={this.acceptRequest}
                  >
                    accept
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    className="req-button"
                    style={{
                      margin: "10px 0px",
                      marginLeft: "0px",
                    }}
                    onClick={this.deleteRequest}
                  >
                    Decline
                  </Button>
                </>
              )
            }
          />
        </>
      )
    );
  }
}

export default FriendReqCard;
