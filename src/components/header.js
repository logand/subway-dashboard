import React from "react";
import mainLogo from "../img/badge.png";
import { Link } from "react-router-dom";

const Header = ({ location }) => (
  <header>
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <a className="navbar-brand" href="http://controltower.io">
        <img
          src={mainLogo}
          width="30"
          height="30"
          className="d-inline-block align-top mr-2"
          alt=""
        />
        Subway Dashboard
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <NavLinker relUrl="subway" name="Subway" location={location} />
        </ul>
      </div>
    </nav>
  </header>
);

const NavLinker = ({ relUrl, name, location }) => {
  return (
    <li
      className={`nav-item
        ${location.pathname === `/${relUrl}` ? " active" : ""}
      `}
    >
      <Link className="nav-link" to={`/${relUrl}`}>
        {name}
      </Link>
    </li>
  );
};

export default Header;
