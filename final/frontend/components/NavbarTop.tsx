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
} from "reactstrap";
import { SessionContext } from "~pages/_app";
import { useRouter } from "next/dist/client/router";
import { ACCESS_TOKEN } from "~utils/useSession";

export const NavbarTop = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user, updateSession } = useContext(SessionContext);

  const toggle = () => setIsOpen(!isOpen);

  const router = useRouter();

  const handleLogout = (event: any) => {
    if (confirm("Are you sure you want to logout?")) {
      event.preventDefault();
      localStorage.removeItem(ACCESS_TOKEN);
      updateSession();
      router.push("/");
    }
  };

  return (
    <Navbar color="dark" dark expand="md">
      <NavbarBrand
        onClick={() => router.push("/")}
        style={{ cursor: "pointer" }}
      >
        Circle
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
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
                <Link href="/" passHref>
                  <NavLink onClick={handleLogout} style={{ cursor: "pointer" }}>
                    Logout
                  </NavLink>
                </Link>
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
