import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import FollowDog from './FollowDog';
import DeleteBark from './DeleteBark';
import BarkDialog from './BarkDialog';
import LikeButton from '../layout/LikeButton';
//MUI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Link from 'react-router-dom/Link';
//Icons

//Redux
import { connect } from 'react-redux';

const style = {
	card: {
		display: 'flex',
		margin: '0 2rem 2rem 0',
		position: 'relative',
		backgroundColor: 'rgb(28, 30, 31)',
	},
	image: {
		minWidth: 200,
	},
	content: {
		padding: 15,
		objectFit: 'cover',
		color: 'white',
		width: '100%',
	},
	cardTitle: {
		top: '80%',
		padding: 0,
		margin: 0,
	},
	hr: {
		visibility: 'hidden',
	},
	bodyContainer: {
		maxWidth: '100%',
		wordWrap: 'break-word',
	},
	followButton: {
		bottom: '10%',
		left: '94%',
		position: 'absolute',
	},
};

class Bark extends Component {
	render() {
		dayjs.extend(relativeTime);
		const {
			classes,
			bark: {
				body,
				createdAt,
				userImage,
				userHandle,
				barkId,
				likeCount,
				commentCount,
			},
			user: {
				authenticated,
				credentials: { handle },
			},
		} = this.props;

		const deleteButton =
			authenticated && userHandle === handle ? (
				<DeleteBark barkId={barkId}></DeleteBark>
			) : null;

		const followButton =
			authenticated && userHandle !== handle ? (
				<FollowDog userHandle={userHandle}> </FollowDog>
			) : null;

		return (
			<Card className={classes.card}>
				<CardMedia
					image={userImage}
					title='profile image'
					className={classes.image}
				/>

				<CardContent className={classes.content}>
					<Typography
						variant='h5'
						component={Link}
						to={`/dogs/${userHandle}`}
						color='primary'
						className={classes.cardTitle}
					>
						@{userHandle}
					</Typography>
					{deleteButton}
					<Typography variant='body1' color='primary'>
						{dayjs(createdAt).fromNow()}
					</Typography>
					<hr className={classes.hr} />
					<div className={classes.bodyContainer}>
						<Typography variant='h5'> {body}</Typography>
					</div>

					<hr className={classes.hr} />
					{likeCount}
					<LikeButton barkId={barkId} />

					<span>{commentCount}</span>
					<BarkDialog barkId={barkId} userHandle={userHandle}></BarkDialog>
					<span className={classes.followButton}>{followButton}</span>
				</CardContent>
			</Card>
		);
	}
}

Bark.propTypes = {
	bark: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
	openDialog: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	user: state.user,
	data: state.data.barks,
});

export default connect(mapStateToProps)(withStyles(style)(Bark));
