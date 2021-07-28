import React from "react";
import { CssBaseline } from '@material-ui/core';
import StickyFooter from "./Footer";
import CenteredTabs from "./CenteredTabs";
import Header from "./Header";

export const HomePage = () => {  

  return (
    <>
      <CssBaseline />
      <Header/>
      
      <main>
        <CenteredTabs/>        
      </main>
      <StickyFooter />
    </>
  );
};

