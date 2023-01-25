import React, { useEffect, useState } from 'react';
import { Button } from "@chakra-ui/react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from "@chakra-ui/react"

interface PropsModalComponent {
  modalTitle: string;
  isOpen: boolean;
  onClose: () => void;
  children: any;
}

export const ModalComponent = ({modalTitle, isOpen, onClose, children}: PropsModalComponent) =>{

  return(
    
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={800}>
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {children}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    )       
}