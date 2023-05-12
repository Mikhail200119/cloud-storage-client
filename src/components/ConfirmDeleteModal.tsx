import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal,
  ModalOverlay,
} from "@chakra-ui/react";
import {} from "react-overlays";

interface Props {
  onConfirm: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmDeleteModal = ({ onConfirm, isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalHeader>Confirm delete action</ModalHeader>
      <ModalContent>
        <ModalBody>
          You will not be able to undo this action. Do you want to confirm the
          action?
        </ModalBody>
        <ModalFooter>
          <Button onClick={onConfirm} colorScheme="red">
            Yes
          </Button>
          <Button colorScheme="blue.200">Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDeleteModal;
