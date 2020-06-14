import React, { Component, Fragment } from 'react';
import classes from './Navbar.module.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MyButton from '../../utility/MyButton';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../redux/actions/userActions';
import { getAllUsers } from '../../redux/actions/dataActions';
import PostBark from '../bark/PostBark';
import Notifications from './Notifications';
import SearchModal from './searchModal';
import MUILink from '@material-ui/core/Link';
//Material UI
import InputBase from '@material-ui/core/InputBase';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Popper from '@material-ui/core/Popper';
//Icons
import HomeIcon from '@material-ui/icons/Home';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
import PetsIcon from '@material-ui/icons/Pets';
export class Navbar extends Component {
	state = {
		search: '',
		popperObject: null,
		popperOpened: true,
	};

	handleLogout = () => {
		this.props.logoutUser();
		window.location.href = '/';
	};

	handleModalOpen = () => {
		console.log(this.state.search);
		this.setState({ popperOpened: true });
	};

	clearSearch = () => {
		this.setState({ search: '' });
	};

	handleChange = (event) => {
		this.setState({
			search: event.target.value,
			popperObject: event.target,
		});
	};

	render() {
		const { authenticated, dogs } = this.props;

		let visibilityToggle = dogs.length === 0 ? 'hidden' : 'visible';

		return (
			<AppBar className={classes.navBar}>
				<Toolbar>
					<MUILink
						component={Link}
						to={`/home`}
						color='primary'
						underline='none'
						className={classes.dogbookLogoLink}
					>
						<h1 className={classes.dogBookLogo}>
							DogBook <PetsIcon />
						</h1>
					</MUILink>

					{authenticated ? (
						<Fragment>
							<div
								className={classes.search}
								style={{ visibility: visibilityToggle }}
							>
								<InputBase
									placeholder='Search'
									name='search'
									classes={{
										root: classes.inputRoot,
										input: classes.inputInput,
									}}
									onChange={(event) => this.handleChange(event)}
									inputProps={{ 'aria-label': 'search' }}
									autoComplete='off'
								></InputBase>

								<Popper
									open={this.state.search.length > 0}
									anchorEl={this.state.popperObject}
									className={classes.popper}
									placement='bottom'
									container={React.InputBase}
								>
									<SearchModal
										searchValue={this.state.search}
										clearSearch={this.clearSearch}
									></SearchModal>
								</Popper>
							</div>

							<div className={classes.iconTray}>
								<PostBark />
								<MyButton toolTip='Home' url='/home'>
									<HomeIcon color='secondary' />
								</MyButton>
								<Notifications />
								<MyButton toolTip='Logout' onClick={this.handleLogout}>
									<KeyboardReturn color='secondary' />
								</MyButton>
							</div>
						</Fragment>
					) : (
						<Fragment>
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
	dogs: state.data.dogs,
});

export default connect(mapStateToProps, { logoutUser, getAllUsers })(Navbar);
