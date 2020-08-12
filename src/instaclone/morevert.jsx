import React, { Component } from "react";
import {
  Dialog,
  DialogContent,
  List,
  ListItemText,
  Snackbar,
  ListItem,
  Typography,
} from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import UnfriendAlert from "./unfriendalert";
import { ContextApi } from "./contextapi";
import { getToken, getUsername } from "./common";

class MoreVert extends Component {
  state = {
    snackbarOpen: false,
    unfriendAlertOpen: false,
  };
  handleUnfriendAlert = () => {
    this.setState({ unfriendAlertOpen: !this.state.unfriendAlertOpen });
  };
  deletePost = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "DELETE",
      `https://saiteja0413.pythonanywhere.com/api/deletePost1${this.props.id}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
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
              <>
                <Dialog
                  fullWidth
                  maxWidth="xs"
                  onClose={this.props.handleClose}
                  open={this.props.open}
                >
                  <DialogContent style={{ padding: 0 }}>
                    <List
                      alignItems="center"
                      style={{
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      <ListItem button divider onClick={this.props.handleClose}>
                        {this.props.username !== getUsername() && (
                          <ListItemText onClick={this.handleUnfriendAlert}>
                            <Typography variant="subtitle2">
                              <span style={{ color: "red" }}>Unfriend</span>
                            </Typography>
                          </ListItemText>
                        )}
                        {this.props.username === getUsername() && (
                          <ListItemText
                            onClick={() => {
                              this.deletePost();
                              object.updatePosts();
                            }}
                          >
                            <Typography variant="subtitle2" color="secondary">
                              Delete Post
                            </Typography>
                          </ListItemText>
                        )}
                      </ListItem>
                      <ListItem button divider onClick={this.props.handleClose}>
                        <CopyToClipboard
                          text="https://saiteja623.github.io/instaclone"
                          onCopy={() => {
                            this.setState({ snackbarOpen: true });
                          }}
                        >
                          <ListItemText>
                            {" "}
                            <Typography variant="subtitle2">
                              {" "}
                              Copy Link{" "}
                            </Typography>
                          </ListItemText>
                        </CopyToClipboard>
                      </ListItem>
                      <ListItem button divider onClick={this.props.handleClose}>
                        <ListItemText>
                          {" "}
                          <Typography variant="subtitle2"> cancel </Typography>
                        </ListItemText>
                      </ListItem>
                    </List>
                  </DialogContent>
                </Dialog>
                <Snackbar
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  autoHideDuration={2000}
                  onClose={() => {
                    this.setState({ snackbarOpen: false });
                  }}
                  message="Link Copied"
                  open={this.state.snackbarOpen}
                />
                <UnfriendAlert
                  open={this.state.unfriendAlertOpen}
                  handleClose={this.handleUnfriendAlert}
                  image="Screenshot_2019-12-10-19-22-36-37.png"
                />
              </>
            );
          }}
        </ContextApi.Consumer>
      </>
    );
  }
}

export default MoreVert;
