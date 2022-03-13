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

  console.log(searchResults);

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

  if (!user)
    return (
      <Error
        statusCode={401}
        title="Sorry! You need to be logged in to access this page."
      />
    );

  return (
    <>
      <h1>Find Friends</h1>
      <FormikProvider value={formik}>
        <Form>
          <FormikInput name="searchText" label="Search text" />
          <Button type="submit">Search</Button>
        </Form>
      </FormikProvider>
      {searchResults.length > 0 && (
        <>
          <h3>Search results</h3>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Gender</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result) => (
                <tr key={result.username}>
                  <td>{`${result.first_name} ${result.last_name}`}</td>
                  <td>{result.username}</td>
                  <td>{genderCodeGroup.find((g) => g.value === result.profile?.gender)?.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
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
