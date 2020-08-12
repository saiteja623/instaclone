import React, { Component } from "react";
import {
  Dialog,
  Grid,
  DialogContent,
  DialogTitle,
  Typography,
  CardHeader,
  Divider,
  Avatar,
  Paper,
  Button,
  Popover,
  IconButton,
  ListItem,
  List,
  ListItemText,
  CircularProgress,
  Alert,
} from "@material-ui/core";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { Link } from "react-router-dom";
import { ContextApi } from "./contextapi";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { getToken } from "./common";

class CommentsFull extends Component {
  state = {
    comments: [],
    popupOpen: false,
    anchorEl: null,
    comment: "",
    repeat: false,
    newComment: "",
    loading: true,
  };
  handleComment = (e) => {
    this.setState({ comment: e.target.value });
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
    if (this.state.newComment !== "") {
      var xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://saiteja0413.pythonanywhere.com/api/get_comments1${this.props.id}`,
        true
      );
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var res = JSON.parse(xhr.responseText);
          this.setState({
            comments: res["comments"],
            newComment: "",
            comment: "",
          });
        }
      };
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
      xhr.send();
    }
  };
  getComments = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/get_comments1${this.props.id}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        this.setState({ comments: res["comments"], loading: false });
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);

    xhr.send();
  };

  render() {
    return (
      <>
        <ContextApi.Consumer>
          {(object) => {
            return (
              <Dialog fullScreen open onClose={this.props.closeDialog}>
                <DialogTitle style={{ padding: 0, height: "35px" }}>
                  <Grid container justify="center" justify="center">
                    <Grid item xs={1}>
                      <KeyboardArrowLeftIcon
                        onClick={this.props.closeDialog}
                        style={{ marginTop: "4px", marginLeft: "10px" }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs
                      style={{
                        textAlign: "center",
                        lineHeight: "35px",
                        height: "35px",
                      }}
                    >
                      <Typography variant="body1">Comments</Typography>
                    </Grid>
                  </Grid>
                </DialogTitle>
                <DialogContent style={{ padding: "6px" }} dividers>
                  <Paper
                    style={{ width: "100%", margin: "4px 0px", padding: "6px" }}
                  >
                    <Grid container>
                      <Grid item xs={2}>
                        <Avatar
                          style={{
                            width: "30px",
                            height: "30px",
                            margin: "3px auto",
                          }}
                          src={`https://saiteja0413.pythonanywhere.com${object["userdetails"]["image"]}`}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <input
                          type="text"
                          style={{
                            borderRadius: "6px",
                            width: "100%",
                            border: "solid 1px rgb(0,0,0,0.4)",
                            padding: "2px 6px",
                            fontSize: "0.8rem",
                            height: "30px",
                          }}
                          value={this.state.comment}
                          onChange={this.handleComment}
                          placeholder="Add a comment"
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          style={{ fontSize: "0.74rem" }}
                          disabled={
                            this.state.comment === "" ||
                            this.state.comment.indexOf(" ") === 0
                          }
                          color="primary"
                          onClick={() => {
                            object.addComment(
                              this.props.id,
                              this.state.comment
                            );
                            this.setState({ newComment: this.state.comment });
                          }}
                        >
                          Post
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                  <Divider />
                  <br />
                  {this.state.loading && (
                    <div
                      style={{
                        margin: "20px auto",
                        textAlign: "center",
                      }}
                    >
                      <CircularProgress
                        size={20}
                        style={{ margin: "0px auto" }}
                      />
                    </div>
                  )}
                  {this.state.comments.length === 0 && !this.state.loading && (
                    <>
                      <Typography
                        variant="body1"
                        style={{ textAlign: "center" }}
                      >
                        Be the first to comment!
                      </Typography>
                      <img
                        src={require("./comment.png")}
                        className="comments-illust"
                      />
                    </>
                  )}
                  {this.state.comments.length !== 0 &&
                    this.state.comments.map((e) => (
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
                                this.setState({
                                  popupOpen: false,
                                  newComment: "dd",
                                });
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
                        <Grid item container xs justify="center">
                          <Grid
                            item
                            xs={1}
                            style={{
                              textAlign: "middle",
                              padding: "4px",
                            }}
                          >
                            <Avatar
                              style={{
                                width: "24px",
                                height: "24px",
                                margin: "3px auto",
                              }}
                              src={`https://saiteja0413.pythonanywhere.com${e["profilepic"]}`}
                            />
                          </Grid>
                          <Grid item xs style={{ paddingLeft: "10px" }}>
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
                            <Grid item>
                              <IconButton>
                                <MoreVertIcon
                                  id="simple-popup"
                                  onClick={this.handlePopOver}
                                />
                              </IconButton>
                            </Grid>
                          )}
                        </Grid>
                      </>
                    ))}
                  <Divider />
                </DialogContent>
              </Dialog>
            );
          }}
        </ContextApi.Consumer>
      </>
    );
  }
}

export default CommentsFull;
