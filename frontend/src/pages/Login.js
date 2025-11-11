import { useMutation, gql } from "@apollo/client";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const LOGIN = gql`
  query($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [doLogin, { loading, error }] = useMutation(LOGIN);

  const handleLogin = async () => {
    const res = await doLogin({ variables: form });
    login(res.data.login);
    window.location = "/dashboard";
  };

  return (
    <div style={{padding:20}}>
      <h2>Login (Phase 2)</h2>
      <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <br/><br/>
      <input placeholder="Password" type="password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
      <br/><br/>
      <button onClick={handleLogin} disabled={loading}>Login</button>
      {error && <p style={{color:'red'}}>Login failed</p>}
    </div>
  );
}
