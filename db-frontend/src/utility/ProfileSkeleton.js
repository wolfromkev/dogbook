import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import defaultDog from '../images/defaultDog.png';
import Paper from '@material-ui/core/Paper';
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';

const styles = {
	handle: {
		height: 20,
		width: 60,
		margin: '0 auto 7px auto',
	},
	fullLine: {
		height: 15,
		backgroundColor: 'rgba(0,0,0,0.6)',
		width: '100%',
		marginBottom: 10,
	},
	halfLine: {
		height: 15,
		backgroundColor: 'rgba(0,0,0,0.6)',
		width: '50%',
		marginBottom: 10,
	},

	paper: {
		padding: 20,
		position: 'absolute',
		backgroundColor: 'rgb(28, 30, 31)',
	},

	buttons: {
		textAlign: 'center',
		'& a': {
			margin: '20px 10px',
		},
	},
	profileImage: {
		width: 200,
		height: 200,
		objectFit: 'cover',
		maxWidth: '100%',
		borderRadius: '50%',
	},

	imageWrapper: {
		textAlign: 'center',
		position: 'relative',
		cursor: 'pointer',
	},
	profileDetails: {
		textAlign: 'center',
		color: 'white',
	},
	iconColor: {
		color: '#00bcd4',
	},
};

const ProfileSkeleton = (props) => {
	const { classes } = props;

	return (
		<Paper className={classes.paper}>
			<div>
				<div className={classes.imageWrapper}>
					<img
						src={defaultDog}
						alt='profile'
						className={classes.profileImage}
					/>
				</div>

				<div className={classes.profileDetails}>
					<hr />
					<span className={classes.handle}> Loading dog stuff...</span>
					<hr />
					<LocationOn className={classes.iconColor} /> <span>Location...</span>
					<hr />
					<LinkIcon className={classes.iconColor}>
						{' '}
						www.dogbook.com...
					</LinkIcon>{' '}
					<span>www.dogbook.com</span>
					<hr />
					<CalendarToday className={classes.iconColor}>
						{' '}
						Today...{' '}
					</CalendarToday>{' '}
					<span>Today... </span>
				</div>
			</div>
		</Paper>
	);
};

ProfileSkeleton.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileSkeleton);
