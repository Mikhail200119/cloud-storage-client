import { Link } from "react-router-dom";
import { Box, HStack, Text } from "@chakra-ui/react";
import SearchInput from "./SearchInput";

interface Props {
  userEmail: string;
}

const NavBar = ({ userEmail }: Props) => {
  return (
    <>
      <Box backgroundColor="gray.400" height="50px">
        <HStack
          justifyContent="space-between"
          paddingTop="12px"
          paddingRight="20px"
          paddingLeft="20px"
        >
          {userEmail !== "" && <Link to="/">Files</Link>}
          {userEmail !== "" && <Text fontSize={20}>{userEmail}</Text>}
          {userEmail === "" && <Link to="/sign-in">Sign In</Link>}
          {userEmail === "" && <Link to="/sign-up">Sign Up</Link>}
          {userEmail !== "" && <Link to="/log-out">Log out</Link>}
        </HStack>
      </Box>
    </>
  );
};

export default NavBar;
