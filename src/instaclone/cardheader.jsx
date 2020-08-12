import React, { Component } from "react";
import {
  CardHeader,
  Avatar,
  Button,
  Typography,
  Hidden,
} from "@material-ui/core";
import UnfriendAlert from "./unfriendalert";
import { Link } from "react-router-dom";
import { ContextApi } from "./contextapi";
import { getToken } from "./common";

class CardHead extends Component {
  state = {
    isrequested: null,
    friend: null,
    alertDialogOpen: false,
  };
  componentDidMount = () => {
    if (this.props.owner !== this.props.username) {
      var xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        `https://saiteja0413.pythonanywhere.com/api/checkFriend1${this.props.username}`,
        true
      );
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var res = JSON.parse(xhr.responseText);
          if (res["friend"] == "yes") {
            this.setState({ friend: true });
          } else if (res["friend"] == "no") {
            this.setState({ friend: false });
          } else {
            this.setState({ isrequested: true });
          }
        }
      };
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
      xhr.send();
    }
  };

  render() {
    return (
      <>
        <ContextApi.Consumer>
          {(object) => {
            return (
              <>
                <CardHeader
                  style={{
                    verticalAlign: "middle",
                    position: "relative",
                    padding: "2px 2px",
                    margin: "4px 0px",
                  }}
                  title={
                    <Typography
                      variant="body2"
                      component="p"
                      component={Link}
                      to={`/otheruser/${this.props.username}`}
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      {this.props.username}
                    </Typography>
                  }
                  subheader={this.props.nickname}
                  avatar={
                    <>
                      <Hidden xsDown>
                        <Avatar
                          src={`https://saiteja0413.pythonanywhere.com${this.props.src}`}
                          alt={this.props.username}
                          style={{ width: "27px", height: "27px" }}
                        ></Avatar>
                      </Hidden>
                      <Hidden smUp>
                        <Avatar
                          src={`https://saiteja0413.pythonanywhere.com${this.props.src}`}
                          alt={this.props.username}
                          style={{ width: "23px", height: "23px" }}
                        ></Avatar>
                      </Hidden>
                    </>
                  }
                  action={
                    this.props.owner !== this.props.username &&
                    (this.state.isrequested ? (
                      <Button
                        variant="outlined"
                        size="small"
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          right: "10px",
                          fontSize: "0.57rem",
                          textTransform: "capitalize",
                          fontWeight: "bold",
                        }}
                        onClick={() => {
                          this.setState({ alertDialogOpen: true });
                        }}
                      >
                        Requested
                      </Button>
                    ) : this.state.friend ? null : (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          right: "10px",
                          fontSize: "0.57rem",
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                        onClick={() => {
                          object.sendRequest(this.props.username);
                          this.setState({ isrequested: true });
                        }}
                      >
                        Follow
                      </Button>
                    ))
                  }
                />
                <UnfriendAlert
                  open={this.state.alertDialogOpen}
                  handleClose={() => {
                    this.setState({ alertDialogOpen: false });
                  }}
                  image={this.props.src}
                  action={this.state.isrequested ? "unsend" : "unfollow"}
                  unsend={() => {
                    object.unsendRequest(this.props.username);
                    this.setState({
                      isrequested: false,
                      alertDialogOpen: false,
                    });
                  }}
                  username={this.props.username}
                />{" "}
              </>
            );
          }}
        </ContextApi.Consumer>
      </>
    );
  }
}

export default CardHead;
