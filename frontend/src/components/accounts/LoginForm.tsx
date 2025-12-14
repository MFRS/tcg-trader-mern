import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage, type AuthProvider } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { Button, Popper } from '@mui/material';

// preview-start
function login(formData){
// https://react.dev/reference/react-dom/components/form
}


export default function LoginForm() {
  return (
<form action={login}>
  <text>Username</text>
  <input name="username"/>
  <text>Password</text>
  <input name="password"/>
      <Button>Login</Button>

</form>
  )
}
