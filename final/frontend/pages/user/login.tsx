
import { Form, FormikErrors, FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/dist/client/router';
import { useContext, useState } from 'react';
import { Button, Spinner } from 'reactstrap';
import { InputText } from '~components/InputText';
import { SessionContext } from '~pages/_app';

const title = 'Login to Circle';

export default function Login() {
  const { user, updateSession } = useContext(SessionContext);
  const [formFeedback, setFormFeedback] = useState<{
    accent: string;
    message: string;
  }>();

  const router = useRouter();

  const formik = useFormik<{
    username: string;
    password: string;
  }>({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async values => {
      setFormFeedback(undefined);
      try {
        const res = await fetch('/api/user/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        const authJson = await res.json();
        if (authJson.access && authJson.refresh) {
          localStorage.setItem('accessToken', authJson.access);
          localStorage.setItem('refreshToken', authJson.refresh);
          setFormFeedback({
            accent: 'success',
            message: 'Login successful. Redirecting you to home page.',
          });
        } else if (res.status === 401) {
          setFormFeedback({
            accent: 'danger',
            message:
              'Login failed. Please retry with correct email and password.',
          });
          console.error(res);
        } else {
          throw res;
        }
      } catch (err) {
        setFormFeedback({
          accent: 'danger',
          message: 'Login failed due to a network or server issue.',
        });
        console.error(err);
      }
      updateSession();
    },
    validate: values => {
      const errors: FormikErrors<typeof values> = {};
      if (!values.username) {
        errors.username = 'Username is required';
      }
      if (!values.password) {
        errors.password = 'Password is required';
      }
      return errors;
    },
  });

  if (user) {
    if (!formFeedback) {
      setFormFeedback({
        accent: 'info',
        message: 'You are already logged in. Redirecting you to home page.',
      });
    }
    setTimeout(() => router.push('/'), 1000);
  }

  return (
    <>
      <h1>Login</h1>
      <p>Please enter your credentials to login.</p>
      <FormikProvider value={formik}>
        <Form>
          <InputText name="username" label="Username" />
          <InputText
            type="password"
            name="password"
            label="Password"
          />
          <Button type="submit" color="primary">
            Login {formik.isSubmitting && <Spinner size="sm" color="light" />}
          </Button>
          {formFeedback && (
            <p className={`text-${formFeedback.accent} mt-3`}>
              {formFeedback.message}
            </p>
          )}
        </Form>
      </FormikProvider>
    </>
  );
}

Login.title = title;