import {
  Col,
  Container,
  Nav,
  Navbar,
  NavbarText,
  NavItem,
  Row,
} from 'reactstrap';
import { NavbarTop } from './NavbarTop';
import Link from 'next/link';

type Props = {
  children: JSX.Element;
};

export function Layout(props: Props) {
  const { children } = props;
  return (
    <>
      <div className="bg-dark">
        <Container>
          <Row>
            <Col>
              <NavbarTop />
            </Col>
          </Row>
        </Container>
      </div>
      <div style={{ flex: '1 0 auto' }}>
        <Container>
          <Row>
            <Col>{children}</Col>
          </Row>
        </Container>
      </div>
      <div className="bg-dark text-secondary" style={{ flexShrink: 0 }}>
        <Container>
          <Row>
            <Col>
              <Navbar>
                <Nav navbar>
                  <NavItem>
                    <Link href="/about">About</Link>
                  </NavItem>
                </Nav>
                <NavbarText>
                  &copy; EasyHomes {new Date().getFullYear()}
                </NavbarText>
              </Navbar>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}