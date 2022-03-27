import React, { useContext, useState } from "react";
import {
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Navbar as RsNavbar,
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
import { NavbarLinks } from "./NavbarLinks";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { user, logout } = useContext(SessionContext);

  const toggle = () => setIsMenuOpen(!isMenuOpen);

  const router = useRouter();

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    router.push("/");
  };

  const authenticatedLinks = [
    {
      href: "/lobby",
      text: "Lobby",
    },
    {
      href: "/requests",
      text: "Requests",
    },
    {
      href: "/friends",
      text: "Friends",
    },
    {
      href: "/profile",
      text: "Profile",
    },
  ];

  const unauthenticatedLinks = [
    {
      href: "/login",
      text: "Login",
    },
    {
      href: "/signup",
      text: "Signup",
    },
  ];

  return (
    <RsNavbar color="dark" dark expand="md">
      <NavbarBrand
        onClick={() => router.push("/")}
        style={{ cursor: "pointer" }}
      >
        ● Circle
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isMenuOpen} navbar>
        <Nav className="mr-auto" navbar>
          {user ? (
            <>
              <NavbarLinks links={authenticatedLinks} />
              <NavItem>
                <NavLink href="/logout" onClick={event => {
                  event.preventDefault();
                  setShowLogoutModal(true);
                }}>
                  Logout
                </NavLink>
                <Modal isOpen={showLogoutModal}>
                  <ModalHeader>Logout</ModalHeader>
                  <ModalBody>
                    <p>Are you sure you want to logout?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button onClick={handleLogout} color="danger">
                      Yes, Logout
                    </Button>
                    <Button onClick={() => setShowLogoutModal(false)}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>
              </NavItem>
            </>
          ) : (
            <NavbarLinks links={unauthenticatedLinks} />
          )}
        </Nav>
      </Collapse>
    </RsNavbar>
  );
};
