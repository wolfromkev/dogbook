import React, { Component } from 'react';
import MyButton from '../../utility/MyButton';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
//Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import { connect } from 'react-redux';
import { likeBark, unlikeBark } from '../../redux/actions/dataActions';

const styles = {
	iconColor: {
		color: '#00bcd4',
	},
};
export class likeButton extends Component {
	likedBark = () => {
		if (
			this.props.user.likes &&
			this.props.user.likes.find((like) => like.barkId === this.props.barkId)
		)
			return true;
		else return false;
	};
	likeBark = () => {
		this.props.likeBark(this.props.barkId);
	};
	unlikeBark = () => {
		this.props.unlikeBark(this.props.barkId);
	};

	render() {
		const { classes } = this.props;
		const { authenticated } = this.props.user;
		const likeButton = !authenticated ? (
			<MyButton toolTip='Login to like a post!'>
				<FavoriteBorder className={classes.iconColor}></FavoriteBorder>
			</MyButton>
		) : this.likedBark() ? (
			<MyButton toolTip='Unlike' onClick={this.unlikeBark}>
				<FavoriteIcon className={classes.iconColor}></FavoriteIcon>
			</MyButton>
		) : (
			<MyButton toolTip='Like' onClick={this.likeBark}>
				<FavoriteBorder className={classes.iconColor}></FavoriteBorder>
			</MyButton>
		);
		return likeButton;
	}
}

likeButton.propTypes = {
	user: PropTypes.object.isRequired,
	barkId: PropTypes.string.isRequired,
	likeBark: PropTypes.func.isRequired,
	unlikeBark: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	user: state.user,
});

const mapDispatchToProps = {
	likeBark,
	unlikeBark,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(likeButton));
