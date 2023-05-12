import { Card, CardBody, HStack, Image, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";
import apiClient from "../apiClient";
import ExtensionBox from "./ExtensionBox";
import pdfIcon from "../assets/pdfIcon.png";
import zipIcon from "../assets/archiveIcon.png";

export interface FileItem {
  id: number;
  name: string;
  fileSrc: string;
  thumbnailSrc: string;
  createdDate: Date;
  sizeInBytes: number;
  extension: string;
  contentType: string;
}

interface Props {
  file: FileItem;
  onSelected: (file: FileItem, selected: boolean) => void;
  onOpen: (file: FileItem) => void;
}

const FileCard = ({ file, onSelected, onOpen }: Props) => {
  const [isLoading, setLoading] = useState(true);
  const [isSelected, setSelected] = useState(false);
  const [thumbSrc, setThumpSrc] = useState(
    apiClient.defaults.baseURL + file.thumbnailSrc
  );

  const handleCardClick = () => {
    let selected = false;

    if (isSelected) {
      setSelected(false);
      selected = false;
    } else {
      setSelected(true);
      selected = true;
    }

    onSelected(file, selected);
  };

  return (
    <Card
      key={file.id}
      onLoad={() => setSelected(false)}
      onClick={handleCardClick}
      backgroundColor={isSelected ? "gray.500" : "gray.300"}
      onDoubleClick={() => onOpen(file)}
    >
      {isLoading && <Spinner left={15} top={15} size="lg" />}
      <Image
        minBlockSize={200}
        maxBlockSize={200}
        key={file.name}
        objectFit="contain"
        src={thumbSrc}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);

          if (file.extension === "pdf") {
            setThumpSrc(pdfIcon);
          }

          if (file.extension === "zip" || file.fileSrc === "rar") {
            setThumpSrc(zipIcon);
          }
        }}
      />
      <CardBody>
        <HStack justifyContent="space-between">
          <Text fontSize={14} noOfLines={1}>
            {file.name}
          </Text>
          <ExtensionBox extension={file.extension} />
        </HStack>
      </CardBody>
    </Card>
  );
};

export default FileCard;
