import React, { Component } from "react";
import PostImageFull from "./postimagefull";
import { ContextApi } from "./contextapi";
import {
  Paper,
  Typography,
  CardHeader,
  CardContent,
  CardMedia,
  Avatar,
  Card,
  Divider,
  CardActions,
  CardActionArea,
} from "@material-ui/core";
import "./css/route.css";
import Skeleton from "@material-ui/lab/Skeleton";

class PostInMobile extends Component {
  state = {
    loading: true,
    list: [1, 2],
  };
  componentDidMount = () => {
    this.setLoadingFalse();
  };
  setLoadingFalse = () => {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  };
  render() {
    return (
      <ContextApi.Consumer>
        {(object) => {
          if (this.state.loading) {
            return this.state.list.map((e) => (
              <Card
                style={{
                  height: "300px",
                  width: "500px",

                  marginTop: "10px",
                }}
              >
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
                <CardMedia style={{ width: "100%", height: "180px" }}>
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
                      marginLeft: "10px",
                      marginTop: "10px",
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    style={{ width: "40%", marginLeft: "10px" }}
                  />
                </CardActionArea>
              </Card>
            ));
          } else if (object["posts"].length == 0) {
            return (
              <>
                <Paper style={{ marginBottom: "10px", marginTop: "50px" }}>
                  <img
                    src={require("./empty.png")}
                    className="empty-posts-img"
                  />
                </Paper>
                <Typography variant="h6" style={{ textAlign: "center" }}>
                  Oops! No posts.
                </Typography>
              </>
            );
          } else {
            return object["posts"].map((e) => (
              <>
                <PostImageFull
                  style={{ margin: "10px" }}
                  username={e["username"]}
                  likes={e["details"]["post"]["likes"]}
                  figcaption={e["details"]["post"]["figcaption"]}
                  images={e["details"]["images"]}
                  id={e["details"]["post"]["id"]}
                  profilepic={e["profilepic"]}
                />
                <Divider />
              </>
            ));
          }
        }}
      </ContextApi.Consumer>
    );
  }
}

export default PostInMobile;
