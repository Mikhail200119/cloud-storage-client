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

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setDownload(false);
        setLoading(true);
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
            <AspectRatio>
              <iframe
                ref={ref}
                title={file.name}
                src={apiClient.defaults.baseURL + file.fileSrc}
                allowFullScreen
                onLoadStartCapture={() => {
                  setLoading(true);
                }}
                onLoad={() => {
                  setLoading(false);
                }}
              />
            </AspectRatio>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FileContentViewer;
