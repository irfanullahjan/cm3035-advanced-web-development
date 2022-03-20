import React, { useContext, useState } from "react";
import Link from "next/link";
import {
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  ModalHeader,
} from "reactstrap";
import { SessionContext } from "~pages/_app";
import { useRouter } from "next/dist/client/router";

export const NavbarTop = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { user, updateSession, logout } = useContext(SessionContext);

  const toggle = () => setIsMenuOpen(!isMenuOpen);

  const router = useRouter();

  const handleClickLogout = (event: React.SyntheticEvent<HTMLElement>) => {
    event.preventDefault();
    setShowLogoutModal(true);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    router.push("/");
  };

  return (
    <Navbar color="dark" dark expand="md">
      <NavbarBrand
        onClick={() => router.push("/")}
        style={{ cursor: "pointer" }}
      >
        〇 Circle
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isMenuOpen} navbar>
        <Nav className="mr-auto" navbar>
          {user ? (
            <>
              <NavItem>
                <Link href="/lobby" passHref>
                  <NavLink>Lobby</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/requests" passHref>
                  <NavLink>Requests</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/friends" passHref>
                  <NavLink>Friends</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href={`/profile/${user.id}`} passHref>
                  <NavLink>Profile</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <NavLink href="/" onClick={handleClickLogout}>
                  Logout
                </NavLink>
                <Modal isOpen={showLogoutModal}>
                  <ModalHeader>Logout</ModalHeader>
                  <ModalBody>
                    <p>Are you sure you want to logout?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button onClick={handleLogout} color="danger">Yes, Logout</Button>
                    <Button onClick={() => setShowLogoutModal(false)}>Cancel</Button>
                  </ModalFooter>
                </Modal>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <Link href="/signup" passHref>
                  <NavLink>Signup</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/login" passHref>
                  <NavLink>Login</NavLink>
                </Link>
              </NavItem>
            </>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
};
