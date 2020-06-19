import React, { Component } from 'react';
import classes from './App.module.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

//redux
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
import { getBarks, getMessages } from './redux/actions/dataActions';
import { Provider } from 'react-redux';
import store from './redux/store';

//Components
import Navbar from './components/layout/Navbar';
import Home from './pages/home';
import User from './pages/user';
import LandingPage from './pages/landingPage';
import Messaging from './components/messaging/Messanger';

axios.defaults.baseURL =
	'https://us-central1-social-media-project-aa6cb.cloudfunctions.net/api';

const token = localStorage.FBIdToken;

if (token) {
	const decodedToken = jwtDecode(token);
	if (decodedToken.exp * 1000 < Date.now()) {
		store.dispatch(logoutUser());
		window.location.href = '/';
	} else {
		store.dispatch({ type: SET_AUTHENTICATED });
		axios.defaults.headers.common['Authorization'] = token;
		store.dispatch(getUserData());
		store.dispatch(getBarks());
		store.dispatch(getMessages());
	}
}

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
					<Navbar />
					<Messaging />
					<Switch>
						<Route exact path='/' component={LandingPage} />
						<div className={classes.container}>
							<Route exact path='/home' component={Home} />
							<Route exact path='/dogs/:handle' component={User} />
							<Route exact path='/dogs/:handle/bark/:barkId' component={User} />
						</div>
					</Switch>
				</BrowserRouter>
			</Provider>
		);
	}
}

export default App;
