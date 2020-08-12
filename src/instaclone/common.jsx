import React, { Component } from "react";

//get token from localstorage
export const getToken = () => {
  var token = localStorage.getItem("token");
  return token;
};

//set token to localstorage from login
export const setToken = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", user);
};

//remove token on logout
export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

//get user name
export const getUsername = () => {
  var name = localStorage.getItem("user");
  return name;
};
