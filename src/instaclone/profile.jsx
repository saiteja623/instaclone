import React, { Component } from "react";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  TextField,
  Hidden,
  List,
  ListItem,
  DialogActions,
  Collapse,
  Divider,
  Tabs,
  Tab,
} from "@material-ui/core";
import PostImage from "./postimage";
import ViewDayIcon from "@material-ui/icons/ViewDay";
import AppsIcon from "@material-ui/icons/Apps";
import AOS from "aos";
import "aos/dist/aos.css";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import "./css/profile.css";
import PostImageFull from "./postimagefull";
import CloseIcon from "@material-ui/icons/Close";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import CardHead from "./cardheader";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import UnfriendAlert from "./unfriendalert";
import { ContextApi } from "./contextapi";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Alert from "@material-ui/lab/Alert";
import { getToken, getUsername } from "./common";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.usernameRef = new React.createRef();
    this.nicknameRef = new React.createRef();
    this.emailRef = new React.createRef();
  }
  state = {
    photos: [
      "IMG_20190927_152212.jpg",
      "IMG_20200526_234547.jpg",
      "Screenshot_2019-12-10-19-22-36-37.png",
      "destination_7.jpg",
      "IMG20190618153325.jpg",
    ],
    bioDialogOpen: false,
    profileDialogOpen: false,
    newBio: "",
    friendsDialogOpen: false,
    PostImageDialog: false,
    tabsValue: "one",
    newProfilePic: "",
    unfriendAlertOpen: false,
    newBioChanged: "",
    usernameChanged: "",
    nicknameChanged: "",
    emailChanged: "",
    activedetails: {
      id: 0,
      images: [],
      username: "",
      figcaption: "",
      likes: 0,
      profilepic: "",
    },
    saved: [
      {
        post: {},
      },
    ],
    friendsList: [],
    isrequested: null,
    friend: null,
    activefriend: {},
    userdetails: {
      user: "",
    },
    userposts: [
      {
        images: [
          {
            image: "",
          },
        ],
        post: {},
      },
    ],
    num_of_posts: "",
    num_of_friends: "",
    newProfilePic1: "",
    profilepic2: "",
    errorOpen: false,
  };

  componentDidMount = () => {
    AOS.init({ duration: 600 });
    this.getrandomProfile();
    this.getSavedPosts();
    this.getFriendsList();
    this.checkForFriend();
  };

  // get user friends list
  getFriendsList = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `https://saiteja0413.pythonanywhere.com/api/get_user_friends${this.props.match.params.username}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        this.setState({ friendsList: res["friends"] });
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };

  //set the current active details for colum view pic onClick
  setDetails = (id, profilepic, username, images, likes, figcaption) => {
    var activedetails = {
      id: id,
      profilepic: profilepic,
      username: username,
      images: images,
      likes: likes,
      figcaption: figcaption,
    };
    this.setState({ activedetails });
    this.setState({ PostImageDialog: true });
  };

  //get the users saved posts
  getSavedPosts = () => {
    var xhr = new XMLHttpRequest();

    xhr.open(
      "GET",
      `https://saiteja0413.pythonanywhere.com/api/get_saved_posts`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        this.setState({ saved: res["saved"] });
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };

  //handle new bio changed
  handleBioDialog = () => {
    this.setState({
      newBioChanged: this.state.newBio,
      bioDialogOpen: !this.state.bioDialogOpen,
    });
    var xhr = new XMLHttpRequest();
    var params = "bio=" + this.state.newBio;
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/update_user_desc1${getUsername()}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        console.log(res);
      }
    };
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);
  };

  //handle edit profile dialog
  handleProfileDialog = () => {
    this.setState({ profileDialogOpen: !this.state.profileDialogOpen });
  };

  //set the new bio onchange in input
  handleNewBio = (e) => {
    this.setState({ newBio: e.target.value });
  };

  //to handle the user friends list dialog
  handleFriendsDialog = () => {
    this.setState({ friendsDialogOpen: !this.state.friendsDialogOpen });
  };

  //to handle the post clicked in grid row view
  handlePostImageDialog = () => {
    this.setState({ PostImageDialog: !this.state.PostImageDialog });
  };

  //to display the new profile pic selected
  handleNewProfilePic = (e) => {
    var freader = new FileReader();
    this.setState({ profilepic2: e.target.files[0] });
    freader.readAsDataURL(e.target.files[0]);
    freader.onloadend = (event) => {
      this.setState({ newProfilePic: event.target.result });
    };
  };

  //handle between the tabs to switch
  handleTabs = (e, newValue) => {
    this.setState({ tabsValue: newValue });
  };

  //open unfriend or unsend request dialog
  handleUnfreind = () => {
    this.setState({ unfriendAlertOpen: !this.state.unfriendAlertOpen });
  };

  //check the visited profile is a friend of our owner
  checkForFriend = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `https://saiteja0413.pythonanywhere.com/api/checkFriend1${this.props.match.params.username}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        if (res["friend"] == "yes") {
          this.setState({ friend: true });
        } else if (res["friend"] == "no") {
          this.setState({ friend: false });
        } else {
          this.setState({ isrequested: true });
        }
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };

  //get the visited users posts and information
  getrandomProfile = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/getuserprofile${this.props.match.params.username}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        this.setState({
          userdetails: res["userdata"],
          userposts: res["details"],
          num_of_posts: res["num_of_posts"],
          num_of_friends: res["num_of_friends"],
        });
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };

  //submit the new profile
  submitNewProfile = () => {
    var xhr = new XMLHttpRequest();
    var formdata = new FormData();
    formdata.append("image", this.state.profilepic2);
    formdata.append("username", this.usernameRef.current.value.toLowerCase());
    formdata.append("nickname", this.nicknameRef.current.value);
    formdata.append("email", this.emailRef.current.value);
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/update_user1${this.props.match.params.username}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);

        if (res["status"] == "username") {
          this.setState({ errorOpen: true });
        } else {
          this.setState({
            userdetails: {
              ...this.state.userdetails,
              name: this.nicknameRef.current.value,
              user: {
                ...this.state.userdetails.user,
                username: this.usernameRef.current.value,
                email: this.emailRef.current.value,
              },
            },
            newProfilePic1: this.state.newProfilePic,
            profileDialogOpen: false,
          });
        }
      }
    };
    xhr.send(formdata);
  };
  render() {
    return (
      <>
        <ContextApi.Consumer>
          {(object) => {
            return (
              <>
                <Paper className="profile-paper">
                  <Grid container direction="column" spacing={5}>
                    <Grid
                      container
                      spacing={2}
                      direction="row"
                      alignItems="center"
                    >
                      <Grid item xs={3} sm>
                        <Hidden xsDown>
                          <Avatar
                            src={
                              this.state.newProfilePic1 === ""
                                ? `https://saiteja0413.pythonanywhere.com${this.state["userdetails"]["image"]}`
                                : this.state.newProfilePic
                            }
                            alt={this.state["userdetails"]["user"]["username"]}
                            style={{ width: "130px", height: "130px" }}
                          />
                        </Hidden>
                        <Hidden smUp>
                          <Avatar
                            src={
                              this.state.newProfilePic1 === ""
                                ? `https://saiteja0413.pythonanywhere.com${this.state["userdetails"]["image"]}`
                                : this.state.newProfilePic
                            }
                            alt={this.state["userdetails"]["user"]["username"]}
                            style={{
                              width: "70px",
                              height: "70px",
                              marginLeft: "4px",
                            }}
                          />
                        </Hidden>
                      </Grid>
                      <Grid
                        item
                        container
                        spacing={1}
                        xs={9}
                        sm={8}
                        alignItems="flex-start"
                        direction="column"
                      >
                        <Grid item xs={12} style={{ paddingLeft: "10px" }}>
                          <Hidden xsDown>
                            <Typography variant="h5">
                              {this.state["userdetails"]["user"]["username"]}
                              <VerifiedUserIcon size="small" />
                            </Typography>
                          </Hidden>
                          <Hidden smUp>
                            <Typography
                              variant="h6"
                              style={{ marginLeft: "20px" }}
                            >
                              {this.state["userdetails"]["user"]["username"]}
                              {this.state["userdetails"]["user"]["username"] ===
                                "saiteja" && (
                                <VerifiedUserIcon
                                  style={{ fontSize: "0.79rem" }}
                                />
                              )}
                            </Typography>
                          </Hidden>
                        </Grid>
                        <Grid item container style={{ minWidth: "100%" }}>
                          <Grid item xs sm={3} style={{ textAlign: "center" }}>
                            <Typography component="p" color="textSecondary">
                              {this.state["num_of_posts"]} posts
                            </Typography>
                          </Grid>
                          <Grid item xs sm={4}>
                            <Typography
                              color="textSecondary"
                              style={{ cursor: "pointer" }}
                              onClick={this.handleFriendsDialog}
                              component="p"
                            >
                              {this.state["num_of_friends"]} Friends
                            </Typography>
                          </Grid>
                          {this.props.match.params.username ===
                            getUsername() && (
                            <>
                              <Hidden xsDown>
                                <Grid item xs>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    color="primary"
                                    style={{ fontSize: "0.65rem" }}
                                    onClick={this.handleProfileDialog}
                                  >
                                    Edit Profile
                                  </Button>
                                </Grid>
                              </Hidden>
                            </>
                          )}
                          {this.props.match.params.username !==
                            getUsername() && (
                            <Hidden xsDown>
                              {this.state.isrequested ? (
                                <Grid item xs>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    style={{
                                      fontSize: "0.57rem",
                                      textTransform: "capitalize",
                                    }}
                                    onClick={() => {
                                      this.setState({
                                        activefriend: {
                                          image: this.state.userdetails.image,
                                          action: "unsend",
                                        },
                                      });
                                      this.handleUnfreind();
                                    }}
                                  >
                                    Requested
                                  </Button>
                                </Grid>
                              ) : this.state.friend ? (
                                <Grid item xs>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    style={{
                                      fontSize: "0.57rem",
                                      textTransform: "capitalize",
                                    }}
                                    onClick={() => {
                                      this.setState({
                                        activefriend: {
                                          image: this.state.userdetails.image,
                                          action: "unfriend",
                                        },
                                      });
                                      this.handleUnfreind();
                                    }}
                                  >
                                    Friends
                                  </Button>
                                </Grid>
                              ) : (
                                <Grid item xs>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    style={{
                                      fontSize: "0.57rem",
                                      textTransform: "capitalize",
                                    }}
                                    onClick={() => {
                                      object.sendRequest(
                                        this.props.match.params.username
                                      );
                                      this.setState({ isrequested: true });
                                    }}
                                  >
                                    Follow
                                  </Button>
                                </Grid>
                              )}
                            </Hidden>
                          )}
                        </Grid>
                        {this.props.match.params.username === getUsername() && (
                          <Hidden smUp>
                            <Grid
                              item
                              xs
                              style={{ minWidth: "100%", textAlign: "center" }}
                            >
                              <Button
                                variant="outlined"
                                size="small"
                                fullWidth
                                color="primary"
                                style={{
                                  fontSize: "0.65rem",
                                  width: "80%",
                                  margin: "0px auto",
                                }}
                                onClick={this.handleProfileDialog}
                              >
                                Edit Profile
                              </Button>
                            </Grid>
                          </Hidden>
                        )}
                        {this.props.match.params.username !== getUsername() && (
                          <Hidden smUp>
                            {this.state.isrequested ? (
                              <Grid
                                item
                                xs
                                style={{
                                  minWidth: "100%",
                                  textAlign: "center",
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  size="small"
                                  style={{
                                    fontSize: "0.65rem",
                                    width: "80%",
                                    margin: "0px auto",
                                    textTransform: "capitalize",
                                  }}
                                  onClick={() => {
                                    this.setState({
                                      activefriend: {
                                        image: this.state.userdetails.image,
                                        action: "unsend",
                                      },
                                    });
                                    this.handleUnfreind();
                                  }}
                                >
                                  Requested
                                </Button>
                              </Grid>
                            ) : this.state.friend ? (
                              <Grid
                                item
                                xs
                                style={{
                                  minWidth: "100%",
                                  textAlign: "center",
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  size="small"
                                  style={{
                                    fontSize: "0.65rem",
                                    width: "80%",
                                    margin: "0px auto",
                                    textTransform: "capitalize",
                                  }}
                                  onClick={() => {
                                    this.setState({
                                      activefriend: {
                                        image: this.state.userdetails.image,
                                        action: "unfriend",
                                      },
                                    });
                                    this.handleUnfreind();
                                  }}
                                >
                                  Friends
                                </Button>
                              </Grid>
                            ) : (
                              <Grid
                                item
                                xs
                                style={{
                                  minWidth: "100%",
                                  textAlign: "center",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  style={{
                                    fontSize: "0.65rem",
                                    width: "80%",
                                    margin: "0px auto",
                                    textTransform: "capitalize",
                                  }}
                                  onClick={() => {
                                    object.sendRequest(
                                      this.props.match.params.username
                                    );
                                    this.setState({ isrequested: true });
                                  }}
                                >
                                  Follow
                                </Button>
                              </Grid>
                            )}
                          </Hidden>
                        )}
                      </Grid>
                    </Grid>
                    <Grid item container spacing={2} direction="column" xs={12}>
                      <Grid item xs={12}>
                        <Typography variant="h6">
                          {this.state["userdetails"]["name"]}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} style={{ whiteSpace: "wrap" }}>
                        {this.state.newBioChanged !== "" && (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: this.state.newBioChanged,
                            }}
                            style={{ whiteSpace: "pre-wrap" }}
                          />
                        )}
                        {this.state.newBioChanged === "" && (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: this.state.userdetails.desc,
                            }}
                            style={{
                              whiteSpace: "pre-wrap",
                              fontSize: "0.9rem",
                            }}
                          />
                        )}
                      </Grid>
                      {this.props.match.params.username === getUsername() && (
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              this.setState({ bioDialogOpen: true });
                            }}
                            size="small"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Edit bio
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Paper>

                {!this.state.friend &&
                  this.state["userdetails"]["user"]["username"] !==
                    getUsername() && (
                    <Paper
                      style={{
                        width: "100%",
                        padding: "6px",
                      }}
                    >
                      <Typography
                        variant="body1"
                        style={{
                          margin: "0px auto",
                          textAlign: "center",
                        }}
                      >
                        You must be a friend of{" "}
                        <strong>{this.props.match.params.username} </strong> to
                        see their posts
                      </Typography>
                    </Paper>
                  )}
                {(this.state.friend ||
                  this.props.match.params.username === getUsername()) && (
                  <>
                    <Hidden smUp>
                      {this.state.userposts.length !== 0 && (
                        <Paper style={{ width: "100%", textAlign: "center" }}>
                          <Tabs
                            value={this.state.tabsValue}
                            style={
                              this.props.match.params.username === getUsername()
                                ? { maxWidth: "200px", margin: "0px auto" }
                                : {
                                    maxWidth: "150px",
                                    margin: "0px auto",
                                  }
                            }
                            onChange={this.handleTabs}
                          >
                            <Tab value="one" label={<AppsIcon />}></Tab>

                            <Tab value="two" label={<ViewDayIcon />}></Tab>

                            {this.props.match.params.username ===
                              getUsername() && (
                              <Tab value="three" label={<BookmarkIcon />}></Tab>
                            )}
                          </Tabs>
                        </Paper>
                      )}
                    </Hidden>

                    <Hidden xsDown>
                      {this.props.match.params.username === getUsername() &&
                        this.state.userposts.length !== 0 && (
                          <Paper style={{ width: "100%", textAlign: "center" }}>
                            <Tabs
                              value={this.state.tabsValue}
                              style={{
                                margin: " 0px auto",

                                maxWidth: "300px",
                              }}
                              onChange={this.handleTabs}
                            >
                              <Tab value="one" label={<AppsIcon />}></Tab>

                              <Tab value="three" label={<BookmarkIcon />}></Tab>
                            </Tabs>
                          </Paper>
                        )}
                    </Hidden>
                  </>
                )}
                {this.state.tabsValue === "one" &&
                  (this.state.friend ||
                    this.props.match.params.username == getUsername()) && (
                    <Grid
                      container
                      className="images-grid"
                      style={{ margin: "0px auto" }}
                    >
                      {this.state["userposts"].map((e) => {
                        return (
                          <>
                            <Grid item xs={4} className="image-in-grid">
                              <img
                                src={`https://saiteja0413.pythonanywhere.com${e["images"][0]["image"]}`}
                                width="100%"
                                style={{ cursor: "pointer" }}
                              />
                              <div
                                className="likes-and-comments"
                                onClick={() => {
                                  this.setDetails(
                                    e["post"]["id"],
                                    this.state["userdetails"]["image"],
                                    this.state["userdetails"]["user"][
                                      "username"
                                    ],
                                    e["images"],
                                    e["post"]["likes"],
                                    e["post"]["figcaption"]
                                  );
                                }}
                              >
                                <div className="hover-likes">
                                  <Typography>
                                    {e["post"]["likes"]}
                                    <FavoriteIcon size="small" />{" "}
                                  </Typography>
                                </div>
                              </div>
                            </Grid>
                          </>
                        );
                      })}
                    </Grid>
                  )}
                {this.state.tabsValue == "two" &&
                  this.state["userposts"].map((e) => (
                    <PostImageFull
                      username={this.state["userdetails"]["user"]["username"]}
                      likes={e["post"]["likes"]}
                      figcaption={e["post"]["figcaption"]}
                      images={e["images"]}
                      id={e["post"]["id"]}
                      profilepic={this.state["userdetails"]["image"]}
                    />
                  ))}
                {this.state.tabsValue == "three" && (
                  <Paper
                    style={{
                      width: "100%",
                      textAlign: "center",
                      height: "100%",
                    }}
                  >
                    {this.state.saved.length === 0 ? (
                      <Typography style={{ marginTop: "50px" }} variant="body1">
                        You have no saved posts
                      </Typography>
                    ) : (
                      <Grid
                        container
                        className="images-grid"
                        style={{ margin: "0px auto" }}
                      >
                        {this.state.saved.map((e) => {
                          return (
                            <>
                              <Grid item xs={4} className="image-in-grid">
                                <img
                                  src={`https://saiteja0413.pythonanywhere.com${e["details"]["images"][0]["image"]}`}
                                  width="100%"
                                  style={{ cursor: "pointer" }}
                                />
                                <div
                                  className="likes-and-comments"
                                  onClick={() => {
                                    this.setDetails(
                                      e["details"]["post"]["id"],
                                      e["profilepic"],
                                      e["details"]["post"]["username"],
                                      e["details"]["images"],
                                      e["details"]["post"]["likes"],
                                      e["details"]["post"]["figcaption"]
                                    );
                                  }}
                                >
                                  <div className="hover-likes">
                                    <Typography>
                                      {e["details"]["post"]["likes"]}
                                      <FavoriteIcon size="small" />{" "}
                                    </Typography>
                                  </div>
                                </div>
                              </Grid>
                            </>
                          );
                        })}
                      </Grid>
                    )}
                  </Paper>
                )}
                <Hidden xsDown>
                  <Dialog
                    data-aos="zoom-out"
                    open={this.state.bioDialogOpen}
                    fullWidth
                    maxWidth="xs"
                    onClose={() => {
                      this.setState({ bioDialogOpen: false });
                    }}
                  >
                    <DialogTitle style={{ height: "40px", padding: 0 }}>
                      <Grid container justify="center" alignItems="center">
                        <Grid item xs={1}></Grid>
                        <Grid item xs={8} style={{ textAlign: "center" }}>
                          <Typography variant="body2">Edit Bio</Typography>
                        </Grid>
                        <Grid item xs={2} style={{ textAlign: "right" }}>
                          <IconButton
                            onClick={() => {
                              this.setState({ bioDialogOpen: false });
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                      <TextField
                        multiline
                        rows={3}
                        rowsMax={8}
                        fullWidth
                        variant="outlined"
                        label=" New Bio"
                        placeholder="Enter your new bio here"
                        style={{ whiteSpace: "wrap" }}
                        onChange={(e) => this.handleNewBio(e)}
                        defaultValue={
                          this.state.newBioChanged !== ""
                            ? this.state.newBio
                            : this.state["userdetails"]["desc"]
                        }
                      />
                      {this.state.newBio !== "" &&
                        this.state.newBio.indexOf(" ") != 0 && (
                          <DialogActions>
                            <Button
                              variant="contained"
                              size="small"
                              style={{ fontSize: "0.7rem" }}
                              color="primary"
                              onClick={() => {
                                this.handleBioDialog();
                              }}
                            >
                              Update Bio
                            </Button>
                          </DialogActions>
                        )}
                    </DialogContent>
                  </Dialog>
                </Hidden>
                <Hidden xsDown>
                  <Dialog
                    maxWidth="xs"
                    data-aos="zoom-out"
                    fullWidth
                    style={{ overflowX: "hidden" }}
                    open={this.state.profileDialogOpen}
                  >
                    <DialogTitle
                      style={{
                        textAlign: "center",
                        padding: 0,
                        height: "40px",
                      }}
                    >
                      <Typography variant="body1">Edit your profile</Typography>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                      <Collapse in={this.state.errorOpen}>
                        <Alert severity="error" variant="filled">
                          Username already exists
                        </Alert>
                      </Collapse>
                      <Grid container spacing={1} direction="column">
                        {this.state.newProfilePic !== "" && (
                          <Grid item xs={12} style={{ textAlign: "center" }}>
                            <Avatar
                              style={{
                                width: "70px",
                                height: "70px",
                                margin: " 0px auto",
                              }}
                              src={this.state.newProfilePic}
                              alt="saiteja balla"
                            />
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            inputRef={this.usernameRef}
                            size="small"
                            label="username"
                            defaultValue={
                              this.state["userdetails"]["user"]["username"]
                            }
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            label="name"
                            inputRef={this.nicknameRef}
                            defaultValue={this.state["userdetails"]["name"]}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Email"
                            defaultValue={
                              this.state["userdetails"]["user"]["email"]
                            }
                            inputRef={this.emailRef}
                            helperText="Note:Providing an Iinvalid Email address you can never reset your password"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          Update profile pic -
                          <input
                            type="file"
                            accept="image/*"
                            onChange={this.handleNewProfilePic}
                          />
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        variant="contained"
                        style={{ fontSize: "0.7rem" }}
                        size="small"
                        color="primary"
                        onClick={() => {
                          this.submitNewProfile();
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        style={{ fontSize: "0.7rem" }}
                        size="small"
                        color="secondary"
                        onClick={() => {
                          this.setState({ profileDialogOpen: false });
                        }}
                      >
                        Cancel
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Hidden>

                <Hidden xsDown>
                  <Dialog
                    open={
                      this.state.num_of_friends !== 0 &&
                      this.state.friendsDialogOpen
                    }
                    fullWidth
                    maxWidth="xs"
                    data-aos="zoom-out"
                  >
                    <DialogTitle style={{ height: "40px", padding: 0 }}>
                      <Grid container justify="center" alignItems="center">
                        <Grid item xs={1}></Grid>
                        <Grid item xs={8} style={{ textAlign: "center" }}>
                          <Typography variant="body2">
                            {this.props.match.params.username === getUsername()
                              ? "Your"
                              : this.props.match.params.username}{" "}
                            Friends
                          </Typography>
                        </Grid>
                        <Grid item xs={2} style={{ textAlign: "right" }}>
                          <IconButton onClick={this.handleFriendsDialog}>
                            <CloseIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </DialogTitle>
                    <Divider />
                    <DialogContent dividers>
                      {this.state.friendsList.map((e) => (
                        <>
                          <CardHead
                            username={e["friend-details"]["user"]["username"]}
                            nickname={e["friend-details"]["name"]}
                            src={e["friend-details"]["image"]}
                            owner={getUsername()}
                            handleClose={this.handleFriendsDialog}
                            d
                          />
                          <Divider />{" "}
                        </>
                      ))}
                    </DialogContent>
                  </Dialog>
                </Hidden>
                <Hidden smUp>
                  <Dialog
                    open={this.state.bioDialogOpen}
                    fullScreen
                    onClose={this.handleBioDialog}
                  >
                    <DialogTitle style={{ padding: 0, height: "40px" }}>
                      <Grid container justify="center" alignItems="center">
                        <Grid item xs={2}>
                          <IconButton
                            onClick={() => {
                              this.setState({ bioDialogOpen: false });
                            }}
                          >
                            <KeyboardArrowLeftIcon />
                          </IconButton>
                        </Grid>
                        <Grid
                          item
                          xs={8}
                          style={{ textAlign: "center", justify: "center" }}
                        >
                          <Typography edge="end" variant="body2">
                            Edit Bio
                          </Typography>
                        </Grid>
                        <Grid item xs={2} style={{ textAlign: "right" }}></Grid>
                      </Grid>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                      <TextField
                        multiline
                        rows={3}
                        rowsMax={8}
                        fullWidth
                        variant="outlined"
                        label=" New Bio"
                        placeholder="Enter your new bio here"
                        style={{ whiteSpace: "wrap" }}
                        defaultValue={
                          this.state.newBioChanged !== ""
                            ? this.state.newBioChanged
                            : this.state["userdetails"]["desc"]
                        }
                        onChange={(e) => this.handleNewBio(e)}
                      />
                      {this.state.newBio !== "" &&
                        this.state.newBio.indexOf(" ") != 0 && (
                          <DialogActions>
                            <Button
                              variant="contained"
                              style={{ fontSize: "0.7rem", padding: "4px 6px" }}
                              color="primary"
                              onClick={this.handleBioDialog}
                            >
                              Update Bio
                            </Button>
                          </DialogActions>
                        )}
                    </DialogContent>
                  </Dialog>
                </Hidden>
                <Hidden smUp>
                  <Dialog fullScreen open={this.state.profileDialogOpen}>
                    <DialogTitle style={{ textAlign: "center" }}>
                      <Typography variant="h6">Edit your profile</Typography>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                      <Grid container spacing={1} direction="column">
                        {this.state.newProfilePic !== "" && (
                          <Grid item xs={12} style={{ textAlign: "center" }}>
                            <Avatar
                              style={{
                                width: "70px",
                                height: "70px",
                                margin: " 0px auto",
                              }}
                              src={this.state.newProfilePic}
                              alt="saiteja balla"
                            />
                          </Grid>
                        )}
                        <Grid item xs={8} style={{ minWidth: "90%" }}>
                          Update profile pic -
                          <input
                            type="file"
                            accept="image/*"
                            onChange={this.handleNewProfilePic}
                            width="70%"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            label="username"
                            inputRef={this.usernameRef}
                            defaultValue={
                              this.state["userdetails"]["user"]["username"]
                            }
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            label="name"
                            inputRef={this.nicknameRef}
                            defaultValue={this.state["userdetails"]["name"]}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            inputRef={this.emailRef}
                            label="Email"
                            helperText="Note:Providing an Iinvalid Email address you can never reset your password"
                            defaultValue={
                              this.state["userdetails"]["user"]["email"]
                            }
                          />
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        variant="contained"
                        style={{ fontSize: "0.7rem" }}
                        size="small"
                        color="primary"
                        onClick={() => {
                          this.submitNewProfile();
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        style={{ fontSize: "0.7rem" }}
                        size="small"
                        color="secondary"
                        onClick={() => {
                          this.setState({ profileDialogOpen: false });
                        }}
                      >
                        Cancel
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Hidden>
                <Hidden smUp>
                  <Dialog
                    open={
                      this.state.num_of_friends !== 0 &&
                      this.state.friendsDialogOpen
                    }
                    fullScreen
                  >
                    <DialogTitle style={{ height: "40px", padding: 0 }}>
                      <Grid
                        container
                        justify="space-between"
                        alignItems="center"
                      >
                        <Grid item xs={1} style={{ textAlign: "left" }}>
                          <IconButton onClick={this.handleFriendsDialog}>
                            <KeyboardArrowLeftIcon />
                          </IconButton>
                        </Grid>
                        <Grid item xs={10} style={{ textAlign: "center" }}>
                          <Typography variant="body2">
                            {this.props.match.params.username === getUsername()
                              ? "Your"
                              : this.props.match.params.username}{" "}
                            Friends
                          </Typography>
                        </Grid>
                        <Grid item xs={1}></Grid>
                      </Grid>
                    </DialogTitle>
                    <Divider />
                    <DialogContent dividers>
                      {this.state.friendsList.map((e) => (
                        <>
                          <CardHead
                            username={e["friend-details"]["user"]["username"]}
                            nickname={e["friend-details"]["name"]}
                            src={e["friend-details"]["image"]}
                            owner={getUsername()}
                            handleClose={() => {
                              alert("hh");
                              this.handleFriendsDialog();
                            }}
                          />
                          <Divider />{" "}
                        </>
                      ))}
                    </DialogContent>
                  </Dialog>
                </Hidden>
                {this.state.PostImageDialog && (
                  <PostImage
                    dialogClose={this.handlePostImageDialog}
                    username={this.state.activedetails.username}
                    likes={this.state.activedetails.likes}
                    figcaption={this.state.activedetails.figcaption}
                    images={this.state.activedetails.images}
                    id={this.state.activedetails.id}
                    profilepic={this.state.activedetails.profilepic}
                  />
                )}
                {this.state.PostImageDialog && (
                  <Hidden smUp>
                    <Dialog fullScreen open>
                      <DialogTitle style={{ padding: 0, height: "35px" }}>
                        <Grid container justify="center" justify="center">
                          <Grid item xs={1}>
                            <KeyboardArrowLeftIcon
                              onClick={this.handlePostImageDialog}
                              style={{
                                marginTop: "4px",
                                marginLeft: "10px",
                              }}
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
                            <Typography variant="h6">Post</Typography>
                          </Grid>
                        </Grid>
                      </DialogTitle>
                      <DialogContent
                        dividers
                        style={{
                          padding: 0,
                          margin: "2px auto",

                          minWidth: "100%",
                        }}
                      >
                        <PostImageFull
                          username={this.state.activedetails.username}
                          likes={this.state.activedetails.likes}
                          figcaption={this.state.activedetails.figcaption}
                          images={this.state.activedetails.images}
                          id={this.state.activedetails.id}
                          profilepic={this.state.activedetails.profilepic}
                        />
                      </DialogContent>

                      <Divider />
                    </Dialog>
                  </Hidden>
                )}

                <UnfriendAlert
                  open={this.state.unfriendAlertOpen}
                  handleClose={this.handleUnfreind}
                  image={this.state.activefriend.image}
                  unsend={() => {
                    object.unsendRequest(this.props.match.params.username);
                    this.handleUnfreind();
                    this.setState({ isrequested: false });
                  }}
                  unfriend={() => {
                    object.removeFriend(this.props.match.params.username);
                    this.setState({ friend: false });
                    this.handleUnfreind();
                  }}
                  action={this.state.activefriend.action}
                  username={this.props.match.params.username}
                />
              </>
            );
          }}
        </ContextApi.Consumer>
      </>
    );
  }
}

export default Profile;
