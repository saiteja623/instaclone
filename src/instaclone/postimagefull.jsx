import React, { Component } from "react";
import {
  Grid,
  Avatar,
  Typography,
  Checkbox,
  CardHeader,
  IconButton,
  MobileStepper,
  Button,
} from "@material-ui/core";
import Favorite from "@material-ui/icons/Favorite";
import { Link } from "react-router-dom";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./css/profile.css";
import LikesFull from "./likesfull";
import CommentsFull from "./commentsfull";
import MoreVert from "./morevert";
import { ContextApi } from "./contextapi";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import SwipeableViews from "react-swipeable-views";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { getToken } from "./common";

class PostImageFull extends Component {
  state = {
    isLiked: false,
    isBookmarked: false,
    likesDialogOpen: false,
    commentsDialogOpen: false,
    MoreDialogOpen: false,
    likes: this.props.likes,
    activestep: 0,
    animation: {
      display: "none",
    },
  };
  componentDidMount = () => {
    this.checkForSave();
    this.checkForLike();
  };
  handleLikes = () => {
    var liked = this.state.isLiked;
    this.setState({ isLiked: !this.state.isLiked });
    liked
      ? this.setState({ likes: this.state.likes - 1 })
      : this.setState({ likes: this.state.likes + 1 });
  };
  checkForSave = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/checkForSave${this.props.id}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        if (res["isSaved"] == "true") {
          this.setState({ isBookmarked: true });
        } else {
          this.setState({ isBookmarked: false });
        }
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };
  checkForLike = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/checkForLike1${this.props.id}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);

        if (res["liked"] == "yes") {
          this.setState({ isLiked: true });
        } else {
          this.setState({ isLiked: false });
        }
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };
  handleLikesDialog = () => {
    this.setState({ likesDialogOpen: !this.state.likesDialogOpen });
  };
  handleCommentsDialog = () => {
    this.setState({ commentsDialogOpen: !this.state.commentsDialogOpen });
  };
  handleMoreDialog = () => {
    this.setState({ MoreDialogOpen: !this.state.MoreDialogOpen });
  };
  setlikeAnimation = () => {
    this.setState({
      animation: {
        display: "block",
      },
    });
    setTimeout(() => {
      this.setState({
        animation: {
          display: "none",
        },
      });
    }, 600);
  };

  render() {
    return (
      <>
        <ContextApi.Consumer>
          {(object) => {
            return (
              <>
                <Grid
                  container
                  direction="column"
                  className="post-image-full-grid"
                  style={{ margin: "10px auto" }}
                >
                  <Grid item style={{ minWidth: "100%" }}>
                    <CardHeader
                      title={
                        <Typography
                          variant="body1"
                          component={Link}
                          to={`/otheruser/${this.props.username}`}
                          style={{ color: "black", textDecoration: "none" }}
                        >
                          {this.props.username}
                        </Typography>
                      }
                      avatar={
                        <Avatar
                          style={{ width: "26px", height: "26px" }}
                          src={`https://saiteja0413.pythonanywhere.com${this.props.profilepic}`}
                        />
                      }
                      action={
                        <IconButton onClick={this.handleMoreDialog}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                    />
                  </Grid>
                  <Grid item style={{ minWidth: "100%", position: "relative" }}>
                    <SwipeableViews
                      index={this.state.activestep}
                      enableMouseEvents
                      style={{ objectFit: "cover", position: "relative" }}
                      className="swipable"
                    >
                      {this.props.images.map((e) => (
                        <img
                          src={`https://saiteja0413.pythonanywhere.com${e["image"]}`}
                          className="post-image-full"
                          onDoubleClick={() => {
                            if (!this.state.isLiked) {
                              return (
                                object.increaseLike(this.props.id),
                                this.setState({
                                  isLiked: true,
                                  likes: this.state.likes + 1,
                                }),
                                this.setlikeAnimation()
                              );
                            } else {
                              return this.setlikeAnimation();
                            }
                          }}
                        />
                      ))}
                      <FavoriteIcon
                        style={this.state.animation}
                        className="heart-icon"
                      />
                    </SwipeableViews>
                    {this.props.images.length > 1 && (
                      <MobileStepper
                        style={{
                          position: "absolute",
                          background: "transparent",
                        }}
                        steps={this.props.images.length}
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
                                background: "white",
                                borderRadius: "50%",
                                fontSize: "0.83rem",
                                color: "black",
                              }}
                            />
                          </Button>
                        }
                        nextButton={
                          this.state.activestep !==
                            this.props.images.length - 1 && (
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
                                  background: "white",
                                  borderRadius: "50%",
                                  fontSize: "0.83rem",
                                  color: "black",
                                }}
                              />
                            </Button>
                          )
                        }
                      />
                    )}
                  </Grid>
                  <Grid
                    item
                    style={{
                      minWidth: "100%",
                      position: "relative",
                    }}
                  >
                    <Checkbox
                      icon={<FavoriteBorder />}
                      checkedIcon={<Favorite />}
                      name="checkedH"
                      checked={this.state.isLiked}
                      onChange={this.handleLikes}
                      onClick={() => {
                        !this.state.isLiked
                          ? object.increaseLike(this.props.id)
                          : object.decreaseLike(this.props.id);
                      }}
                    />
                    <IconButton onClick={this.handleCommentsDialog}>
                      <ModeCommentOutlinedIcon />
                    </IconButton>
                    <Checkbox
                      style={{ position: "absolute", right: "10px" }}
                      icon={<BookmarkBorderIcon />}
                      checkedIcon={<BookmarkIcon style={{ color: "black" }} />}
                      name="checkedH"
                      checked={this.state.isBookmarked}
                      onChange={() => {
                        this.setState({
                          isBookmarked: !this.state.isBookmarked,
                        });
                      }}
                      onClick={() => {
                        !this.state.isBookmarked
                          ? object.savePost(this.props.id)
                          : object.unsavePost(this.props.id);
                      }}
                    />
                  </Grid>
                  {this.state.likes !== 0 && (
                    <Grid
                      item
                      style={{ minWidth: "100%", marginTop: "1px" }}
                      className="num-of-likes"
                      onClick={this.handleLikesDialog}
                    >
                      <span style={{ fontSize: "0.96rem" }}>
                        {" "}
                        {this.state.likes} likes
                      </span>
                    </Grid>
                  )}
                  {this.props.figcaption !== "" && (
                    <Grid
                      item
                      style={{ minWidth: "100%", paddingLeft: "11px" }}
                    >
                      <Typography
                        variant="body2"
                        component={Link}
                        to={`/otheruser/${this.props.username}`}
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        <span
                          style={{ fontWeight: "bold", fontSize: "0.99rem" }}
                        >
                          {this.props.username}
                        </span>
                        {"   "}
                        {this.props.figcaption}
                      </Typography>
                    </Grid>
                  )}
                  <Grid
                    item
                    className="num-of-likes"
                    style={{ minWidth: "100%", marginTop: "5px" }}
                  >
                    <Typography
                      color="textSecondary"
                      onClick={this.handleCommentsDialog}
                    >
                      view all comments
                    </Typography>
                  </Grid>
                </Grid>
                {this.state.likesDialogOpen && (
                  <LikesFull
                    id={this.props.id}
                    owner={object["userdetails"]["user"]["username"]}
                    closeDialog={this.handleLikesDialog}
                  />
                )}
              </>
            );
          }}
        </ContextApi.Consumer>

        {this.state.commentsDialogOpen && (
          <CommentsFull
            id={this.props.id}
            closeDialog={this.handleCommentsDialog}
          />
        )}
        <MoreVert
          open={this.state.MoreDialogOpen}
          handleClose={this.handleMoreDialog}
          username={this.props.username}
          id={this.props.id}
        />
      </>
    );
  }
}

export default PostImageFull;
