import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

import Header from "./Header";
import Footer from "./Footer";
import Navbar from './Navbar';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box margin="0 auto" maxWidth={1300} position="relative" minHeight="90vh" transition="0.75s ease-out">
      <Box minHeight="100%" p={4} display="flex" flexDirection="column" alignItems="center">
        <Header />
        <Navbar />
        <Box as="main" marginY={22}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
