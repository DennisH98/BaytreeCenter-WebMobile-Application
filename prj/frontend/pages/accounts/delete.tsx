import React from "react";

import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, ModalOverlay, Text } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useAdminAccessPolicy } from "../../util/auth/accessPolicyHook";

interface Props {
  onClose: (confirmed: boolean) => void;
}

const MentorDelete = ({ onClose }: Props) => {
  useAdminAccessPolicy();
  return (
    <Modal isOpen={true} onClose={() => onClose(false)} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Mentor Account</ModalHeader>
        <ModalBody>
          <Text>Are you sure you want to delete this account? This cannot be undone.</Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => onClose(false)} mr={3}>Cancel</Button>
          <Button colorScheme="red" onClick={() => onClose(true)}>Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MentorDelete;
