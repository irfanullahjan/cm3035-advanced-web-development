import { Form, FormikErrors, FormikProvider, useFormik } from "formik";
import { useRouter } from "next/dist/client/router";
import { useContext, useState } from "react";
import { Button, Col, Container, FormGroup, Row, Spinner } from "reactstrap";
import { FormikInput } from "~components/FormikInput";
import { genderCodeGroup } from "~constants/codeGroups";
import { SessionContext } from "~pages/_app";
import { getAgeInYears } from "~utils/getAgeInYears";

const title = "Sign up for a Circle account";

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
    first_name?: string;
    last_name?: string;
    password?: string;
    verifyPassword?: string;
    profile: {
      birthday?: string;
      gender?: string;
    };
  }>({
    initialValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      verifyPassword: "",
      profile: {
        birthday: "",
        gender: "",
      },
    },
    onSubmit: async (values) => {
      setFormFeedback(undefined);
      try {
        const formData = {
          ...values,
        };
        delete formData.verifyPassword;
        const res = await fetch("/api/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (res.status === 201) {
          setFormFeedback({
            accent: "success",
            message: "Signup successful. Redirecting you to login page.",
          });
          setTimeout(() => router.push("/user/login"), 1000);
        } else if (res.status === 400) {
          setFormFeedback({
            accent: "danger",
            message:
              "Signup failed. Please retry with a different email or username.",
          });
          console.error(res);
        } else {
          throw res;
        }
      } catch (err) {
        setFormFeedback({
          accent: "danger",
          message: "Signup failed due to a network or server issue.",
        });
        console.error(err);
      }
    },
    validate: (values) => {
      let errors: FormikErrors<typeof values> = {};
      if (!values.username) {
        errors.username = "Username is required";
      }
      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
      if (!values.first_name) {
        errors.first_name = "First name is required";
      }
      if (!values.last_name) {
        errors.last_name = "Last name is required";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
      if (values.verifyPassword !== values.password) {
        errors.verifyPassword = "Passwords don't match";
      }
      if (!values.profile?.birthday) {
        if (!errors.profile) errors.profile = {};
        errors.profile.birthday = "Date of birth is required.";
      } else if (18 > getAgeInYears(values.profile.birthday)) {
        if (!errors.profile) errors.profile = {};
        errors.profile.birthday = "You must be 18 years or older to sign up.";
      }
      if (!values.profile?.gender) {
        if (!errors.profile) errors.profile = {};
        errors.profile.gender = "Gender must be selected.";
      }
      if (errors.profile && Object.keys(errors.profile).length === 0) {
        delete errors.profile;
      }
      return errors;
    },
  });

  console.log(formik.values);

  if (user) {
    if (!formFeedback) {
      setFormFeedback({
        accent: "info",
        message: "You are already logged in. Redirecting you to home page.",
      });
    }
    setTimeout(() => router.push("/"), 1000);
  }

  return (
    <>
      <h1>Signup</h1>
      <p>Please enter the following details to sign up for a Circle account.</p>
      <FormikProvider value={formik}>
        <Form>
          <Container className="px-0">
            <Row>
              <Col md={6}>
                <FormikInput type="text" name="username" label="Username" />
              </Col>
              <Col md={6}>
                <FormikInput type="email" name="email" label="Email" />
              </Col>
              <Col md={6}>
                <FormikInput type="text" name="first_name" label="First name" />
              </Col>
              <Col md={6}>
                <FormikInput type="text" name="last_name" label="Last name" />
              </Col>
              <Col md={6}>
                <FormikInput
                  type="password"
                  name="password"
                  label="Password"
                  minLength={8}
                />
              </Col>
              <Col md={6}>
                <FormikInput
                  type="password"
                  name="verifyPassword"
                  label="Verify Password"
                  minLength={8}
                />
              </Col>
              <Col md={6}>
                <FormikInput type="select" name="profile.gender" label="Gender">
                  <option disabled value=""></option>
                  {genderCodeGroup.map((gender) => (
                    <option key={gender.value} value={gender.value}>
                      {gender.name}
                    </option>
                  ))}
                </FormikInput>
              </Col>
              <Col md={6}>
                <FormikInput
                  type="date"
                  name="profile.birthday"
                  label="Birthday"
                />
              </Col>
            </Row>
          </Container>

          {/* <FormikInput type='file' name='picture' label='Profile picture' /> */}

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
