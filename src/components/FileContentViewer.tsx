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
import axios from "axios";
import fileDownload from "js-file-download";
import { useNavigate } from "react-router-dom";

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
  const [downloadUrl, setDownloadUrl] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const ref = useRef<HTMLIFrameElement>(null);
  const url = apiClient.defaults.baseURL + file.fileSrc;

  const [isDisplayable, setIsDisplayable] = useState(false);

  console.log("src: ", apiClient.defaults.baseURL);

  const navigate = useNavigate();

  useEffect(() => {
    if (file === null) {
      return;
    }

    const url = isUnzipFile
      ? `/api/files/is-displayable-archive-file?archiveFilePath=${file.name}`
      : `/api/files/is-displayable-file?contentType=${file.contentType}`;

    apiClient
      .get<boolean>(url)
      .then((res) => {
        setIsDisplayable(res.data);

        if (res.data === false) {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("get is displayable file server error");

        if (err.response.status === 401) {
          navigate("/sign-in");
        }
      });

    axios
      .get(apiClient.defaults.baseURL + file.fileSrc, {
        headers: {
          Authorization: apiClient.defaults.headers.common.Authorization,
        },
        responseType: "blob",
      })
      .then((res) => {
        setContentUrl(
          URL.createObjectURL(
            new File([res.data], file.name, {
              type: res.headers["content-type"],
            })
          )
        );
      })
      .catch(() => {
        console.log("get stream blob error");
        navigate("/sign-in");
      });
  }, [file]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
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
                  const downloadUrl = isUnzipFile
                    ? `/api/files/download/archive-file/${file.id}/${file.name}`
                    : `/api/files/download/${file.id}`;

                  apiClient
                    .get(downloadUrl, {
                      responseType: "blob",
                    })
                    .then((res) => {
                      fileDownload(
                        res.data,
                        file.name,
                        res.headers["content-type"]
                      );
                    })
                    .catch((err) =>
                      console.log("Error download file: ", err.message)
                    );
                }}
              />
            }
          </HStack>
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
                  src={contentUrl}
                  allowFullScreen
                  onLoadStart={() => {
                    setLoading(true);
                  }}
                  onLoad={() => {
                    setLoading(false);
                  }}
                />
              </AspectRatio>
            ) : contentUrl.length !== 0 ? (
              <Text fontSize={30}>
                {loading ? "" : "The file cannot be displayed..."}
              </Text>
            ) : (
              <Text fontSize={30}>{loading ? "" : "Error..."}</Text>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FileContentViewer;
