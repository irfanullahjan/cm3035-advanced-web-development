import Error from "next/error";
import { useContext } from "react";
import { Button, Table } from "reactstrap";
import { SessionContext } from "~pages/_app";
import { fetcher } from "~utils/fetcher";

export default function Requests() {
  const { user, updateSession } = useContext(SessionContext);

  const acceptRequest = (id: string) => {
    fetcher(`/api/request/${id}/accept`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        updateSession();
      }
    });
  };

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
              <th>Email</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {received.map(({ id, sender }) => (
              <tr key={sender.username}>
                <td>{sender.username}</td>
                <td>{sender.email}</td>
                <td>
                  <Button onClick={() => acceptRequest(id)}>Accept</Button>
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
              <th>Email</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sent.map(({ receiver }) => (
              <tr key={receiver.id}>
                <td>{receiver.username}</td>
                <td>{receiver.email}</td>
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
