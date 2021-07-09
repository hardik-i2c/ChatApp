import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { gql, useMutation } from "@apollo/client";

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $comfirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      comfirmPassword: $comfirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`;
export default function Register(props) {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    comfirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, __) => props.history.push("/login"),
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
  });
  const submitRegisterForm = (e) => {
    e.preventDefault();
    registerUser({ variables });
  };
  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Register</h1>
        <Form onSubmit={submitRegisterForm}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className={errors.email && "text-danger"}>
              {errors.email ?? "Email address"}
            </Form.Label>
            <Form.Control
              type="email"
              className={errors.email && "is-invalid"}
              value={variables.email}
              onChange={(e) => {
                setVariables({ ...variables, email: e.target.value });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label className={errors.username && "text-danger"}>
              {errors.username ?? "Username"}
            </Form.Label>
            <Form.Control
              type="text"
              className={errors.username && "is-invalid"}
              value={variables.username}
              onChange={(e) => {
                setVariables({ ...variables, username: e.target.value });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className={errors.password && "text-danger"}>
              {errors.password ?? "Password"}
            </Form.Label>
            <Form.Control
              type="password"
              className={errors.password && "is-invalid"}
              value={variables.password}
              onChange={(e) => {
                setVariables({ ...variables, password: e.target.value });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCpassword">
            <Form.Label className={errors.comfirmPassword && "text-danger"}>
              {errors.comfirmPassword ?? "Comfirm Password"}
            </Form.Label>
            <Form.Control
              type="password"
              className={errors.comfirmPassword && "is-invalid"}
              value={variables.comfirmPassword}
              onChange={(e) => {
                setVariables({
                  ...variables,
                  comfirmPassword: e.target.value,
                });
              }}
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "loading.." : "Register"}
            </Button>
            <br />
            <small>
              Already have an account. <Link to="/login">Login</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
