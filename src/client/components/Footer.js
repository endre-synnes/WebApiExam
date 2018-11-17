import React from 'react';
import { Grid, Nav, NavItem } from 'react-bootstrap';
import {Link} from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <Grid>
        <Nav justified>
          <NavItem componentClass={Link} href="/about" to="/about">About</NavItem>
        </Nav>
        <div className="text-center small copyright">
          &copy; {new Date().getFullYear()} QuizGame
        </div>
      </Grid>
    </footer>
  );
}

export default Footer;