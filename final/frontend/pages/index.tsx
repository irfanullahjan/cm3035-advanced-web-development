import { Form, FormikProvider, useFormik } from "formik";
import type { NextPage } from "next";
import Error from "next/error";
import { useContext, useState } from "react";
import { Button } from "reactstrap";
import { InputText } from "~components/InputText";
import { SessionContext } from "~pages/_app";

const Home: NextPage = () => {
  const { user } = useContext(SessionContext);

  const [posts, setPosts] = useState<any>([]);

  const formik_post = useFormik({
    initialValues: {
      body: "",
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.body) {
        errors.body = "Required";
      }
      return errors;
    },
    onSubmit: (values) => {
      formik_post.resetForm();
      fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            setPosts([data, ...posts]);
          }
        });
    },
  });

  if (!user)
    return (
      <p>You are not logged in. Please login or signup to use this site.</p>
    );
  return (
    <>
      <FormikProvider value={formik_post}>
        <Form>
          <InputText
            name="body"
            label="Create a new post to share with friends."
          />
          <Button type="submit">Post</Button>
        </Form>
      </FormikProvider>
      <br />
      <h2>Feed</h2>
      {posts && (
        <ul style={{listStyleType: "none"}} className="m-0 p-0">
          {posts.map((post) => (
            <li className="my-2 mx-0 p-3 border" key={post.id}>
              {post.body}
              <br />
              <small className="text-muted">by {post.username} on {post.created_at}</small>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Home;
