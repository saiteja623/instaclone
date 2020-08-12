import React, { Component } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Divider,
  Grid,
} from "@material-ui/core";
import CardHead from "./cardheader";
import CloseIcon from "@material-ui/icons/Close";
import AOS from "aos";
import "aos/dist/aos.css";
import { getToken } from "./common";

class Likes extends Component {
  state = {
    liked: [],
  };
  componentDidMount = () => {
    AOS.init({ duration: 600 });
  };
  componentDidMount = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/get_likes1${this.props.id}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        this.setState({ liked: res["liked"] });
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };
  render() {
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
              <Typography variant="body1">Likes</Typography>
            </Grid>
            <Grid item xs={1} style={{ textAlign: "right" }}>
              <IconButton onClick={this.props.handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <Divider />
        <DialogContent dividers>
          {this.state.liked.map((e) => (
            <CardHead
              username={e["likedby"]["name"]}
              nickname={e["userDetails"]["name"]}
              src={e["userDetails"]["image"]}
              owner={this.props.owner}
            />
          ))}
        </DialogContent>
      </Dialog>
    );
  }
}

export default Likes;
