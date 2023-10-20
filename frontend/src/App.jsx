import React, { useState } from "react";
import { Route, RouterProvider, Routes } from "react-router-dom";
import AuthPage from "./Pages/AuthPage";
import HomePage from "./Pages/HomePage";
import LandingPage from "./Components/LandingPage"
import { createBrowserRouter } from "react-router-dom";
import EventForm from "../src/Components/EventForm";

function App() {
  const route = createBrowserRouter([
    { path: "/", element: <AuthPage /> },
    { path: "/home", element: <HomePage /> },
    { path: "/events", element: <LandingPage /> },
    { 
      path:"/registerevent",element:<EventForm/>
    }
  ])
  return (
    <>
      <RouterProvider router={route} />

    </>
  );
}

export default App;

