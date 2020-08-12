import React, { Component } from "react";
import Posts from "./posts";
import Suggestions from "./suggestions";
import { Grid, Hidden } from "@material-ui/core";
import PostInMobile from "./postsinmobile";
import UnfriendAlret from "./unfriendalert";
import { Context } from "./contextapi";

class Home extends Component {
  state = {};
  render() {
    return (
      <>
        <Hidden xsDown>
          <Context>
            <Grid
              container
              spacing={1}
              justify="center"
              style={{
                width: "960px",
                margin: "0px auto",
              }}
            >
              <Grid
                item
                alignItems="center"
                justify="center"
                sm={12}
                md
                style={{ margin: "0px auto" }}
              >
                <Grid item xs={12}>
                  <Posts />
                </Grid>
              </Grid>

              <Grid item md>
                <Hidden smDown>
                  <Suggestions width="300px" height={"50vh"} />
                </Hidden>
              </Grid>
            </Grid>
          </Context>
        </Hidden>
        <Hidden smUp>
          <Context>
            <Grid container justify="center" style={{ minwidth: "100%" }}>
              <Grid item>
                <PostInMobile />
              </Grid>
            </Grid>
          </Context>
        </Hidden>
      </>
    );
  }
}

export default Home;
