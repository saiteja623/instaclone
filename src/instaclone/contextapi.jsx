import React, { Component, createContext } from "react";
import { getToken } from "./common";
export const ContextApi = createContext();

export class Context extends Component {
  state = {
    posts: [],
    userdetails: {
      user: "",
    },
    userposts: [
      {
        images: [],
        post: {},
      },
    ],
    num_of_posts: "",
    num_of_friends: "",
    suggestions: [],
    requests: 0,
    isopen3: false,
  };
  componentDidMount = () => {
    this.getuserProfile();
    this.getPosts();
    this.get_suggestions();
    this.get_requests();
  };
  increaseLikes = (id) => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/increaseLikes1${id}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };
  addComment = (id, comment) => {
    var xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/save_comments1${id}${comment}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };

  decreaseLikes = (id) => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/decreaseLikes1${id}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };
  deleteComment = (id) => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/delete_comments1${id}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };

  savePost = (id) => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/save_post${id}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };

  unsavePost = (id) => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/unsave_post${id}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };
  unsendRequest = (username) => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/unsend_request1${username}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };

  sendRequest = (username) => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/send_request1${username}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };

  removeFriend = (username) => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/remove_friend1${username}`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };

  getPosts = () => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://saiteja0413.pythonanywhere.com/api/getPosts", true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);

        this.setState({ posts: res["posts"] });
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };
  getuserProfile = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://saiteja0413.pythonanywhere.com/api/getprofile`,
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

  get_suggestions = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `https://saiteja0413.pythonanywhere.com/api/get_suggestions`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        this.setState({
          suggestions: res["suggestions"],
        });
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };

  get_requests = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `https://saiteja0413.pythonanywhere.com/api/get__numof_requests`,
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        this.setState({
          requests: res["requests"],
        });
      }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", `Token ${getToken()}`);
    xhr.send();
  };

  render() {
    return (
      <ContextApi.Provider
        value={{
          posts: this.state.posts,
          increaseLike: this.increaseLikes,
          decreaseLike: this.decreaseLikes,
          deleteComment: this.deleteComment,
          addComment: this.addComment,
          savePost: this.savePost,
          unsavePost: this.unsavePost,
          userdetails: this.state.userdetails,
          userposts: this.state.userposts,
          num_of_friends: this.state.num_of_friends,
          num_of_posts: this.state.num_of_posts,
          updatePosts: this.getPosts,
          suggestions: this.state.suggestions,
          sendRequest: this.sendRequest,
          unsendRequest: this.unsendRequest,
          removeFriend: this.removeFriend,
          requests: this.state.requests,
          loginuser: this.loginuser,
        }}
      >
        {this.props.children}
      </ContextApi.Provider>
    );
  }
}
