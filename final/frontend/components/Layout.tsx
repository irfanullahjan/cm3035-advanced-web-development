import { Col, Container, Row } from "reactstrap";
import { Navbar } from "./Navbar";

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
              <Navbar />
            </Col>
          </Row>
        </Container>
      </div>
      <div style={{ flex: "1 0 auto" }}>
        <Container>
          <Row>
            <Col className="py-4">{children}</Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
