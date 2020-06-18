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
import Typography from '@material-ui/core/Typography';
import Link from 'react-router-dom/Link';

//Redux
import { connect } from 'react-redux';

const style = {
	card: {
		display: 'flex',
		margin: '0 2rem 2rem 0',
		position: 'relative',
		backgroundColor: 'rgb(28, 30, 31)',
	},

	imageContainer: {
		display: 'flex',
		alignItems: 'center',
	},

	image: {
		minWidth: 200,
		maxHeight: 200,
		objectFit: 'cover',
		borderRadius: '50%',
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
		color: '#00bcd4',
	},
	hr: {
		visibility: 'hidden',
	},
	bodyContainer: {
		wordWrap: 'break-word',
		width: '100%',
	},
	followButton: {
		paddingBottom: '2rem',
		display: 'flex',
	},

	iconTray: {
		display: 'flex',
	},

	handlerFollowSpan: {
		width: '100%',
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
				credentials: { handle },
			},
		} = this.props;

		const deleteButton =
			userHandle === handle ? <DeleteBark barkId={barkId}></DeleteBark> : null;

		const followButton =
			userHandle !== handle ? (
				<FollowDog userHandle={userHandle}> </FollowDog>
			) : null;

		return (
			<Card className={classes.card}>
				<div className={classes.imageContainer}>
					<img src={userImage} className={classes.image} alt='dogPhoto'></img>
				</div>

				<CardContent className={classes.content}>
					<span className={classes.handlerFollowSpan}>
						<Typography
							variant='h5'
							component={Link}
							to={`/dogs/${userHandle}`}
							className={classes.cardTitle}
						>
							@{userHandle}
						</Typography>

						{followButton}

						{deleteButton}
					</span>

					<Typography variant='body1' className={classes.textColoring}>
						{dayjs(createdAt).fromNow()}
					</Typography>
					<hr className={classes.hr} />
					<div className={classes.bodyContainer}>
						<Typography variant='h5' className={classes.bodyText}>
							{' '}
							{body}
						</Typography>
					</div>
					<hr className={classes.hr} />
					<span className={classes.iconTray}>
						<span>
							{likeCount}
							<LikeButton barkId={barkId} />
						</span>
						<span>
							{commentCount}
							<BarkDialog barkId={barkId} userHandle={userHandle} />
						</span>
					</span>
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
