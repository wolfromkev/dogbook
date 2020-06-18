import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MyButton from '../../utility/MyButton';
import withStyles from '@material-ui/core/styles/withStyles';
//MUI
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';

import { connect } from 'react-redux';
import { followUser, unfollowUser } from '../../redux/actions/userActions';

const styles = {
	textColoring: {
		color: '#00bcd4',
		marginBottom: '0.65rem',
	},
};

export class FollowDog extends Component {
	followedDog = () => {
		if (
			this.props.user.following &&
			this.props.user.following.find(
				(follow) => follow === this.props.userHandle
			)
		)
			return true;
		else return false;
	};

	handleFollow = () => {
		this.props.followUser(this.props.userHandle);
	};

	handleUnfollow = () => {
		this.props.unfollowUser(this.props.userHandle);
	};

	render() {
		const { classes } = this.props;
		const followButton = this.followedDog() ? (
			<MyButton toolTip='Unfollow' onClick={this.handleUnfollow}>
				<CheckOutlinedIcon className={classes.textColoring}>
					{' '}
				</CheckOutlinedIcon>
			</MyButton>
		) : (
			<MyButton toolTip='Follow' onClick={this.handleFollow}>
				<PersonAddOutlinedIcon className={classes.textColoring}>
					{' '}
				</PersonAddOutlinedIcon>
			</MyButton>
		);

		return followButton;
	}
}
FollowDog.propTypes = {
	user: PropTypes.object.isRequired,
	userHandle: PropTypes.string.isRequired,
	followUser: PropTypes.func.isRequired,
	unfollowUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	user: state.user.credentials,
});

const mapDispatchToProps = {
	followUser,
	unfollowUser,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(FollowDog));
