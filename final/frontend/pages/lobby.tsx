import { Form, FormikProvider, useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Table } from "reactstrap";
import { FormikInput } from "~components/FormikInput";
import { SessionContext } from "~pages/_app";

export default function Lobby() {
  const { user } = useContext(SessionContext);
  const [messageHistory, setMessageHistory] = useState<
    { [string: string]: string }[]
  >([]);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/lobby");
    setSocket(ws);
    return () => {
      ws.close();
    };
  }, []);

  if (socket) {
    socket.onopen = () => {
      console.log("Connected to lobby");
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessageHistory([...messageHistory, data]);
    };
  }

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.message) {
        errors.message = "Required";
      }
      return errors;
    },
    onSubmit: (values) => {
      if (socket) {
        socket.send(
          JSON.stringify({
            message: values.message,
            username: user.username,
          })
        );
        formik.resetForm();
      }
    },
  });

  return (
    <div>
      <h1>Lobby</h1>
      {messageHistory.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Message</th>
              <th style={{ width: "15%" }}>Username</th>
              <th style={{ width: "15%" }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {messageHistory.map((message, index) => (
              <tr key={index}>
                <td>{message.message}</td>
                <td>{message.username}</td>
                <td>{message.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No messages yet, please send one to see it here.</p>
      )}
      <br />
      <FormikProvider value={formik}>
        <Form>
          <FormikInput label="Message" name="message" type="text" />
          <Button type="submit">Send</Button>
        </Form>
      </FormikProvider>
    </div>
  );
}
