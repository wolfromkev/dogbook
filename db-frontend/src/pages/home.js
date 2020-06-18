import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Bark from '../components/bark/Bark';
import Profile from '../components/profile/Profile';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBarks, getMessages } from '../redux/actions/dataActions';
import BarkSkeleton from '../utility/BarkSkeleton';
import Switch from '@material-ui/core/Switch';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
	switch: {
		'& .MuiSwitch-colorSecondary.Mui-checked': {
			color: '#00bcd4',
		},
		'& .MuiSwitch-track': {
			backgroundColor: 'black',
		},

		'& .MuiSwitch-colorSecondary.Mui-checked +.MuiSwitch-track': {
			backgroundColor: '#00bcd4',
		},
	},
};

class Home extends Component {
	state = {
		feedType: true,
		userId: this.props.user,
	};

	componentDidMount() {
		this.props.getBarks();
		this.props.getMessages();
	}

	handleSwitch = () => {
		if (this.state.feedType === true) {
			this.setState({
				feedType: false,
			});
		}

		if (this.state.feedType === false) {
			this.setState({
				feedType: true,
			});
		}
	};

	render() {
		const { following } = this.props.user;
		const { barks, loading } = this.props.data;
		const { classes } = this.props;

		let barkMarkup = loading ? (
			<BarkSkeleton />
		) : this.state.feedType ? (
			barks.map((bark) => <Bark key={bark.barkId} bark={bark} />)
		) : (
			barks.map((bark) => {
				if (following.includes(bark.userHandle))
					return <Bark key={bark.barkId} bark={bark} />;
			})
		);

		let switchToggle = !following ? null : (
			<Fragment>
				<span> All Barks</span>
				<Switch
					onChange={this.handleSwitch}
					name='checkedA'
					inputProps={{ 'aria-label': 'secondary checkbox' }}
					className={classes.switch}
				/>
				<span> Following</span>
			</Fragment>
		);

		return (
			<Fragment>
				{switchToggle}
				<Grid container>
					<Grid item sm={8} xs={12}>
						{barkMarkup}
					</Grid>
					<Grid item sm={4} xs={12}>
						<Profile></Profile>
					</Grid>
				</Grid>
			</Fragment>
		);
	}
}

Home.propTypes = {
	getBarks: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	data: state.data,
	user: state.user.credentials,
});

export default connect(mapStateToProps, { getBarks, getMessages })(
	withStyles(styles)(Home)
);
