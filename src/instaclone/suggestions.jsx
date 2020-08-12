import React, { Component } from "react";
import CardHead from "./cardheader";
import { Link } from "react-router-dom";

import {
  CardHeader,
  Avatar,
  Button,
  Grid,
  Paper,
  Divider,
  Hidden,
  Typography,
} from "@material-ui/core";
import { ContextApi } from "./contextapi";

class Suggestions extends Component {
  state = {
    username: "saiteja",
  };
  render() {
    return (
      <ContextApi.Consumer>
        {(object) => {
          return (
            <div
              style={{
                position: "fixed",
                marginLeft: "20px",
                width: this.props.width,
                maxWidth: "300px",
              }}
            >
              <Hidden xsDown>
                <Paper
                  elevetion={1}
                  style={{
                    width: "300px",
                    margin: "20px auto",
                    padding: "6px",
                  }}
                >
                  <Grid container spacing={0}>
                    <Grid
                      item
                      xs={3}
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <Avatar
                        src={`https://saiteja0413.pythonanywhere.com${object["userdetails"]["image"]}`}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                    </Grid>
                    <Grid item container direction="column" xs>
                      <Grid item xs>
                        <Typography variant="h6">
                          {object["userdetails"]["user"]["username"]}
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <Typography variant="body1">
                          {object["userdetails"]["name"]}
                        </Typography>
                      </Grid>
                      <Grid item xs style={{ textAlign: "right" }}>
                        <Button
                          size="small"
                          component={Link}
                          color="primary"
                          to={`profile/${object["userdetails"]["user"]["username"]}`}
                          style={{ fontSize: "0.7rem" }}
                        >
                          Edit Profile
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Hidden>
              <Paper
                elevation={2}
                style={{
                  width: this.props.width,
                  padding: "6px",
                  position: "sticky",
                  margin: "20px auto",
                }}
              >
                <Typography
                  variant="body1"
                  style={{ paddingLeft: "10px", paddingBottom: "10px" }}
                >
                  Suggestions
                </Typography>{" "}
                <Divider />
                <div
                  style={{
                    width: "100%",
                    height: this.props.height,
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    padding: "0px 6px",
                  }}
                >
                  {object["suggestions"].map((e) => (
                    <CardHead
                      username={e["user"]["username"]}
                      nickname={e["name"]}
                      src={e["image"]}
                      owner={object["userdetails"]["user"]["username"]}
                    />
                  ))}
                </div>
              </Paper>
            </div>
          );
        }}
      </ContextApi.Consumer>
    );
  }
}

export default Suggestions;
