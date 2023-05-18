import { Button, ScaleFade } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { FileItem } from "./FileCard";
import apiClient from "../apiClient";

interface Props {
  isOpen: boolean;
  filesToDelete: FileItem[];
  onFileDeleted?: () => void;
}

const DeleteButton = ({
  isOpen,
  filesToDelete,
  onFileDeleted = () => {},
}: Props) => {
  const buildQueryString = (ids: number[]) => {
    return ids.map((id) => `ids=${id}`).join("&");
  };

  const handleDelete = () => {
    apiClient
      .delete(
        `/api/files?${buildQueryString(filesToDelete.map((f) => f.id))}`,
        {
          headers: {
            Authorization: apiClient.defaults.headers.common.Authorization,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          onFileDeleted();
        }
      })
      .catch((err) => console.log("error on deliting files"));
  };

  return (
    <ScaleFade initialScale={0.9} in={isOpen}>
      <Button colorScheme="red" onClick={handleDelete}>
        Delete
      </Button>
    </ScaleFade>
  );
};

export default DeleteButton;
