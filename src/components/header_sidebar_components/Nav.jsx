import React from "react";
import "./styles/nav.css";
import NavNotice from "./NavNotice";
import NavMessage from "./NavMessage";
import NavAvatar from "./NavAvatar";
import SearchBar from "./SearchBar";
function Nav() {
  return (
    <nav className="header-nav ms-auto">
      <ul className="d-flex align-items-center">
        <SearchBar />
        <NavNotice />
        <NavMessage />
        <NavAvatar />
      </ul>
    </nav>
  );
}

export default Nav;
