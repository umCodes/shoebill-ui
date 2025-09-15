import Header from "./layout/Header"
import Main from "./layout/Main"
import { Grid, GridItem } from "@chakra-ui/react";


function App() {

  return (
    <Grid
      templateRows="auto 1fr"
      h="100vh"
    >
      {/* Header */}
      <GridItem
        as="header"
        position="sticky"
        top={0}
        zIndex={1000}
      >
        <Header />
      </GridItem>

      {/* Main Content */}
      <GridItem
        as="main"
        overflowY="auto"
        p={4}
      >
        <Main />
      </GridItem>
    </Grid>
    
  )
}

export default App



