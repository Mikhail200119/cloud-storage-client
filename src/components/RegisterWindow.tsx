import React, { FormEvent, useRef, useState } from "react";
import apiClient from "../apiClient";
import {
  InputGroup,
  Input,
  Button,
  Text,
  HStack,
  Box,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$/
);

interface RegisterResponse {
  email: string;
}

interface Props {
  onRegistered: (email: string) => void;
}

const FormSchema = z
  .object({
    email: z.string().email({ message: "Invalid email." }),
    password: z
      .string()
      .min(8, "Password should be at least 8 chars")
      .max(15, "Password should be max 15 chars"),
    confirmPassword: z.string(),
    //.regex(passwordRegex, { message: "Invalid password" }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Password did not match.",
  });

type FormInput = z.infer<typeof FormSchema>;

const RegisterWindow = ({ onRegistered }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const onFormSubmit = (data: FormInput) => {
    apiClient
      .post<RegisterResponse>("/api/account/register", {
        email: data.email,
        password: data.password,
      })
      .then(() => {
        onRegistered(data.email);
        navigate("/sign-in");
      })
      .catch((ex: Error) => console.log("Register error: ", ex));
  };

  return (
    <>
      <div style={{ marginTop: "60px" }}>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <InputGroup>
            <Box
              userSelect="none"
              backgroundColor="gray.300"
              marginLeft={450}
              marginTop={100}
              border="1px solid red"
              borderRadius={50}
              width={400}
            >
              <Grid
                templateAreas={{
                  base: `"text" "login" "password1" "password2" "button"`,
                }}
                margin={10}
              >
                <GridItem style={{ marginLeft: "100px" }} area="text">
                  <Text colorScheme="purple" fontSize={30}>
                    Sign Up
                  </Text>
                </GridItem>
                <GridItem style={{ marginTop: "20px" }} area="login">
                  <Input
                    border="1px solid black"
                    backgroundColor="whatsapp.50"
                    borderRadius="20px"
                    type="text"
                    placeholder="email"
                    {...register("email")}
                  />
                  {errors?.email?.message && <p>{errors.email.message}</p>}
                </GridItem>
                <GridItem style={{ marginTop: "10px" }} area="password1">
                  <Input
                    border="1px solid black"
                    backgroundColor="whatsapp.50"
                    borderRadius="20px"
                    type="password"
                    placeholder="password"
                    {...register("password")}
                  />
                  {errors?.password?.message && (
                    <p>{errors.password.message}</p>
                  )}
                </GridItem>
                <GridItem style={{ marginTop: "10px" }} area="password2">
                  <Input
                    border="1px solid black"
                    backgroundColor="whatsapp.50"
                    borderRadius="20px"
                    type="password"
                    placeholder="confirm password"
                    {...register("confirmPassword")}
                  />
                  {errors?.confirmPassword?.message && (
                    <p>{errors.confirmPassword.message}</p>
                  )}
                </GridItem>
                <GridItem
                  style={{ marginTop: "30px", marginLeft: "110px" }}
                  area="button"
                >
                  <Button type="submit" backgroundColor="green.500">
                    Sign Up
                  </Button>
                </GridItem>
              </Grid>
            </Box>
          </InputGroup>
        </form>
      </div>
    </>
  );
};

export default RegisterWindow;
