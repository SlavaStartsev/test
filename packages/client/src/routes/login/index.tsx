import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { Field, Formik } from 'formik';

import { LoginComponent } from '../../generated/apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { InputField } from './InputField';

function Login({ history }: RouteComponentProps) {
  return (
    <>
      <LoginComponent>
        {login => (
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={async (data, { setErrors }) => {
              console.log(data);
              const response = await login({
                variables: data,
              });
              console.log(response);
              if (response && response.data && !response.data.login) {
                setErrors({
                  username: 'invalid login',
                });
                return;
              }

              history.push('/');
            }}
            initialValues={{
              username: '',
              password: '',
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field name="username" placeholder="username" component={InputField} />
                <Field
                  name="password"
                  placeholder="password"
                  type="password"
                  component={InputField}
                />
                <button type="submit">submit</button>
              </form>
            )}
          </Formik>
        )}
      </LoginComponent>
    </>
  );
}

export default withRouter(Login);
