import { Form, FormikErrors, FormikProvider, useFormik } from "formik";
import Error from "next/error";
import { useContext, useEffect, useState } from "react";
import { Button, Table } from "reactstrap";
import { FormikInput } from "~components/FormikInput";
import { genderCodeGroup } from "~constants/codeGroups";
import { SessionContext } from "~pages/_app";
import { getAgeInYears } from "~utils/getAgeInYears";

export default function Friends() {
  const { user } = useContext(SessionContext);
  const [friends, setFriends] = useState<any[]>([]);
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
      fetch(`/api/users/${values.searchText}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.[0]?.id) {
            setSearchResults(data);
          }
        });
    },
  });

  useEffect(() => {
    if (user) {
      fetch(`/api/friends/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          ContentType: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setFriends(data);
        });
    }
  }, [user, user?.id, user?.token]);

  if (!user) {
    return (
      <Error
        statusCode={401}
        title="Sorry! You need to be logged in to access this page."
      />
    );
  }

  const sendFriendRequest = async (friendId: number) => {
    await fetch(`/api/user/friend`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiver: friendId,
      })
    })
  }

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
      {searchResults.length > 0 && (
        <>
          <h3>Search results</h3>
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
                      <Button onClick={() => sendFriendRequest(result.id)}>Send Friend Request</Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <Button
            size="sm"
            onClick={(e) => {
              setShowMore(!showMore);
              e.preventDefault();
            }}
          >{`Show ${showMore ? "less" : "more"}`}</Button>
        </>
      )}
      <br />
      <br />
      <h1>Friends</h1>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {friends.map((friend) => (
            <tr key={friend.id}>
              <td>{`${friend.first_name} ${friend.last_name}`}</td>
              <td>{getAgeInYears(friend.birthday)}</td>
              <td>{friend.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
