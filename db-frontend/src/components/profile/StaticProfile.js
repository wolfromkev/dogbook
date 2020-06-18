import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import MUILink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import FollowDog from '../bark/FollowDog';

const styles = {
	paper: {
		padding: 20,
		position: 'absolute',
		backgroundColor: 'rgb(28, 30, 31)',
	},
	profile: {
		'& .image-wrapper': {
			textAlign: 'center',
			position: 'relative',
			'& button': {
				position: 'absolute',
				top: '80%',
				left: '70%',
			},
		},
		'& .profile-image': {
			width: 200,
			height: 200,
			objectFit: 'cover',
			maxWidth: '100%',
			borderRadius: '50%',
		},
		'& .profile-details': {
			textAlign: 'center',
			color: 'white',
			'& span, svg': {
				verticalAlign: 'middle',
			},
			'& a': {
				color: '#00bcd4',
			},
		},
		'& hr': {
			border: 'none',
			margin: '0 0 10px 0',
		},
		'& svg.button': {
			'&:hover': {
				cursor: 'pointer',
			},
		},
	},
	buttons: {
		textAlign: 'center',
		'& a': {
			margin: '20px 10px',
		},
	},

	iconColor: {
		color: '#00bcd4',
	},
};

const StaticProfile = (props) => {
	const {
		classes,
		profile: { handle, createdAt, imageUrl, bio, website, location },
	} = props;
	const { authenticated } = props.user;

	const followButton = authenticated ? (
		<FollowDog className={classes.followButton2} userHandle={handle}>
			{' '}
		</FollowDog>
	) : null;

	return (
		<Paper className={classes.paper}>
			<div className={classes.profile}>
				<div className='image-wrapper'>
					<img src={imageUrl} alt='profile' className='profile-image' />
				</div>
				<hr />
				<div className='profile-details'>
					<MUILink
						component={Link}
						to={`/dogs/${handle}`}
						color='primary'
						variant='h5'
					>
						@{handle}
					</MUILink>
					<hr />
					{bio && <Typography variant='body2'> {bio} </Typography>}
					<hr />
					{location && (
						<Fragment>
							<LocationOn className={classes.iconColor} />
							<span>{location}</span>
							<hr />
						</Fragment>
					)}
					{website && (
						<Fragment>
							<LinkIcon className={classes.iconColor}></LinkIcon>
							<a href={website} target='_blank' rel='noopener noreferrer'>
								{website}
							</a>
							<hr />
						</Fragment>
					)}
					<CalendarToday className={classes.iconColor} />{' '}
					<span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
					<div>{followButton}</div>
				</div>
			</div>
		</Paper>
	);
};

StaticProfile.prototypes = {
	profile: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	data: state.data,
	user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(StaticProfile));
