import React, { Component } from "react";
import {
  Paper,
  Typography,
  Divider,
  Fab,
  Button,
  TextField,
  Collapse,
  MobileStepper,
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import "./css/profile.css";
import Alert from "@material-ui/lab/Alert";
import { getUsername } from "./common";

class UploadPost extends Component {
  state = {
    images: [],
    caption: "",
    activestep: 0,
    currentFile: null,
    imageList: [],
    image: "",
    successdialogopen: false,
  };

  handleFile = (e) => {
    var freader = new FileReader();
    var imageList = this.state.imageList;
    imageList.push(e.target.files[0]);
    this.setState({ imageList, image: e.target.files[0] });
    freader.readAsDataURL(e.target.files[0]);
    freader.onloadend = (event) => {
      var images = this.state.images;
      images.push(event.target.result);
      this.setState({ images });
    };
    this.setState({ currentFile: null });
  };
  handleCaption = (e) => {
    this.setState({ caption: e.target.value });
  };

  uploadImages = () => {
    var xhr = new XMLHttpRequest();
    var formdata = new FormData();
    for (var i = 0; i < this.state.imageList.length; i++) {
      formdata.append("images[" + i + "]", this.state.imageList[i]);
    }
    formdata.append("caption", this.state.caption);
    formdata.append("length", this.state.imageList.length);
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/upload_post1${getUsername()}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        this.setState({
          successdialogopen: true,
          imageList: [],
          images: [],
          caption: "",
        });
        setTimeout(() => {
          this.setState({ successdialogopen: false });
        }, 3000);
      }
    };
    xhr.send(formdata);
  };
  render() {
    return (
      <Paper className="paper-upload">
        <Typography variant="h6">Upload Post</Typography>
        <Divider />
        <Collapse in={this.state.successdialogopen}>
          <Alert>Your post has been uploaded successfully</Alert>
        </Collapse>
        {this.state.images.length === 0 && (
          <>
            <div className="upload-div">
              <Typography variant="body2"> Select Image- </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={this.handleFile}
                multiple="multiple"
              />
            </div>
            <img src={require("./post.png")} className="upload-illust" />
          </>
        )}
        {this.state.images.length >= 1 && (
          <div className="upload-div">
            <Typography variant="body1">Select Another Image- </Typography>
            <input
              type="file"
              value={this.state.currentFile}
              accept="image/*"
              onChange={this.handleFile}
              multiple="multiple"
            />
          </div>
        )}{" "}
        {this.state.images.length === 1 && (
          <>
            <img src={this.state.images[0]} className="selected-image" />
            <TextField
              variant="outlined"
              multiline
              label="caption"
              size="small"
              rowsMax={6}
              style={{
                width: "90%",
                fontSize: "0.9rem",
                whiteSpace: "wrap",
                marginTop: "10px",
              }}
              onChange={this.handleCaption}
            />
          </>
        )}
        {this.state.images.length > 1 && (
          <>
            <SwipeableViews
              index={this.state.activestep}
              enableMouseEvents
              style={{ objectFit: "cover", position: "relative" }}
              className="swipable"
            >
              {this.state.images.map((e) => (
                <img src={e} className="selected-image" />
              ))}
            </SwipeableViews>

            <MobileStepper
              style={{ position: "absolute", background: "transparent" }}
              steps={this.state.images.length}
              className="stepper"
              variant="none"
              backButton={
                <Button
                  disableRipple
                  disabled={this.state.activestep === 0}
                  disableTouchRipple
                  style={
                    this.state.activestep === 0
                      ? { opacity: 0 }
                      : { color: "white" }
                  }
                  onClick={() => {
                    this.setState({
                      activestep: this.state.activestep - 1,
                    });
                  }}
                >
                  <KeyboardArrowLeftIcon
                    style={{
                      background: "gray",
                      borderRadius: "50%",
                      fontSize: "1rem",
                    }}
                  />
                </Button>
              }
              nextButton={
                this.state.activestep !== this.state.images.length - 1 && (
                  <Button
                    disableRipple
                    disableTouchRipple
                    style={{ color: "white" }}
                    onClick={() => {
                      this.setState({
                        activestep: this.state.activestep + 1,
                      });
                    }}
                  >
                    <KeyboardArrowRightIcon
                      style={{
                        background: "gray",
                        borderRadius: "50%",
                        fontSize: "1rem",
                      }}
                    />
                  </Button>
                )
              }
            />

            <TextField
              variant="outlined"
              multiline
              label="caption"
              size="small"
              rowsMax={6}
              style={{
                width: "90%",
                fontSize: "0.9rem",
                whiteSpace: "wrap",
                marginTop: "6px",
                marginTop: "10px",
              }}
              onChange={this.handleCaption}
              value={this.state.comment}
            />
          </>
        )}
        <div className="upload-btn-div">
          <Button
            variant="contained"
            size="small"
            color="primary"
            style={{
              textTransform: "capitalize",
              position: "absolute",
              right: "10px",
              bottom: "10px",
            }}
            disabled={this.state.images.length === 0}
            onClick={this.uploadImages}
          >
            Upload
          </Button>
        </div>
      </Paper>
    );
  }
}

export default UploadPost;
