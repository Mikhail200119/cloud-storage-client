import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import styles from "./FileCardContainer.module.css";

interface Props {
  children: ReactNode;
}

const FileCardContainer = ({ children }: Props) => {
  return (
    <Box
      className={styles.fileCardTransition}
      borderRadius={15}
      overflow="hidden"
    >
      {children}
    </Box>
  );
};

export default FileCardContainer;
