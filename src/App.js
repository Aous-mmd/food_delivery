import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import 'react-toastify/dist/ReactToastify.css';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));
const Layout = React.lazy(() => import('./views/website/Layout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));


const App = () => {

  const cookies = new Cookies();
  const authCookie = cookies.get('authCookie');
  const [isAuthenticated, setIsAuthenticated] = useState(!!authCookie);

  useEffect(() => {
    if (authCookie) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false)
    }
  }, [authCookie])

  const authenticator = (toggleAuthenticator) => {
    setIsAuthenticated(toggleAuthenticator);
  }

  return (
    <HashRouter>
      <React.Suspense fallback={loading}>
        <Switch>
          <Route exact path="/dashboard/admin/login" name="Login Page" render={props => <Login isAuthenticated={authenticator} {...props} />} />
          <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
          <Route path="/dashboard/admin" name="Home"
            render={props => isAuthenticated ? <TheLayout isAuthenticated={authenticator} {...props} /> : <Redirect to='/dashboard/admin/login' />
            } />
          <Route path="/" name="Home" render={props => <Layout {...props} />} />
          <Route path="*" name="Page 500" render={props => <Page500 {...props} />} />
        </Switch>
      </React.Suspense>
    </HashRouter>
  );
}

export default App;
