import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  ListItem,
  List,
  ListItemText,
  Popover,
  Avatar,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { ContextApi } from "./contextapi";
import { getToken } from "./common";

class Comments extends Component {
  state = {
    popupOpen: false,
    anchorEl: null,
    comments: [],
    repeat: true,
  };
  handlePopOver = (e) => {
    this.setState({
      popupOpen: !this.state.popupOpen,
      anchorEl: e.currentTarget,
    });
  };
  componentDidMount = () => {
    this.getComments();
  };
  componentDidUpdate = () => {
    if (this.state.repeat) {
      var xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        `https://saiteja0413.pythonanywhere.com/api/get_comments1${this.props.id}`,
        true
      );
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var res = JSON.parse(xhr.responseText);
          this.setState({ comments: res["comments"], repeat: false });
        }
      };
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
      xhr.send();
    }
  };

  getComments = (async) => {
    var xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/get_comments1${this.props.id}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        this.setState({ comments: res["comments"] });
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };
  render() {
    return (
      <ContextApi.Consumer>
        {(object) => {
          return (
            <Dialog
              open={this.props.open}
              onClose={this.props.handleClose}
              fullWidth
              maxWidth="xs"
            >
              <DialogTitle style={{ height: "38px", paddingTop: 0 }}>
                <Grid container justify="center" alignItems="center">
                  <Grid item xs={1}></Grid>
                  <Grid item xs={9} style={{ textAlign: "center" }}>
                    <Typography variant="body1">Comments</Typography>
                  </Grid>
                  <Grid item xs={1} style={{ textAlign: "right" }}>
                    <IconButton onClick={this.props.handleClose}>
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </DialogTitle>
              <DialogContent dividers style={{ padddingLeft: 0 }}>
                {this.state.comments.map((e) => (
                  <>
                    <Popover
                      id="simple-popup"
                      open={this.state.popupOpen}
                      anchorEl={this.state.anchorEl}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      onClose={this.handlePopOver}
                    >
                      <List>
                        <ListItem
                          dividers
                          button
                          onClick={() => {
                            object.deleteComment(e["comment"]["id"]);
                            this.setState({ popupOpen: false, repeat: true });
                          }}
                        >
                          <ListItemText>
                            <Typography variant="body2" color="secondary">
                              Delete Comment
                            </Typography>
                          </ListItemText>
                        </ListItem>
                        <ListItem button onClick={this.handlePopOver}>
                          <ListItemText>
                            <Typography variant="body2">cancel</Typography>
                          </ListItemText>
                        </ListItem>
                      </List>
                    </Popover>
                    {this.state.comments.length !== 0 && (
                      <>
                        <Grid container justify="center">
                          <Grid
                            item
                            xs={1}
                            style={{
                              textAlign: "left",

                              alignItems: "flex-start",
                            }}
                          >
                            <Avatar
                              style={{
                                width: "27px",
                                height: "27px",
                              }}
                              src={`https://saiteja0413.pythonanywhere.com${e["profilepic"]}`}
                            />
                          </Grid>
                          <Grid item xs>
                            <Typography
                              component={Link}
                              to={`/otheruser/${e["comment"]["name"]}`}
                              style={{ color: "black", textDecoration: "none" }}
                            >
                              <span
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "0.89rem",
                                }}
                              >
                                {e["comment"]["name"]}
                              </span>{" "}
                              <span style={{ fontSize: "0.8rem" }}>
                                {e["comment"]["comment"]}
                              </span>
                            </Typography>
                          </Grid>
                          {e["comment"]["name"] ===
                            object["userdetails"]["user"]["username"] && (
                            <Grid item xs={1}>
                              <IconButton onClick={this.handlePopOver}>
                                <MoreVertIcon />
                              </IconButton>
                            </Grid>
                          )}
                        </Grid>
                        <br />
                      </>
                    )}
                  </>
                ))}
                {this.state.comments.length === 0 && (
                  <>
                    <Typography variant="body1" style={{ textAlign: "center" }}>
                      Be the first to comment!
                    </Typography>
                    <img
                      src={require("./comment.png")}
                      width="90%"
                      heigt="90%"
                    />
                  </>
                )}
              </DialogContent>
            </Dialog>
          );
        }}
      </ContextApi.Consumer>
    );
  }
}

export default Comments;
