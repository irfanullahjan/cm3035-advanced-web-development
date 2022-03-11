import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "~utils/fetcher";
import { SessionContext } from "~pages/_app";
import Error from "next/error";
import { Table } from "reactstrap";

const title = "User Profile";

export default function Profile() {
  const { user } = useContext(SessionContext);

  const router = useRouter();
  const { id } = router.query;

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (id && user) {
      fetch(`/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          ContentType: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
        });
    }
  }, [id, user, user?.token]);

  if (!user)
    return (
      <Error
        statusCode={401}
        title="Sorry! You need to be logged in to access this page."
      />
    );

  return (
    <>
      <h1>Profile</h1>
      {profile && (
        <Table>
          <tbody>
            <tr>
              <td>User ID</td>
              <td>{profile.id}</td>
            </tr>
            <tr>
              <td>Username</td>
              <td>{profile.username}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{profile.email}</td>
            </tr>
            <tr>
              <td>First Name</td>
              <td>{profile.first_name}</td>
            </tr>
            <tr>
              <td>Last Name</td>
              <td>{profile.last_name}</td>
            </tr>
          </tbody>
        </Table>
      )}
      {profile?.id === user.id && (
        <>
          <h2>My Posts</h2>
        </>
      )}
    </>
  );
}

Profile.title = title;
