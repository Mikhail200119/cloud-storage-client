import { Grid, GridItem, HStack, Text, useDisclosure } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import FileGrid from "./components/FileGrid";
import UploadButton from "./components/UploadButton";
import apiClient from "./apiClient";
import { useEffect, useState } from "react";
import { FileItem } from "./components/FileCard";
import DeleteButton from "./components/DeleteButton";
import AlertMessage from "./components/AlertMessage";
import FileContentViewer from "./components/FileContentViewer";
import ZipArchiveViewer from "./components/ZipArchiveViewer";
import DownloadButton from "./components/DownloadButton";

function App() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filesToDelete, setFilesToDelete] = useState<FileItem[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [displayedFile, setDisplayedFile] = useState<FileItem | null>(null);
  const [archive, setArchive] = useState<FileItem | null>(null);
  const [isDeleteModal, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    apiClient
      .get<FileItem[]>("/api/files")
      .then((res) => {
        setFiles(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const {
    isOpen: isFileViewerOpen,
    onOpen: onFileViewerOpen,
    onClose: onFileViewerClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const { isOpen: isDeleteButtonOpen, onToggle: onDeleteButtonToggle } =
    useDisclosure();

  const {
    isOpen: isArchiveFileListOpen,
    onOpen: onArchiveFileListOpen,
    onClose: onArchiveFileListClose,
  } = useDisclosure();

  const onSearchInput = (searchText: string) => {
    apiClient
      .get<FileItem[]>("/api/files/search", {
        params: {
          Name: searchText,
          Extension: null,
        },
      })
      .then((res) => setFiles(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <>
      {displayedFile && (
        <FileContentViewer
          file={displayedFile}
          onClose={onFileViewerClose}
          isOpen={isFileViewerOpen}
        />
      )}
      {archive && (
        <ZipArchiveViewer
          isOpen={isArchiveFileListOpen}
          onClose={() => {
            onArchiveFileListClose();
            setArchive(null);
          }}
          file={archive}
          onArchiveFileOpen={() => null}
          onUploadFile={(file) => {
            setFiles([...files, file]);
          }}
        />
      )}
      {/* <ConfirmDeleteModal onClose={onDeleteModalClose} isOpen={isDeleteModal} /> */}
      {alertVisible && (
        <AlertMessage
          status="success"
          onDissapear={() => setAlertVisible(false)}
        >
          Success
        </AlertMessage>
      )}
      <Grid
        templateAreas={{
          base: `"nav" "main" "operation"`,
        }}
        margin={10}
      >
        <GridItem
          area="nav"
          style={{
            position: "fixed",
            overflow: "hidden",
            top: 0,
            width: "90%",
            zIndex: 2,
          }}
        >
          <NavBar onSearchInput={onSearchInput} />
        </GridItem>
        <GridItem area="main">
          {files.length === 0 && (
            <Text fontSize={18}>No files uploaded...</Text>
          )}
          <FileGrid
            onClick={(file, selected) => {
              if (!selected) {
                setFilesToDelete(
                  [...filesToDelete].filter((f) => f.id !== file.id)
                );

                if (filesToDelete.length === 0 && isDeleteButtonOpen) {
                  onDeleteButtonToggle();
                }
              } else {
                setFilesToDelete([...filesToDelete, file]);

                if (!isDeleteButtonOpen) {
                  onDeleteButtonToggle();
                }
              }
            }}
            onDoubleClick={(file) => {
              if (file.extension === "zip") {
                setArchive(file);
                onArchiveFileListOpen();
              } else {
                setDisplayedFile(file);
                onFileViewerOpen();
              }
            }}
            files={files}
          />
        </GridItem>
        <GridItem
          style={{
            position: "fixed",
            overflow: "hidden",
            bottom: 15,
            width: "90%",
            zIndex: 2,
          }}
          area="operation"
        >
          <HStack>
            <UploadButton
              onUpload={(uploadedFiles) => {
                setFiles([...files].concat(uploadedFiles));
                setAlertVisible(true);
              }}
            />
            {filesToDelete.length > 0 && (
              <>
                <DeleteButton
                  isOpen={isDeleteButtonOpen}
                  filesToDelete={filesToDelete}
                  onFileDeleted={() => {
                    setFiles(
                      [...files].filter((f) => !filesToDelete.includes(f))
                    );
                    setFilesToDelete([]);
                  }}
                />
              </>
            )}
          </HStack>
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
