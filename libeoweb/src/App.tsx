import * as Alert from 'context/Alert';
import * as Auth from 'context/Auth';
import * as User from 'context/User';
import * as React from 'react';
import { Router } from 'react-router-dom';
import history from 'store/history';
import AppRouter from './AppRouter';
import './styles/index.less';

interface IProps {}
interface IState {}

class App extends React.Component<IProps, IState> {
  render() {
    return (
      <Router history={history}>
        <Alert.Provider>
          <Auth.Provider>
            <Auth.Consumer>
              {({ auth }) => {
                const token = localStorage.getItem('token');
                return token ? (
                  <User.Provider token={token}>
                    <AppRouter />
                  </User.Provider>
                ) : (
                  <AppRouter />
                );
              }}
            </Auth.Consumer>
          </Auth.Provider>
        </Alert.Provider>
      </Router>
    );
  }
}

export default App;
