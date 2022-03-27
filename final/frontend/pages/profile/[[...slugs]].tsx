import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "~pages/_app";
import Error from "next/error";
import { Button, Table } from "reactstrap";
import {
  formatDayMonth,
  getAgeInYears,
  getGenderName,
} from "~utils/formatters";
import { Post } from "~components/Post";
import { fetcher } from "~utils/fetcher";
import Image from "next/image";

const title = "User Profile";

export default function Profile() {
  const { user, updateSession } = useContext(SessionContext);

  const router = useRouter();

  // https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
  const { slugs } = router.query;

  // if no slugs, then user is viewing their own profile
  const id = slugs?.[0] ?? user?.id;

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
    if (id) {
      fetch(`/api/user/${id}/posts`)
        .then((res) => res.json())
        .then((data) => {
          setUserPosts(data);
        });
    }
  }, [id, user]);

  if (!user)
    return (
      <Error
        statusCode={401}
        title="Sorry! You need to be logged in to access this page."
      />
    );

  const unfriend = () => {
    if (confirm(`Are you sure you want to unfriend ${userDetail.username}?"`)) {
      fetcher(`/api/user/${id}/unfriend`, {
        method: "PATCH",
      }).then(() => {
        updateSession();
      });
    }
  };

  return (
    <>
      <h1>Profile</h1>
      {userDetail?.profile.avatar && (
        <Image
          src={userDetail?.profile.avatar}
          width={200}
          height={200}
          alt="avatar"
        />
      )}
      {userDetail && (
        <Table>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{`${userDetail.first_name} ${userDetail.last_name}`}</td>
            </tr>
            <tr>
              <td>Username</td>
              <td>{userDetail.username}</td>
            </tr>
            {userDetail.email && (
              <tr>
                <td>Email</td>
                <td>{userDetail.email}</td>
              </tr>
            )}
            {userDetail.profile && (
              <>
                <tr>
                  <td>Gender</td>
                  <td>{getGenderName(userDetail.profile.gender)}</td>
                </tr>
                {userDetail.profile.birthday && (
                  <>
                    <tr>
                      <td>Age</td>
                      <td>
                        {getAgeInYears(userDetail.profile.birthday)} years
                      </td>
                    </tr>
                    <tr>
                      <td>Birthday</td>
                      <td>{formatDayMonth(userDetail.profile.birthday)}</td>
                    </tr>
                  </>
                )}
              </>
            )}
          </tbody>
        </Table>
      )}
      {/* show unfriend button */}
      {user.profile.friends.find((friend) => friend.id === +id) && (
        <Button color="danger" className="mb-3" onClick={unfriend}>
          Unfriend
        </Button>
      )}
      {userPosts?.length > 0 && (
        <>
          {userDetail?.id === user.id ? (
            <h2>My Posts</h2>
          ) : (
            <h2>{userDetail?.first_name}'s Posts</h2>
          )}
          {userPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </>
      )}
    </>
  );
}

Profile.title = title;
