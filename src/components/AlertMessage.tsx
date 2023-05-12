import { Alert, AlertIcon } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Props {
  children: string;
  status: "info" | "warning" | "error" | "success" | "loading" | undefined;
  onDissapear?: () => void;
}

const AlertMessage = ({ children, status, onDissapear = () => {} }: Props) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setShow(false);
      onDissapear();
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, []);

  return (
    <>
      {show && (
        <Alert status={status}>
          <AlertIcon />
          {children}
        </Alert>
      )}
    </>
  );
};

export default AlertMessage;
