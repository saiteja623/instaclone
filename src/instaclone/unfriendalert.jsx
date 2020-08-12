import React, { Component } from "react";
import {
  Dialog,
  Grid,
  Avatar,
  Typography,
  DialogContent,
  Divider,
} from "@material-ui/core";
import "./css/profile.css";
import { ContextApi } from "./contextapi";

class UnfriendAlert extends Component {
  state = {};
  render() {
    return (
      <ContextApi.Consumer>
        {(objecct) => {
          return (
            <Dialog open={this.props.open} fullWidth className="unfriend-alert">
              <DialogContent>
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  justify="center"
                  spacing={2}
                >
                  <Grid
                    item
                    xs
                    style={{
                      minWidth: "100%",
                      textAlign: "center",
                    }}
                  >
                    <Avatar
                      src={`https://saiteja0413.pythonanywhere.com${this.props.image}`}
                      style={{
                        width: "50px",
                        height: "50px",
                        margin: "0px auto",
                      }}
                    />
                  </Grid>
                  <Grid item style={{ textAlign: "center" }}>
                    {this.props.action !== "logout" && (
                      <Typography variant="body1">
                        Are you sure you want to{" "}
                        {this.props.action === "unsend"
                          ? "unsend friend request to "
                          : "unfriend "}
                        {this.props.username}
                      </Typography>
                    )}
                    {this.props.action === "logout" && (
                      <Typography variant="body1">
                        <strong>{this.props.username}</strong>, Are you sure you
                        want to logout ?
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs style={{ minWidth: "100%" }}>
                    <Divider />
                  </Grid>

                  <Grid item container dividers>
                    <Grid
                      item
                      xs
                      style={{
                        borderRight: "solid 1px black",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      onClick={this.props.handleClose}
                    >
                      <Typography> Cancel </Typography>
                    </Grid>
                    <Grid
                      item
                      xs
                      style={{ textAlign: "center", cursor: "pointer" }}
                      onClick={
                        this.props.action == "unsend"
                          ? this.props.unsend
                          : this.props.unfriend
                      }
                    >
                      {this.props.action !== "logout" && (
                        <Typography color="secondary">
                          {this.props.action === "unsend"
                            ? "unsend"
                            : "unfriend "}
                        </Typography>
                      )}
                      {this.props.action === "logout" && (
                        <Typography
                          color="secondary"
                          onClick={this.props.logout}
                        >
                          Logout
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
            </Dialog>
          );
        }}
      </ContextApi.Consumer>
    );
  }
}

export default UnfriendAlert;
