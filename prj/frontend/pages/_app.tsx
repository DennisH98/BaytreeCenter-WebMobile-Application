import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import "../styles/global.css";
import { AuthProvider, ProtectRoute } from "../contexts/auth";

import { extendTheme } from "@chakra-ui/react";
import baytreeTheme from "../baytreeTheme";
import "react-datepicker/dist/react-datepicker.css";

const theme = extendTheme(baytreeTheme);

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <ProtectRoute>
          <Component {...pageProps} />
        </ProtectRoute>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
