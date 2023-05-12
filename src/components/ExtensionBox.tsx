import { Box, Text } from "@chakra-ui/react";

interface Props {
  extension: string;
}

const ExtensionBox = ({ extension }: Props) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      justifyItems="center"
      alignItems="center"
      minBlockSize={5}
      maxBlockSize={5}
      backgroundColor="blue.200"
      width="50px"
    >
      <Text fontSize={13}>{extension}</Text>
    </Box>
  );
};

export default ExtensionBox;
