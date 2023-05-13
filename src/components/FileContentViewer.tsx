import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Image,
  AspectRatio,
  Box,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FileItem } from "./FileCard";
import apiClient from "../apiClient";
import DownloadButton from "./DownloadButton";

interface Props {
  isUnzipFile?: boolean;
  file: FileItem;
  isOpen: boolean;
  onClose: () => void;
}

const FileContentViewer = ({
  isUnzipFile = false,
  file,
  isOpen,
  onClose,
}: Props) => {
  const [loading, setLoading] = useState(true);
  const [download, setDownload] = useState(false);
  const ref = useRef<HTMLIFrameElement>(null);
  const url =
    `data:${file.contentType};charset=utf-8,` +
    apiClient.defaults.baseURL +
    file.fileSrc;

  let displayMessage = "The file cannot be displayed";
  const [isDisplayable, setIsDisplayable] = useState(false);
  const [notDisplayableMessage, setNotDisplayableMessage] = useState("");

  useEffect(() => {
    apiClient
      .get<boolean>(
        `/api/files/is-displayable-file?contentType=${file.contentType}`
      )
      .then((res) => {
        setIsDisplayable(res.data);
        console.log("is displayable: ", isDisplayable);

        if (res.data === false) {
          setLoading(false);
          setNotDisplayableMessage("The file cannot be displayed");
        }
      })
      .catch((err) => console.log("get is displayable file server error"));
  }, [file]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setDownload(false);
        setLoading(true);
        setIsDisplayable(false);
        onClose();
      }}
      closeOnEsc={true}
      scrollBehavior="inside"
      size="full"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader backgroundColor="blackAlpha.300">
          <HStack>
            <Text>{file.name}</Text>
            {
              <DownloadButton
                onClick={() => {
                  setDownload(true);
                }}
              />
            }
          </HStack>
          {download && (
            <iframe
              style={{ display: "none" }}
              src={
                apiClient.defaults.baseURL + `/api/files/download/${file.id}`
              }
            />
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading && <Spinner size="lg" />}
          <Box>
            {isDisplayable ? (
              <AspectRatio>
                <iframe
                  ref={ref}
                  title={file.name}
                  src={apiClient.defaults.baseURL + file.fileSrc}
                  allowFullScreen
                  onLoadStart={() => {
                    setLoading(true);
                  }}
                  onLoad={() => {
                    setLoading(false);
                  }}
                />
              </AspectRatio>
            ) : (
              <Text fontSize={30}>
                {loading ? "" : "The file cannot be displayed..."}
              </Text>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FileContentViewer;
