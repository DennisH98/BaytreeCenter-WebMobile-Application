import ClipLoader from "react-spinners/ClipLoader";
import { Center } from '@chakra-ui/react'

export function LoadingSpinner() {
  return (
    <Center>
      <ClipLoader color="#000000" loading={true} css="" size={150} />
    </Center>
  );
}

export function ErrorResponseDisplay() {
  return (
    <Center>
      <b>This service is unavailable. Please try again later.</b>
    </Center>
  )
}