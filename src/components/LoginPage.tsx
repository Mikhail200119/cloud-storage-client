import {
  Button,
  Grid,
  Input,
  InputGroup,
  interactivity,
} from "@chakra-ui/react";
import React, { FormEvent, useRef } from "react";
import apiClient from "../apiClient";

interface AuthenticateResponse {
  email: string;
  token: string;
}

const LoginPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    apiClient
      .post<AuthenticateResponse>(
        "https://localhost:7221/account/authenticate",
        {
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
        }
      )
      .then((res) => {
        apiClient.defaults.headers.common.Authorization = `Brearer ${res.data.token}`;
      });
  };

  return (
    <form onSubmit={onFormSubmit}>
      <InputGroup>
        <Input type="text" placeholder="email" />
        <Input type="text" placeholder="password" />
      </InputGroup>
      <Button type="submit" />
    </form>
  );
};

export default LoginPage;
