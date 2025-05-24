import React from "react";
import "./styles/header.css";
import Logo from "./Logo";
import Nav from "./Nav";

function Header() {
  return (
    <header
      id="header"
      className="header sticky top-0 d-flex align-items-center py-4"
    >
      {/* {logo} */}
      <Logo />

      {/* {search bar} */}

      {/* {navigation} */}
      <Nav />
    </header>
  );
}

export default Header;
