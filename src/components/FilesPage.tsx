import {
  Grid,
  GridItem,
  HStack,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import FileGrid from "./FileGrid";
import UploadButton from "./UploadButton";
import apiClient from "../apiClient";
import { useEffect, useState } from "react";
import { FileItem } from "./FileCard";
import DeleteButton from "./DeleteButton";
import AlertMessage from "./AlertMessage";
import FileContentViewer from "./FileContentViewer";
import ZipArchiveViewer from "./ZipArchiveViewer";
import SearchInput from "./SearchInput";
import { useNavigate } from "react-router-dom";
import DiskUsageBox from "./DiskUsageBox";

function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filesToDelete, setFilesToDelete] = useState<FileItem[]>([]);
  const [displayedFile, setDisplayedFile] = useState<FileItem | null>(null);
  const [archive, setArchive] = useState<FileItem | null>(null);
  const [isDeleteModal, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    apiClient
      .get<FileItem[]>("/api/files")
      .then((res) => {
        setFiles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/sign-in", { replace: true });
        } else {
          console.log("error during getting files: ", err.message);
        }
      });
  }, []);

  const {
    isOpen: isFileViewerOpen,
    onOpen: onFileViewerOpen,
    onClose: onFileViewerClose,
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
      .then((res) => {
        setFiles(res.data);
      })
      .catch((err) => {
        console.log("error during search files: ", err.message);

        if (err.response.status === 401) {
          navigate("/sign-in", { replace: true });
        }
      });
  };

  return (
    <>
      {displayedFile && (
        <FileContentViewer
          file={displayedFile}
          onClose={() => {
            onFileViewerClose();
            setDisplayedFile(null);
          }}
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
            top: 50,
            width: "90%",
            zIndex: 2,
            left: "450px",
          }}
        >
          <SearchInput onSearchInput={onSearchInput} />
        </GridItem>
        <GridItem area="main" style={{ marginTop: "40px" }}>
          {files.length === 0 && !loading && (
            <Text marginTop={30} fontSize={25}>
              No files uploaded...
            </Text>
          )}
          {loading && <Spinner marginTop={30} />}
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
          <HStack justifyContent="space-between">
            <HStack>
              <UploadButton
                onUpload={(uploadedFiles) => {
                  setFiles([...files].concat(uploadedFiles));
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
            <DiskUsageBox />
          </HStack>
        </GridItem>
      </Grid>
    </>
  );
}

export default FilesPage;
