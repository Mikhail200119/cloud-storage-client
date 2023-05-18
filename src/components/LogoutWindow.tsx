import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  onLoggedOut: () => void;
}

const LogoutWindow = ({ onLoggedOut }: Props) => {
  onLoggedOut();

  const navigate = useNavigate();
  navigate("/sign-in", { replace: true });

  return <></>;
};

export default LogoutWindow;
