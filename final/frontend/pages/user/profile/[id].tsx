import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "~pages/_app";
import Error from "next/error";
import { Table } from "reactstrap";
import { getAgeInYears } from "~utils/getAgeInYears";

const title = "User Profile";

export default function Profile() {
  const { user } = useContext(SessionContext);

  const router = useRouter();
  const { id } = router.query;

  const [userDetail, setUserDetail] = useState<any>(null);

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
          setUserDetail(data);
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
      {userDetail && (
        <Table>
          <tbody>
            <tr>
              <td>User ID</td>
              <td>{userDetail.id}</td>
            </tr>
            <tr>
              <td>Username</td>
              <td>{userDetail.username}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{userDetail.email}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{`${userDetail.first_name} ${userDetail.last_name}`}</td>
            </tr>
            <tr>
              <td>Age</td>
              <td>{getAgeInYears(userDetail.profile?.birthday)}</td>
            </tr>
          </tbody>
        </Table>
      )}
      {userDetail?.id === user.id && (
        <>
          <h2>My Posts</h2>
        </>
      )}
    </>
  );
}

Profile.title = title;
