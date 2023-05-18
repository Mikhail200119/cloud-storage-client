import React, { useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import LoginWindow from "./components/LoginWindow";
import NavBar from "./components/NavBar";
import RegisterWindow from "./components/RegisterWindow";
import FilesPage from "./components/FilesPage";
import LogoutWindow from "./components/LogoutWindow";
import apiClient from "./apiClient";

const App = () => {
  const [userEmail, setUserEmail] = useState("");

  return (
    <>
      <BrowserRouter>
        <div>
          <div
            style={{
              position: "fixed",
              width: "100%",
              top: 0,
              zIndex: 3,
            }}
          >
            <NavBar userEmail={userEmail} />
          </div>
          <Routes>
            <Route path="/" element={<FilesPage />}></Route>
            <Route
              path="/sign-in"
              element={
                <LoginWindow
                  email={userEmail}
                  onLoggedIn={(email) => {
                    setUserEmail(email);
                  }}
                />
              }
            ></Route>
            <Route
              path="/sign-up"
              element={<RegisterWindow onRegistered={(email) => {}} />}
            ></Route>
            <Route
              path="/log-out"
              element={
                <LogoutWindow
                  onLoggedOut={() => {
                    setUserEmail("");
                    apiClient.defaults.headers.common.Authorization = "";
                  }}
                />
              }
            ></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
