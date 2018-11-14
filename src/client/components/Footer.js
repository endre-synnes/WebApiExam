import React from 'react';
import { Grid, Nav, NavItem } from 'react-bootstrap';
import {NavLink} from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <Grid>
        <Nav justified>
          <NavItem
            eventKey={1}
            title="About">
            <NavLink to={"/about"} style={{ textDecoration: 'none'}}>About</NavLink>
          </NavItem>
        </Nav>

        <div className="text-center small copyright">
          &copy; {new Date().getFullYear()} QuizGame
        </div>
      </Grid>
    </footer>
  );
}

export default Footer;