import React, { FormEvent, useRef, useState } from "react";
import apiClient from "../apiClient";
import { InputGroup, Input, Button, Text, HStack } from "@chakra-ui/react";

interface RegisterResponse {
  email: string;
}

interface Props {
  onRegistered: (email: string) => void;
}

interface RegisterState {
  emailMessage: string;
  firstPasswordMessage: string;
  secondPasswordMessage: string;
}

const RegisterWindow = ({ onRegistered }: Props) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const firstPasswordRef = useRef<HTMLInputElement>(null);
  const secondPasswordRef = useRef<HTMLInputElement>(null);

  const [registerState, setRegisterState] = useState<RegisterState>({
    emailMessage: "",
    firstPasswordMessage: "",
    secondPasswordMessage: "",
  });

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (emailRef.current?.value.length === 0) {
      setRegisterState({ ...registerState, emailMessage: "Required" });
      return;
    } else {
      setRegisterState({ ...registerState, emailMessage: "" });
    }

    if (firstPasswordRef.current?.value.length === 0) {
      setRegisterState({ ...registerState, firstPasswordMessage: "Required" });
      return;
    } else {
      setRegisterState({ ...registerState, firstPasswordMessage: "" });
    }

    if (secondPasswordRef.current?.value.length === 0) {
      setRegisterState({ ...registerState, secondPasswordMessage: "Required" });
    } else {
      setRegisterState({ ...registerState, secondPasswordMessage: "" });
    }

    if (firstPasswordRef.current?.value !== secondPasswordRef.current?.value) {
      setRegisterState({
        ...registerState,
        secondPasswordMessage: "Different passwords",
      });
    } else {
      setRegisterState({ ...registerState, secondPasswordMessage: "" });
    }

    if (
      registerState.emailMessage === "" &&
      registerState.firstPasswordMessage === "" &&
      registerState.secondPasswordMessage === ""
    ) {
      apiClient
        .post<RegisterResponse>("/account/register", {
          email: emailRef.current?.value,
          password: firstPasswordRef.current?.value,
        })
        .then(() => {
          if (emailRef.current?.value === undefined) {
            return;
          }

          onRegistered(emailRef.current.value);
        })
        .catch(() => console.log("Register error"));
    }
  };

  return (
    <>
      <form onSubmit={onFormSubmit}>
        <InputGroup>
          <HStack>
            <Input type="text" placeholder="email" />
            {registerState.emailMessage.length > 0 && (
              <Text colorScheme="red">{registerState.emailMessage}</Text>
            )}
          </HStack>
          <HStack>
            <Input type="password" placeholder="password" />
            {registerState.firstPasswordMessage.length > 0 && (
              <Text colorScheme="red">
                {registerState.firstPasswordMessage}
              </Text>
            )}
          </HStack>
          <HStack>
            <Input type="password" placeholder="repeat password" />
            {registerState.secondPasswordMessage.length > 0 && (
              <Text colorScheme="red">
                {registerState.secondPasswordMessage}
              </Text>
            )}
          </HStack>
        </InputGroup>
        <Button type="submit">Sign up</Button>
      </form>
    </>
  );
};

export default RegisterWindow;
