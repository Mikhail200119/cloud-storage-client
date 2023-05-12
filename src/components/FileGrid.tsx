import { SimpleGrid } from "@chakra-ui/react";
import FileCard, { FileItem } from "./FileCard";
import FileCardContainer from "./FileCardContainer";

interface Props {
  files: FileItem[];
  onClick: (file: FileItem, selected: boolean) => void;
  onDoubleClick: (file: FileItem) => void;
}

const FileGrid = ({ files, onClick, onDoubleClick }: Props) => {
  return (
    <SimpleGrid columns={6} spacing={5} padding={10}>
      {files.map((file) => (
        <FileCardContainer key={file.id}>
          <FileCard onOpen={onDoubleClick} onSelected={onClick} file={file} />
        </FileCardContainer>
      ))}
    </SimpleGrid>
  );
};

export default FileGrid;
