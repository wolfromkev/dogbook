import React, { Component } from 'react';
import classes from './App.module.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Axios from 'axios';
import jwtDecode from 'jwt-decode';

//MUI
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

//redux
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
import { Provider } from 'react-redux';
import store from './redux/store';

//Components
import themeFile from './utility/theme';
import Navbar from './components/layout/Navbar';
import AuthRoute from './utility/AuthRoute';
import Home from './pages/home';
import User from './pages/user';
import LandingPage from './pages/landingPage';

const theme = createMuiTheme(themeFile);

Axios.defaults.baseURL =
	'https://us-central1-social-media-project-aa6cb.cloudfunctions.net/api';

const token = localStorage.FBIdToken;

if (token) {
	const decodedToken = jwtDecode(token);
	if (decodedToken.exp * 1000 < Date.now()) {
		store.dispatch(logoutUser());
		window.location.href = '/';
	} else {
		store.dispatch({ type: SET_AUTHENTICATED });
		Axios.defaults.headers.common['Authorization'] = token;
		store.dispatch(getUserData());
	}
}

class App extends Component {
	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<Provider store={store}>
					<BrowserRouter>
						<Navbar />
						<Switch>
							<AuthRoute exact path='/' component={LandingPage} />
							<div className={classes.container}>
								<Route exact path='/home' component={Home}></Route>
								<Route exact path='/dogs/:handle' component={User} />
								<Route
									exact
									path='/dogs/:handle/bark/:barkId'
									component={User}
								/>
							</div>
						</Switch>
					</BrowserRouter>
				</Provider>
			</MuiThemeProvider>
		);
	}
}

export default App;
