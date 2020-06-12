import React, { Component, Fragment } from 'react';
import classes from './Navbar.module.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MyButton from '../../utility/MyButton';
import { logoutUser } from '../../redux/actions/userActions';
import PostBark from '../bark/PostBark';
import Notifications from './Notifications';

//Material UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

//Icons
import HomeIcon from '@material-ui/icons/Home';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

export class Navbar extends Component {
	handleLogout = () => {
		this.props.logoutUser();
		window.location.href = '/';
	};
	render() {
		const { authenticated } = this.props;
		return (
			<AppBar className={classes.navBar}>
				<Toolbar>
					<h1 className={classes.dogBookLogo}>DogBook</h1>
					{authenticated ? (
						<Fragment className={classes.navContainer}>
							<PostBark />

							<MyButton toolTip='Home' url='/home'>
								<HomeIcon color='secondary' />
							</MyButton>

							<Notifications />

							<MyButton toolTip='Logout' onClick={this.handleLogout}>
								<KeyboardReturn color='secondary' />
							</MyButton>
						</Fragment>
					) : (
						<Fragment className={classes.navContainer}>
							<MyButton toolTip='Home' url='/'>
								<HomeIcon color='secondary' />
							</MyButton>
						</Fragment>
					)}
				</Toolbar>
			</AppBar>
		);
	}
}

Navbar.propTypes = {
	authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
