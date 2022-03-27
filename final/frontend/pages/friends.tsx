import { Form, FormikErrors, FormikProvider, useFormik } from "formik";
import Error from "next/error";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Button, Table } from "reactstrap";
import { FormikInput } from "~components/FormikInput";
import { genderCodeGroup } from "~constants/codeGroups";
import { SessionContext } from "~pages/_app";
import { fetcher } from "~utils/fetcher";

const title = "Find friends";

export default function Friends() {
  const { user, updateSession } = useContext(SessionContext);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showMore, setShowMore] = useState(false);

  const formik = useFormik({
    initialValues: {
      searchText: "",
    },
    validate: (values) => {
      const errors: FormikErrors<typeof values> = {};
      if (!values.searchText) {
        errors.searchText = "Required";
      }
      return errors;
    },
    onSubmit: (values) => {
      fetch(`/api/user/${values.searchText}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.[0]?.id) {
            setSearchResults(data);
          }
        });
    },
  });

  if (!user) {
    return (
      <Error
        statusCode={401}
        title="Sorry! You need to be logged in to access this page."
      />
    );
  }

  const sendFriendRequest = (friendId: number) => {
    fetcher(`/api/request`, {
      method: "POST",
      body: JSON.stringify({
        receiver: friendId,
      }),
    }).then((res) => {
      if (res.status === 201) {
        updateSession();
      } else {
        console.log("Error sending friend request");
      }
    });
  };

  const friends = user.profile.friends;

  return (
    <>
      <h1>Find Friends</h1>
      <FormikProvider value={formik}>
        <Form>
          <FormikInput name="searchText" label="Search by username" />
          <Button type="submit" color="primary">
            Search
          </Button>
        </Form>
      </FormikProvider>
      <br />
      {searchResults.length > 0 ? (
        <>
          <h3>Search results</h3>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Gender</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {searchResults
                .filter((value, i) => showMore || i < 5)
                .map((result) => (
                  <tr key={result.username}>
                    <td>{`${result.first_name} ${result.last_name}`}</td>
                    <td>{result.username}</td>
                    <td>
                      {
                        genderCodeGroup.find(
                          (g) => g.value === result.profile?.gender
                        )?.name
                      }
                    </td>
                    <td>
                      <Link href={`/profile/${result.id}`}>View Profile</Link>
                    </td>
                    <td>
                      {user.profile.friends.find(
                        (friend) => friend.id === result.id
                      ) ? (
                        "Already friend"
                      ) : user.friend_requests_sent.find(
                          (request) => request.receiver.id === result.id
                        ) ? (
                        "Request sent"
                      ) : (
                        <Button onClick={() => sendFriendRequest(result.id)}>
                          Send Friend Request
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          {searchResults.length > 5 && (
            <Button
              size="sm"
              onClick={(e) => {
                setShowMore(!showMore);
                e.preventDefault();
              }}
            >{`Show ${showMore ? "less" : "more"}`}</Button>
          )}
        </>
      ) : (
        <p>No results found, try searching for a different username.</p>
      )}
      <br />
      <br />
      {friends.length > 0 && (
        <>
          <h1>Friends</h1>
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
              {friends.map((friend) => (
                <tr key={friend.id}>
                  <td>{`${friend.user.first_name} ${friend.user.last_name}`}</td>
                  <td>{friend.user.username}</td>
                  <td>
                    {
                      genderCodeGroup.find(
                        (g) => g.value === friend.user.profile?.gender
                      )?.name
                    }
                  </td>
                  <td>
                    <Link href={`/profile/${friend.user.id}`}>
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
}

Friends.title = title;
