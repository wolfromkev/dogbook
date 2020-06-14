import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Bark from '../components/bark/Bark';
import { connect } from 'react-redux';
import StaticProfile from '../components/profile/StaticProfile';
import BarkSkeleton from '../utility/BarkSkeleton';
import ProfileSkeleton from '../utility/ProfileSkeleton';
import Grid from '@material-ui/core/Grid';
import { getUserData } from '../redux/actions/dataActions';
import sadDog from '../images/sadDog.jpg';
import Paper from '@material-ui/core/Paper';
import { Redirect } from 'react-router-dom';

const styles = {
	sadDog: {
		position: 'relative',
		padding: 20,
		width: 400,
		objectFit: 'contain',
	},
	Paper: {
		position: 'absolute',
		backgroundColor: 'rgb(28, 30, 31)',
		color: 'white',
		textAlign: 'center',
		left: '4rem',
		borderRadius: '1',
	},
};

class user extends Component {
	state = {
		profile: null,
	};
	componentDidMount() {
		const handle = this.props.match.params.handle;

		this.props.getUserData(handle);
		axios
			.get(`/dog/${handle}`)
			.then((res) => {
				this.setState({
					profile: res.data.user,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	componentDidUpdate(prevProps) {
		if (this.props.match.params.handle !== prevProps.match.params.handle) {
			const handle = this.props.match.params.handle;
			this.props.getUserData(handle);
			axios
				.get(`/dog/${handle}`)
				.then((res) => {
					this.setState({
						profile: res.data.user,
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
	render() {
		const { barks, loading } = this.props.data;
		const { classes } = this.props;
		const {
			authenticated,
			credentials: { handle },
		} = this.props.user;

		if (this.props.match.params.handle === handle) {
			return <Redirect to='/home' />;
		}

		const barksMarkup = loading ? (
			<BarkSkeleton />
		) : barks.length === 0 ? (
			<Fragment>
				<Paper className={classes.Paper} levation={3}>
					<p>No Barks from this user so far...</p>
					<img src={sadDog} className={classes.sadDog} alt='No post dog' />
				</Paper>
			</Fragment>
		) : (
			barks.map((bark) => <Bark key={bark.barkId} bark={bark}></Bark>)
		);

		return (
			<Grid container>
				<Grid item sm={8} xs={12}>
					{barksMarkup}
				</Grid>
				<Grid item sm={4} xs={12}>
					{this.state.profile === null ? (
						<ProfileSkeleton />
					) : (
						<StaticProfile profile={this.state.profile}></StaticProfile>
					)}{' '}
				</Grid>
			</Grid>
		);
	}
}

user.prototypes = {
	getUserData: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	data: state.data,
	user: state.user,
});

export default connect(mapStateToProps, { getUserData })(
	withStyles(styles)(user)
);
