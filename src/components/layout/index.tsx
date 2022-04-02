import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

import Header from "./Header";
import Footer from "./Footer";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box margin="0 auto" maxWidth={1300} position="relative" minHeight="95vh" transition="0.75s ease-out">
      <Box margin="4" minHeight="95vh">
        <Header />
        <Box as="main" marginY={22}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
