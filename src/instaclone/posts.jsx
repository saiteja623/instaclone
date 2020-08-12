import React, { Component } from "react";
import Post from "./post";
import Likes from "./likes";
import { ContextApi } from "./contextapi";
import {
  Paper,
  Typography,
  CardHeader,
  CardContent,
  CardMedia,
  Avatar,
  Card,
  CardActions,
  CardActionArea,
} from "@material-ui/core";
import "./css/route.css";
import Skeleton from "@material-ui/lab/Skeleton";

class Posts extends Component {
  state = {
    loading: true,
  };
  componentDidMount = () => {
    this.setLoadingFalse();
  };
  setLoadingFalse = () => {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 3000);
  };
  render() {
    return (
      <ContextApi.Consumer>
        {(object) => {
          if (this.state.loading) {
            return (
              <Card style={{ height: "400px" }}>
                <CardHeader
                  title={
                    <Skeleton
                      animation="wave"
                      variant="text"
                      style={{ width: "40%" }}
                    />
                  }
                  avatar={
                    <Avatar>
                      <Skeleton animation="wave" variant="circle" />{" "}
                    </Avatar>
                  }
                  subheader={
                    <Skeleton
                      animation="wave"
                      variant="text"
                      style={{ width: "20%" }}
                    />
                  }
                />
                <CardMedia style={{ width: "100%", height: "270px" }}>
                  <Skeleton
                    variant="rect"
                    animation="wave"
                    style={{ width: "100%", height: "100%" }}
                  />
                </CardMedia>
                <CardActionArea>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    style={{
                      width: "60%",
                      marginLeft: "20px",
                      marginTop: "10px",
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    style={{ width: "40%", marginLeft: "20px" }}
                  />
                </CardActionArea>
              </Card>
            );
          } else if (object["posts"].length === 0) {
            return (
              <>
                <Paper style={{ marginBottom: "10px" }}>
                  <img
                    src={require("./empty.png")}
                    className="empty-posts-img"
                  />
                </Paper>
                <Typography variant="body2" style={{ textAlign: "center" }}>
                  Oops! No posts.
                </Typography>
              </>
            );
          } else {
            return object["posts"].map((e) => (
              <>
                <Post
                  username={e["username"]}
                  likes={e["details"]["post"]["likes"]}
                  figcaption={e["details"]["post"]["figcaption"]}
                  images={e["details"]["images"]}
                  id={e["details"]["post"]["id"]}
                  profilepic={e["profilepic"]}
                  key={e["details"]["post"][["id"]]}
                />
              </>
            ));
          }
        }}
      </ContextApi.Consumer>
    );
  }
}

export default Posts;
