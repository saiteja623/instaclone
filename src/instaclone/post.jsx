import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Typography,
  Avatar,
  CardContent,
  CardHeader,
  CardActions,
  CardMedia,
  IconButton,
  Checkbox,
  InputAdornment,
  TextField,
  Button,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogContent,
  MobileStepper,
  Grid,
} from "@material-ui/core";
import AOS from "aos";
import "aos/dist/aos.css";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./css/post.css";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import SwipeableViews from "react-swipeable-views";
import MoreVert from "./morevert";
import Likes from "./likes";
import Comments from "./comments";
import { ContextApi } from "./contextapi";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { getToken } from "./common";

class Post extends Component {
  state = {
    likeChecked: false,
    activestep: 0,
    id: this.props.id,
    likes: this.props.likes,

    isBookmarked: false,
    caption: this.props.figcaption,
    isDialogopen: false,
    comment: "",
    commentsDialogOpen: false,
    likesDialogOpen: false,
    childref: "",
    animation: {
      display: "none",
    },
  };
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.input = React.createRef();
  }
  handleLikes = () => {
    var liked = this.state.likeChecked;
    this.setState({ likeChecked: !this.state.likeChecked });
    liked
      ? this.setState({ likes: this.state.likes - 1 })
      : this.setState({ likes: this.state.likes + 1 });
  };
  handleComment = (e) => {
    this.setState({ comment: e.target.value });
  };
  handleCommentDialog = () => {
    this.setState({ commentsDialogOpen: !this.state.commentsDialogOpen });
  };
  handleLikesDialog = () => {
    this.setState({ likesDialogOpen: !this.state.likesDialogOpen });
  };
  componentDidMount = () => {
    this.checkForSave();
    this.checkForLike();
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
          this.setState({ likeChecked: true });
        } else {
          this.setState({ likeChecked: false });
        }
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };

  handledialogClick = () => {
    this.setState({ isDialogopen: false });
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
                <Card
                  style={{
                    width: "600px",
                    teXtaAlign: "initial",

                    margin: " 20px auto",
                  }}
                >
                  <CardHeader
                    style={{
                      height: "60px",
                    }}
                    title={
                      <Typography
                        variant="body1"
                        component={Link}
                        to={`/profile/${this.props.username}`}
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        {this.props.username}
                      </Typography>
                    }
                    avatar={
                      <Avatar
                        style={{ width: "30px", height: "30px" }}
                        alt="saiteja balla"
                        src={`https://saiteja0413.pythonanywhere.com${this.props.profilepic}`}
                      >
                        S
                      </Avatar>
                    }
                    action={
                      <IconButton
                        onClick={() => {
                          this.setState({ isDialogopen: true });
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    }
                  />
                  <div className="card-media">
                    <SwipeableViews
                      index={this.state.activestep}
                      enableMouseEvents
                      style={{ objectFit: "cover", position: "relative" }}
                      className="swipable"
                    >
                      {this.props.images.map((e) => (
                        <img
                          src={`https://saiteja0413.pythonanywhere.com${e["image"]}`}
                          height="400px"
                          className="image"
                          onDoubleClick={() => {
                            if (!this.state.likeChecked) {
                              return (
                                object.increaseLike(this.props.id),
                                this.setState({
                                  likeChecked: true,
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
                                fontSize: "1rem",
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
                                  fontSize: "1rem",
                                  color: "black",
                                }}
                              />
                            </Button>
                          )
                        }
                      />
                    )}
                  </div>
                  <CardActions
                    disableSpacing
                    style={{
                      position: "relative",

                      fontSize: "0.5rem",
                      padding: "6px",
                    }}
                  >
                    <Checkbox
                      icon={<FavoriteBorder />}
                      checkedIcon={<Favorite />}
                      size="small"
                      name="checkedH"
                      checked={this.state.likeChecked}
                      onChange={this.handleLikes}
                      onClick={() => {
                        !this.state.likeChecked
                          ? object.increaseLike(this.props.id)
                          : object.decreaseLike(this.props.id);
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        this.input.current.focus();
                      }}
                    >
                      <ModeCommentOutlinedIcon style={{ fontSize: "1.2rem" }} />
                    </IconButton>
                    <br />
                    <Checkbox
                      style={{
                        position: "absolute",
                        right: "10px",
                      }}
                      size="small"
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
                    {this.state.likes > 0 && (
                      <Typography
                        variant="body2"
                        style={{
                          position: "absolute",
                          left: "15px",
                          bottom: "-10px",
                          cursor: "pointer",
                        }}
                        onClick={this.handleLikesDialog}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          {this.state.likes} likes
                        </span>
                      </Typography>
                    )}
                  </CardActions>
                  <CardContent>
                    {this.state.caption != "" && (
                      <>
                        <Typography
                          variant="body2"
                          component={Link}
                          to={`/otheruser/${this.props.username}`}
                          style={{ color: "black", textDecoration: "none" }}
                        >
                          <span
                            style={{ fontWeight: "bold", fontSize: "0.94rem" }}
                          >
                            {this.props.username}
                          </span>{" "}
                          {this.state.caption}
                        </Typography>
                      </>
                    )}

                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      style={{ cursor: "pointer" }}
                      onClick={this.handleCommentDialog}
                    >
                      view all comments
                    </Typography>

                    <TextField
                      style={{
                        width: "100%",
                        fontSize: "0.3rem",
                        paddingLeft: "1px",
                      }}
                      size="small"
                      value={this.state.comment}
                      onChange={(e) => this.handleComment(e)}
                      placeholder="Add a comment"
                      inputRef={this.input}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              color="primary"
                              style={{ fontSize: "0.6rem" }}
                              disabled={
                                this.state.comment === "" ||
                                this.state.comment.indexOf(" ") == 0
                              }
                              onClick={() => {
                                object.addComment(
                                  this.props.id,
                                  this.state.comment
                                );
                                this.setState({ comment: "" });
                                this.child.current.getComments();
                              }}
                            >
                              post
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </CardContent>
                </Card>

                <MoreVert
                  open={this.state.isDialogopen}
                  handleClose={() => {
                    this.setState({ isDialogopen: !this.state.isDialogopen });
                  }}
                  username={this.props.username}
                />
                <Likes
                  open={this.state.likesDialogOpen}
                  id={this.props.id}
                  handleClose={this.handleLikesDialog}
                  owner={object["userdetails"]["user"]["username"]}
                />
                <Comments
                  ref={this.child}
                  open={this.state.commentsDialogOpen}
                  id={this.props.id}
                  handleClose={this.handleCommentDialog}
                />
              </>
            );
          }}
        </ContextApi.Consumer>
      </>
    );
  }
}

export default Post;
