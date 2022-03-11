
import { Form, FormikErrors, FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/dist/client/router';
import { useContext, useState } from 'react';
import { Button, Spinner } from 'reactstrap';
import { InputText } from '~components/InputText';
import { SessionContext } from '~pages/_app';

const title = 'Sign up for a Circle account';

export default function Signup() {
  const { user } = useContext(SessionContext);
  const router = useRouter();
  const [formFeedback, setFormFeedback] = useState<{
    accent: string;
    message: string;
  }>();

  const formik = useFormik<{
    username?: string;
    email?: string;
    password?: string;
    verifyPassword?: string;
  }>({
    initialValues: {
      username: '',
      email: '',
      password: '',
      verifyPassword: '',
    },
    onSubmit: async values => {
      setFormFeedback(undefined);
      try {
        const formData = {
          ...values,
        };
        delete formData.verifyPassword;
        const res = await fetch('/api/user/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (res.status === 201) {
          setFormFeedback({
            accent: 'success',
            message: 'Signup successful. Redirecting you to login page.',
          });
          setTimeout(() => router.push('/user/login'), 1000);
        } else if (res.status === 400) {
          setFormFeedback({
            accent: 'danger',
            message:
              'Signup failed. Please retry with a different email or username.',
          });
          console.error(res);
        } else {
          throw res;
        }
      } catch (err) {
        setFormFeedback({
          accent: 'danger',
          message: 'Signup failed due to a network or server issue.',
        });
        console.error(err);
      }
    },
    validate: values => {
      let errors: FormikErrors<typeof values> = {};
      if (!values.username) {
        errors.username = 'Username is required';
      }
      if (!values.email) {
        errors.email = 'Email is required';
      }
      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      if (values.verifyPassword !== values.password) {
        errors.verifyPassword = "Passwords don't match";
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
      <h1>Signup</h1>
      <p>Please enter the following details to sign up for a Circle account.</p>
      <FormikProvider value={formik}>
        <Form>
          <InputText type="text" name="username" label="Username" />
          <InputText type="email" name="email" label="Email" />
          <InputText
            type="password"
            name="password"
            label="Password"
            minLength={8}
          />
          <InputText
            type="password"
            name="verifyPassword"
            label="Verify Password"
            minLength={8}
          />
          <Button type="submit" color="primary">
            Signup {formik.isSubmitting && <Spinner size="sm" color="light" />}
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

Signup.title = title;