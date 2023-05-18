import { Card, CardBody, HStack, Image, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import ExtensionBox from "./ExtensionBox";
import pdfIcon from "../assets/pdf-icon.webp";
import archiveIcon from "../assets/archive-icon.webp";
import wordIcon from "../assets/word-icon.webp";
import documentIcon from "../assets/document-icon.webp";
import textIcon from "../assets/text-icon.webp";
import { useNavigate } from "react-router-dom";

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
  const [thumbSrc, setThumpSrc] = useState("");

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

  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get(apiClient.defaults.baseURL + file.thumbnailSrc, {
        headers: {
          Authorization: apiClient.defaults.headers.common.Authorization,
        },
        responseType: "blob",
      })
      .then((res) => {
        console.log("file name: ", file.name);

        setThumpSrc(
          URL.createObjectURL(
            new File([res.data], file.name, { type: file.contentType })
          )
        );
      })
      .catch((err) => {
        console.log("get thumbnail error");

        if (err.response.status === 401) {
          navigate("/sign-in");
        }
      });
  }, [file]);

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
          } else if (file.extension === "zip" || file.extension === "rar") {
            setThumpSrc(archiveIcon);
          } else if (file.extension === "doc" || file.extension === "docx") {
            setThumpSrc(wordIcon);
          } else if (file.extension === "txt") {
            setThumpSrc(textIcon);
          } else {
            setThumpSrc(documentIcon);
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
