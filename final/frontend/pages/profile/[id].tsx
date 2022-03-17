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

  const [userPosts, setUserPosts] = useState<{}[]>([]);

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

  useEffect(() => {
    if (user && id) {
      fetch(`/api/user/${id}/posts`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          ContentType: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserPosts(data);
        });
    }
  }, [userDetail, user, id]);

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
      {userPosts?.length > 0 && (
        <>
          {userDetail?.id === user.id ? <h2>My Posts</h2> : <h2>User Posts</h2>}
          <Table>
            <tbody>
              {userPosts.map((post) => (
                <tr key={post.id}>
                  <td>{post.created_at}</td>
                  <td>{post.body}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
}

Profile.title = title;
