import React, { Component } from "react";
import { Paper, Grid, Divider, Typography, Hidden } from "@material-ui/core";
import "./css/profile.css";
import FriendReqCard from "./friendreqcard";
import Suggestions from "./suggestions";
import { getToken } from "./common";
import { ContextApi } from "./contextapi";
import CardHead from "./cardheader";

class FriendRequest extends Component {
  state = {
    friendrequests: 10,
    requests: [],
  };
  componentDidMount = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `https://saiteja0413.pythonanywhere.com/api/get_friend_requests1`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        console.log(res);
        this.setState({ requests: res["requests"] });
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
              <div
                style={{
                  height: "80vh",
                  overflowY: "scroll",
                  width: "100%",
                }}
              >
                <Paper className="friends-paper" elevation={3}>
                  {this.state.requests.length !== 0 && (
                    <>
                      <Typography variant="h6">Friend Requests </Typography>
                      <Divider />
                      {this.state.requests.map((e) => (
                        <>
                          <FriendReqCard
                            username={e["details"]["user"]["username"]}
                            profilepic={e["details"]["image"]}
                            nickname={e["details"]["name"]}
                          />
                          <Divider />
                        </>
                      ))}
                    </>
                  )}
                  {this.state.requests.length === 0 && (
                    <>
                      <Typography variant="body1" style={{ padding: "10px" }}>
                        Your friend requests will appear here :)
                      </Typography>
                      <img
                        src={require("./friend-request.png")}
                        className="friendreq-illust"
                      />
                    </>
                  )}
                </Paper>
                <Hidden smUp>
                  <Paper
                    style={{
                      margin: "10px auto",
                      marginTop: "20px auto",
                      height: "auto",
                      padding: "0px 6px",
                      maxWidth: "400px",
                    }}
                  >
                    <Typography
                      variant="body1"
                      style={{ paddingLeft: "10px", paddingBottom: "10px" }}
                    >
                      Suggestions
                    </Typography>
                    <Divider />
                    {object["suggestions"].map((e) => (
                      <CardHead
                        username={e["user"]["username"]}
                        nickname={e["name"]}
                        src={e["image"]}
                        owner={object["userdetails"]["user"]["username"]}
                      />
                    ))}
                  </Paper>
                </Hidden>
              </div>
            </>
          );
        }}
      </ContextApi.Consumer>
    );
  }
}

export default FriendRequest;
