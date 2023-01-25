import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/modal";
import { Spinner } from "@chakra-ui/spinner";
import React from "react";

export interface OverlaySpinnerProps {
  isOpen: boolean;
  color?: string;
}

const OverlaySpinner: React.FC<OverlaySpinnerProps> = (
  props: OverlaySpinnerProps
) => (
  <Modal closeOnOverlayClick={false} onClose={() => {}} isOpen={props.isOpen}>
    <ModalOverlay />
    <ModalContent
      style={{
        background: "none",
        width: "auto",
        height: "auto",
        boxShadow: "none",
        marginTop: "0",
        marginBottom: "0",
      }}
    >
      <div
        style={{
          height: "100vh",
          display: "flex",
          width: "auto",
          alignItems: "center",
        }}
      >
        <Spinner
          style={{ width: "300px", height: "300px", borderWidth: "25px" }}
          color={props.color ?? "primary.500"}
        />
      </div>
    </ModalContent>
  </Modal>
);

export default OverlaySpinner;
