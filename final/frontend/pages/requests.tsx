import Error from "next/error";
import { useContext } from "react";
import { Button, Table } from "reactstrap";
import { SessionContext } from "~pages/_app";

export default function Requests() {
  const { user } = useContext(SessionContext);

  if (!user) {
    return (
      <Error
        statusCode={401}
        message="You must be logged in to view this page"
      />
    );
  }

  const received = user?.friend_requests_received;
  const sent = user?.friend_requests_sent;

  return (
    <>
      <h2>Requests Received</h2>
      {received.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Age</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {received.map((request) => (
              <tr key={request.username}>
                <td>{request.username}</td>
                <td>{request.first_name}</td>
                <td>
                  <Button>Accept</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No unaccepted friend requests</p>
      )}
      <h2>Requests Sent</h2>
      {sent.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Age</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sent.map((request) => (
              <tr key={request.username}>
                <td>{request.username}</td>
                <td>{request.first_name}</td>
                <td>
                  <Button>Revoke</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No sent friend requests</p>
      )}
    </>
  );
}
