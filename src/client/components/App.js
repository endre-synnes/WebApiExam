import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default ({ children }) => {
  return (
    <div id="content">
      <Header/>
      {children}
      <Footer/>
    </div>
  );
};

