import React, { Component } from "react";
import {
  Grid,
  Dialog,
  DialogContent,
  Hidden,
  IconButton,
  Avatar,
  Typography,
  CardHeader,
  Divider,
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  MobileStepper,
  InputAdornment,
  Popover,
  Button,
} from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AOS from "aos";
import "aos/dist/aos.css";
import "./css/profile.css";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CardHead from "./cardheader";
import CloseIcon from "@material-ui/icons/Close";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import SwipeableViews from "react-swipeable-views";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import MoreVert from "./morevert";
import Likes from "./likes";
import { ContextApi } from "./contextapi";
import { Link } from "react-router-dom";
import { getToken } from "./common";

class PostImage extends Component {
  state = {
    isLiked: false,
    isDialogopen: false,
    comment: "",
    myinp: "",
    popupOpen: false,
    anchorEl: null,
    likesDialogOpen: false,
    comments: [],
    newComment: "",
    isBookmarked: false,
    activestep: 0,
  };
  constructor(props) {
    super(props);
    this.myinp = React.createRef();
  }
  componentDidMount = () => {
    AOS.init({ duration: 600 });
    this.getComments();
    this.checkForSave();
    this.checkForLike();
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
  componentDidUpdate = () => {
    if (this.state.newComment !== "") {
      this.getComments();
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
  };

  handledialogClick = () => {
    this.setState({ isDialogopen: !this.state.isDialogopen });
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
  handleLikesDialog = () => {
    this.setState({ likesDialogOpen: !this.state.likesDialogOpen });
  };
  render() {
    return (
      <>
        <ContextApi.Consumer>
          {(object) => {
            return (
              <>
                <Hidden xsDown>
                  <Dialog
                    open
                    onClose={this.props.dialogClose}
                    fullWidth
                    maxWidth="md"
                    style={{ margin: "auto" }}
                  >
                    <DialogContent
                      style={{
                        overflow: "hidden",
                        padding: 0,
                      }}
                    >
                      <Grid container direction="row">
                        <Grid item xs={8} style={{ position: "relative" }}>
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
                                className="post-image"
                              />
                            ))}
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
                        </Grid>
                        <Grid item container xs={4} direction="column">
                          <Grid item xs={2} style={{ minWidth: "100%" }}>
                            <CardHeader
                              title={
                                <Typography
                                  variant="body1"
                                  component={Link}
                                  to={`otheruser/${this.props.username}`}
                                  style={{
                                    textDecoration: "none",
                                    color: "black",
                                  }}
                                >
                                  {this.props.username}
                                </Typography>
                              }
                              avatar={
                                <Avatar
                                  src={`https://saiteja0413.pythonanywhere.com${this.props.profilepic}`}
                                />
                              }
                              action={
                                <IconButton onClick={this.handledialogClick}>
                                  <MoreVertIcon />
                                </IconButton>
                              }
                            />
                          </Grid>
                          <Divider />
                          <Grid
                            item
                            direction="column"
                            style={{
                              height: "300px",
                              minWidth: "100%",
                              overflowX: "hidden",
                              overflowY: "scroll",
                              scrollbarWidth: "none",
                              paddingLeft: "6px",
                            }}
                          >
                            {this.state.comments.length === 0 && (
                              <Typography variant="body1">
                                Be the first to comment!
                              </Typography>
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
                                          object.deleteComment(
                                            e["comment"]["id"]
                                          );
                                          this.setState({
                                            popupOpen: false,
                                            newComment: "dd",
                                          });
                                        }}
                                      >
                                        <ListItemText>
                                          <Typography
                                            variant="body2"
                                            color="secondary"
                                          >
                                            Delete Comment
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <ListItem
                                        button
                                        onClick={this.handlePopOver}
                                      >
                                        <ListItemText>
                                          <Typography variant="body2">
                                            cancel
                                          </Typography>
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
                                    <Grid
                                      item
                                      xs
                                      style={{ paddingLeft: "10px" }}
                                    >
                                      <Typography>
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
                                      object["userdetails"]["user"][
                                        "username"
                                      ] && (
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
                          </Grid>

                          <Grid
                            item
                            container
                            direction="column"
                            xs={2}
                            style={{
                              minWidth: "100%",
                              position: "relative",
                            }}
                          >
                            <Grid item>
                              <Checkbox
                                size="small"
                                icon={<FavoriteBorder />}
                                checkedIcon={<Favorite />}
                                name="checkedH"
                                checked={this.state.isLiked}
                                onChange={this.handleLikesDialog}
                                onClick={() => {
                                  !this.state.isLiked
                                    ? object.increaseLike(this.props.id)
                                    : object.decreaseLike(this.props.id);
                                }}
                              />
                              <IconButton
                                onClick={() => {
                                  this.myinp.current.focus();
                                }}
                              >
                                <ModeCommentOutlinedIcon
                                  style={{ fontSize: "1.2rem" }}
                                />
                              </IconButton>
                              <Checkbox
                                size="small"
                                style={{ position: "absolute", right: "10px" }}
                                icon={<BookmarkBorderIcon />}
                                checkedIcon={
                                  <BookmarkIcon style={{ color: "black" }} />
                                }
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
                            <Grid item>
                              <Typography
                                variant="subtitle2"
                                component="p"
                                onClick={this.handleLikesDialog}
                                style={{ cursor: "pointer" }}
                              >
                                <span
                                  style={{ fontWeight: "bold", margin: "4px" }}
                                >
                                  {this.props.likes} likes
                                </span>
                              </Typography>
                              {this.props.figcaption !== "" && (
                                <Typography
                                  variant="subtitle2"
                                  style={{
                                    marginLeft: "4px",
                                    textDecoration: "none",
                                  }}
                                  component={Link}
                                  to={`otheruser/${this.props.username}`}
                                  style={{
                                    textDecoration: "none",
                                    color: "black",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      marginLeft: "4px",
                                    }}
                                  >
                                    {this.props.username}
                                  </span>{" "}
                                  {this.props.figcaption}
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            xs
                            style={{
                              minWidth: "100%",
                              alignItems: "flex-end",
                              verticalAlign: "bottom",
                            }}
                          >
                            <TextField
                              style={{
                                margin: "0px 4px",
                                width: "90%",
                                fontSize: "0.58rem",
                                paddingLeft: "10px",
                              }}
                              inputRef={this.myinp}
                              onChange={(e) => this.handleComment(e)}
                              placeholder="Add a comment"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Button
                                      color="primary"
                                      size="small"
                                      disabled={
                                        this.state.comment === "" ||
                                        this.state.comment.indexOf(" ") == 0
                                      }
                                      style={{ fontSize: "0.7rem" }}
                                      onClick={() => {
                                        object.addComment(
                                          this.props.id,
                                          this.state.comment
                                        );
                                        this.setState({
                                          newComment: this.state.comment,
                                        });
                                      }}
                                    >
                                      post
                                    </Button>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </DialogContent>
                  </Dialog>
                </Hidden>

                <MoreVert
                  open={this.state.isDialogopen}
                  handleClose={this.handledialogClick}
                  username={this.props.username}
                  id={this.props.id}
                />

                <Likes
                  open={this.state.likesDialogOpen}
                  handleClose={this.handleLikesDialog}
                  owner={object["userdetails"]["user"]["username"]}
                  id={this.props.id}
                />
              </>
            );
          }}
        </ContextApi.Consumer>
      </>
    );
  }
}

export default PostImage;
