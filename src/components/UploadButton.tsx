import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  ModalOverlay,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import apiClient from "../apiClient";
import { FileItem } from "./FileCard";
import styles from "./UploadButton.module.css";

interface Props {
  onUpload: (uploadedFiles: FileItem[]) => void;
}

const UploadButton = ({ onUpload }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isUploading, setUploading] = useState(false);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < event.target.files.length; i++) {
      formData.append("files", event.target.files[i]);
    }

    console.log(formData);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    apiClient
      .post("/api/files", formData, config)
      .then((res) => {
        onUpload(res.data);
        setUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
  };

  return (
    <>
      <HStack>
        <InputGroup paddingLeft={10}>
          <label className={styles.uploadFileInput}>
            <Input
              ref={ref}
              display="none"
              type="file"
              name="Files"
              onChange={(event) => {
                onFileChange(event);
                setUploading(true);
              }}
              multiple
            />
            Upload
          </label>
        </InputGroup>
        <Stack justifyContent="left">
          {isUploading && <Spinner size="lg" />}
        </Stack>
      </HStack>
    </>
  );
};

export default UploadButton;
