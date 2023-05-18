import {
  Box,
  Button,
  Grid,
  GridItem,
  Input,
  Text,
  InputGroup,
} from "@chakra-ui/react";
import { useRef } from "react";
import apiClient from "../apiClient";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface AuthenticateResponse {
  email: string;
  token: string;
}

interface Props {
  email?: string;
  onLoggedIn: (email: string) => void;
}

const FormSchema = z.object({
  email: z.string().email("Invalid email."),
  password: z.string().min(5),
});

type FormInput = z.infer<typeof FormSchema>;

const LoginPage = ({ onLoggedIn, email = "" }: Props) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const onFormSubmit = (data: FormInput) => {
    apiClient
      .post<AuthenticateResponse>("/api/account/authenticate", {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        apiClient.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
        onLoggedIn(res.data.email);
        navigate("/", { replace: true });
      })
      .catch(() => console.log("Login error"));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
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
                base: `"text" "login" "password" "button"`,
              }}
              margin={10}
            >
              <GridItem style={{ marginLeft: "100px" }} area="text">
                <Text colorScheme="purple" fontSize={30}>
                  Sign In
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
              <GridItem style={{ marginTop: "10px" }} area="password">
                <Input
                  border="1px solid black"
                  backgroundColor="whatsapp.50"
                  borderRadius="20px"
                  type="password"
                  placeholder="password"
                  {...register("password")}
                />
                {errors?.password?.message && <p>{errors.password.message}</p>}
              </GridItem>
              <GridItem
                style={{ marginTop: "30px", marginLeft: "110px" }}
                area="button"
              >
                <Button type="submit" backgroundColor="green.500">
                  Sign In
                </Button>
              </GridItem>
            </Grid>
          </Box>
        </InputGroup>
      </form>
    </div>
  );
};

export default LoginPage;
