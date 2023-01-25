import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Heading, HStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import React, { useRef } from "react";
import Button from "./button";
import InputGroup from "./inputGroup";

export interface PagerProps {
  onNextPagePressed: (nextPageNumber: number) => void;
  onPreviousPagePressed: (prevPageNumber: number) => void;
  onGotoPagePressed: (gotoPageNumber: number) => void;
  currentPageNumber: number;
  maxPageNumber: number;
}

const Pager: React.FC<PagerProps> = (props) => {
  const toast = useToast();
  const currentPageNumberInputRef = useRef<HTMLInputElement>(null);

  return (
    <HStack width="100%" justifyContent="center" flex={1}>
      <Button
        disabled={props.currentPageNumber <= 1}
        buttonStyle="primary"
        leftIcon={<ArrowLeftIcon />}
        onClick={() => {
          currentPageNumberInputRef.current.value = "";
          if (props.currentPageNumber > 1) {
            props.onNextPagePressed(props.currentPageNumber - 1);
          } else {
            toast({
              status: "error",
              position: "top",
              title: "There are no more previous pages!",
            });
          }
        }}
      ></Button>
      <Button
        disabled={props.currentPageNumber >= props.maxPageNumber}
        buttonStyle="primary"
        rightIcon={<ArrowRightIcon />}
        onClick={() => {
          currentPageNumberInputRef.current.value = "";
          if (props.currentPageNumber < props.maxPageNumber) {
            props.onNextPagePressed(props.currentPageNumber + 1);
          } else {
            toast({
              status: "error",
              position: "top",
              title: "There are no more pages left!",
            });
          }
        }}
      ></Button>
      <Heading style={{ whiteSpace: "nowrap" }} size="sm">
        Page Number:
      </Heading>
      <InputGroup
        ref={currentPageNumberInputRef}
        width="120px"
        placeholder={
          props.maxPageNumber === 0 ? "0" : props.currentPageNumber.toString()
        }
      ></InputGroup>
      <Heading style={{ whiteSpace: "nowrap" }} size="sm">
        of {props.maxPageNumber}
      </Heading>
      <Button
        buttonStyle="primary"
        onClick={() => {
          const parsedCurrentPageNumber = parseInt(
            currentPageNumberInputRef.current.value
          );

          if (parsedCurrentPageNumber) {
            if (
              parsedCurrentPageNumber < 1 ||
              parsedCurrentPageNumber > props.maxPageNumber
            ) {
              toast({
                status: "error",
                position: "top",
                title: `Page number must be between 1 and ${props.maxPageNumber}`,
              });
            } else {
              props.onGotoPagePressed(parsedCurrentPageNumber);
            }
          } else {
            toast({
              status: "error",
              position: "top",
              title: `Page number must be between 1 and ${props.maxPageNumber}`,
            });
          }
        }}
      >
        Go
      </Button>
    </HStack>
  );
};

export default Pager;
