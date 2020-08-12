import React, { Component } from "react";
import {
  Dialog,
  Grid,
  DialogContent,
  DialogTitle,
  Typography,
  CardHeader,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import CardHead from "./cardheader";
import { getToken } from "./common";

class LikesFull extends Component {
  state = {
    liked: [],
    loading: true,
  };
  componentDidMount = () => {
    this.getLikes();
  };
  getLikes = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/get_likes1${this.props.id}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        this.setState({ liked: res["liked"], loading: false });
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };
  render() {
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
              <Typography variant="body1">Likes</Typography>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent dividers>
          {this.state.loading && (
            <div
              style={{
                margin: "20px auto",
                textAlign: "center",
              }}
            >
              <CircularProgress size={20} style={{ margin: "0px auto" }} />
            </div>
          )}
          {this.state.liked.map((e) => (
            <>
              <CardHead
                username={e["likedby"]["name"]}
                nickname={e["userDetails"]["name"]}
                src={e["userDetails"]["image"]}
                owner={this.props.owner}
              />
              <Divider />
            </>
          ))}
        </DialogContent>
      </Dialog>
    );
  }
}

export default LikesFull;
