import Error from "next/error";
import { useContext } from "react";
import { Button, Table } from "reactstrap";
import { SessionContext } from "~pages/_app";
import { fetcher } from "~utils/fetcher";
import { getGenderName } from "~utils/formatters";

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

  const received: { [key: string]: any }[] = user?.friend_requests_received;
  const sent: { [key: string]: any }[] = user?.friend_requests_sent;

  return (
    <>
      <h2>Requests Received</h2>
      {received.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Gender</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {received.map(({ id, sender }) => (
              <tr key={sender.username}>
                <td>{sender.first_name} {sender.last_name}</td>
                <td>{sender.username}</td>
                <td>{getGenderName(sender.profile.gender)}</td>
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
              <th>Name</th>
              <th>Username</th>
              <th>Gender</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sent.map(({ receiver }) => (
              <tr key={receiver.id}>
                <td>
                  {receiver.first_name} {receiver.last_name}
                </td>
                <td>{receiver.username}</td>
                <td>{getGenderName(receiver.profile.gender)}</td>
                <td>
                  <Button
                    color="danger"
                    onClick={() =>
                      alert(
                        "Sorry, revoking friend request is not currently supported."
                      )
                    }
                  >
                    Revoke
                  </Button>
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
