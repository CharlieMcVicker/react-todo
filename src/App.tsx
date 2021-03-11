import React, { ReactElement } from "react";
import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import { TodosView } from "./views/todos";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  NavLink,
} from "react-router-dom";
import styled from "styled-components";
import { OverdueView } from "./views/overdue";

function AuthWrapper({
  App,
  Loading,
  ErrorWrapper,
  SignInPage,
}: {
  App: () => ReactElement;
  Loading: () => ReactElement;
  SignInPage: () => ReactElement;
  ErrorWrapper: (props: { error: any }) => ReactElement;
}): ReactElement {
  const [user, loading, error] = useAuthState(firebase.auth());
  if (loading) {
    return <Loading />;
  } else if (error) {
    return <ErrorWrapper error={error} />;
  } else if (user !== null) {
    return <App />;
  } else {
    return <SignInPage />;
  }
}

function SignInPage(): ReactElement {
  function signInWithGoogle() {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

const StyledApp = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 10px;
  display: grid;
  grid-template-areas: "nav switch";
  grid-template-columns: 200px 1fr;
  grid-template-rows: 1fr;
  overflow: hidden;
`;

const StyledNav = styled.nav`
  grid-area: nav;
  ul {
    list-style-type: none;
    li {
      padding: 0;
      margin: 10px 0;
      a {
        display: block;
        color: #333;
        &.active {
          font-weight: bold;
        }
      }
    }
  }
`;
const SwitchWrapper = styled.div`
  grid-area: switch;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;

function App(): ReactElement {
  return (
    <Router>
      <StyledApp>
        <StyledNav>
          <ul>
            <li>
              <NavLink to="/overdue" activeClassName="active">
                Overdue
              </NavLink>
            </li>
            <li>
              <NavLink to="/todos" activeClassName="active">
                Todos
              </NavLink>
            </li>
          </ul>
        </StyledNav>
        <SwitchWrapper>
          <Switch>
            <Route path="/overdue">
              <OverdueView />
            </Route>
            <Route path="/todos">
              <TodosView />
            </Route>
            <Route path="/">
              <Redirect to="/todos" />
            </Route>
          </Switch>
        </SwitchWrapper>
      </StyledApp>
    </Router>
  );
}

function Wrapper() {
  const Loading = () => (
    <div>
      <p>Loading...</p>
    </div>
  );
  const ErrorWrapper = (error: any) => (
    <div>
      <p>Error: {error}</p>
    </div>
  );

  return (
    <AuthWrapper
      App={App}
      SignInPage={SignInPage}
      Loading={Loading}
      ErrorWrapper={ErrorWrapper}
    />
  );
}

export default Wrapper;
