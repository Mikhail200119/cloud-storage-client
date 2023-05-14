import { useEffect, useState } from "react";
import { FileItem } from "./FileCard";
import {
  Button,
  HStack,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import apiClient from "../apiClient";
import FileContentViewer from "./FileContentViewer";
import DownloadButton from "./DownloadButton";

interface Props {
  file: FileItem;
  isOpen: boolean;
  onClose: () => void;
  onArchiveFileOpen: (fileName: string) => void;
  onUploadFile?: (file: FileItem) => void;
}

const ZipArchiveViewer = ({
  file,
  isOpen,
  onClose,
  onArchiveFileOpen,
  onUploadFile = (file) => {},
}: Props) => {
  const [archiveFiles, setFiles] = useState<string[]>([]);
  const [displayedFile, setDisplayedFile] = useState<FileItem | null>(null);
  const [download, setDownload] = useState(false);
  const [src, setSrc] = useState("");

  const {
    isOpen: isContentOpen,
    onOpen: onContentOpen,
    onClose: onContentClose,
  } = useDisclosure();

  const encodeSlash = (str: string) => {
    return str.replaceAll("/", "%2F");
  };

  const handleOpen = (archiveFile: string) => {
    console.log("encoded: ", archiveFile);

    onContentOpen();
    setSrc(`/api/files/archive/unzip-file/${file.id}/${archiveFile}`);
    const f: FileItem = {
      id: 0,
      name: archiveFile,
      fileSrc: `/api/files/archive/unzip-file/${file.id}/${archiveFile}`,
      thumbnailSrc: "",
      createdDate: new Date(),
      sizeInBytes: 0,
      extension: "",
      contentType: "",
    };

    setDisplayedFile(f);
  };

  useEffect(() => {
    apiClient
      .get<[]>(
        apiClient.defaults.baseURL + "/api/files/archive/file-list/" + file.id
      )
      .then((res) => {
        setFiles(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {displayedFile && (
        <FileContentViewer
          isUnzipFile={true}
          onClose={onContentClose}
          isOpen={isContentOpen}
          file={displayedFile}
        />
      )}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setDownload(false);
          onClose();
          setDisplayedFile(null);
        }}
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {file.name}
            <DownloadButton
              onClick={() => {
                setSrc(
                  apiClient.defaults.baseURL + `/api/files/download/${file.id}`
                );
                setDownload(true);
              }}
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {download && <iframe style={{ display: "none" }} src={src} />}
            <List spacing="1">
              {archiveFiles.map((f) => (
                <ListItem key={f}>
                  <HStack justifyContent="space-between">
                    <Text fontSize={14}>{f}</Text>
                    <HStack>
                      {f.endsWith(".zip") || f.endsWith(".rar") ? (
                        <Button
                          colorScheme="green"
                          size="sm"
                          onClick={() => {
                            const pathStrings = f.split("/");
                            console.log("path strings: ", pathStrings);

                            apiClient
                              .post<FileItem>(
                                `/api/files/archive/upload-file/${
                                  file.id
                                }/${encodeSlash(f)}`
                              )
                              .then((res) => {
                                if (res.status === 200) {
                                  onUploadFile(res.data);
                                }
                              })
                              .catch((err) => {
                                console.log(
                                  "error during uploading file from archive: ",
                                  err
                                );
                              });
                          }}
                        >
                          Upload to storage
                        </Button>
                      ) : (
                        <Button
                          colorScheme="blue"
                          size="sm"
                          onClick={() => {
                            setDownload(false);
                            handleOpen(encodeSlash(f));
                          }}
                        >
                          Open
                        </Button>
                      )}
                      <DownloadButton
                        onClick={() => {
                          setSrc(
                            apiClient.defaults.baseURL +
                              `/api/files/download/archive-file/${
                                file.id
                              }/${encodeSlash(f)}`
                          );
                          setDownload(true);
                        }}
                      />
                    </HStack>
                  </HStack>
                </ListItem>
              ))}
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ZipArchiveViewer;
