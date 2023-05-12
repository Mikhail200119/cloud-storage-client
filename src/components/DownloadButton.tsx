import { DownloadIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import React from "react";

interface Props {
  onClick: () => void;
}

const DownloadButton = ({ onClick }: Props) => {
  return (
    <Button onClick={onClick}>
      <DownloadIcon alignContent="center" />
    </Button>
  );
};

export default DownloadButton;
