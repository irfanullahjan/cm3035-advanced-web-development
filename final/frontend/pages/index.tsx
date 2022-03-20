import { Form, FormikProvider, useFormik } from "formik";
import type { NextPage } from "next";
import { useContext } from "react";
import { Button, Spinner } from "reactstrap";
import useSWR from "swr";
import { FormikInput } from "~components/FormikInput";
import { Post } from "~components/Post";
import { REFRESH_INTERVAL } from "~constants/general";
import { SessionContext } from "~pages/_app";
import { fetcher } from "~utils/fetcher";
import { fetcherSwr } from "~utils/fetcherSwr";
import { formatDate } from "~utils/formatters";

const Home: NextPage = () => {
  const { user } = useContext(SessionContext);

  const {
    data: posts,
    error,
    isValidating,
    mutate: mutatePosts,
  } = useSWR(user ? "/api/post" : null, fetcherSwr, {
    refreshInterval: REFRESH_INTERVAL,
  });

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
      fetcher("/api/post", {
        method: "POST",
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((newPost) => {
          if (newPost.id) {
            mutatePosts([newPost, ...posts]);
          }
        });
    },
  });

  if (!user)
    return (
      <p>You are not logged in. Please login or signup to use this site.</p>
    );
  if (error) {
    return <div>failed to load</div>;
  }

  return (
    <>
      <FormikProvider value={formik_post}>
        <Form>
          <FormikInput
            name="body"
            label="Create a new post to share with friends."
          />
          <Button type="submit" color="primary">
            Post
          </Button>
        </Form>
      </FormikProvider>
      <br />
      <h2>Feed {isValidating && <Spinner />}</h2>
      {posts && posts.map((post) => <Post key={post.id} post={post} />)}
    </>
  );
};

export default Home;
