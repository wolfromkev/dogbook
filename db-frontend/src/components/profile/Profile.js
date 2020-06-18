import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { uploadImage } from '../../redux/actions/userActions';
import { getAllUsers } from '../../redux/actions/dataActions';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import EditDetails from './EditDetails';
import ProfileSkeleton from '../../utility/ProfileSkeleton';
import DefaultDog from '../../images/defaultDog.png';
import Following from './Following';
//MUI
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import MUILink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
//Icons
import LocationOn from '@material-ui/icons/LocationOn';
import CalendarToday from '@material-ui/icons/CalendarToday';
import Tooltip from '@material-ui/core/Tooltip';

const styles = {
	paper: {
		paddingTop: 20,
		position: 'relative',
		backgroundColor: 'rgb(28, 30, 31)',
		marginBottom: 20,
	},

	followPaper: {
		paddingTop: 10,
		position: 'relative',
		backgroundColor: 'rgb(28, 30, 31)',
	},
	gridColumn: {
		position: 'relative',
		maxWidth: '60%',
	},
	gridProfile: {},

	profile: {
		'& .image-wrapper': {
			textAlign: 'center',
			position: 'relative',
			cursor: 'pointer',
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

class Profile extends Component {
	handleImageChange = (event) => {
		const image = event.target.files[0];
		const formData = new FormData();
		formData.append('image', image, image.name);
		this.props.uploadImage(formData);
	};
	handleEditPicture = () => {
		const fileInput = document.getElementById('imgUpload');
		fileInput.click();
	};

	render() {
		const {
			classes,
			user: {
				credentials: { handle, createdAt, imageUrl, bio, website, location },
				loading,
				authenticated,
			},
		} = this.props;

		let profileMarkup = !loading ? (
			authenticated ? (
				<Fragment>
					<Grid className={classes.gridColumn} container direction='column'>
						<Paper className={classes.paper} elevation={3}>
							<Grid item sm className={classes.gridProfile}>
								{' '}
								<div className={classes.profile}>
									<Tooltip
										title='Click here to change your profile image!'
										placement='top'
									>
										<div className='image-wrapper'>
											<img
												src={imageUrl}
												alt='profile'
												className='profile-image'
												onClick={this.handleEditPicture}
											/>
											<input
												type='file'
												id='imgUpload'
												hidden='hidden'
												onChange={this.handleImageChange}
											/>
										</div>
									</Tooltip>

									<hr />
									<div className='profile-details'>
										<MUILink
											component={Link}
											to={`/dogs/${handle}`}
											className={classes.iconColor}
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
												<a
													href={website}
													target='_blank'
													rel='noopener noreferrer'
												>
													{website}
												</a>
												<hr />
											</Fragment>
										)}
										<CalendarToday className={classes.iconColor} />{' '}
										<span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
										<div>
											{' '}
											<EditDetails />{' '}
										</div>
									</div>
								</div>
							</Grid>
						</Paper>

						<Grid item sm>
							<Paper className={classes.followPaper} elevation={3}>
								<Following />
							</Paper>
						</Grid>
					</Grid>
				</Fragment>
			) : (
				<Paper className={classes.paper}>
					<div className={classes.profile}>
						<div className='image-wrapper'>
							<Typography variant='body2' align='center'>
								<img src={DefaultDog} className='profile-image' alt='profile' />
								<div className='buttons'>
									<Button
										variant='contained'
										color='primary'
										component={Link}
										to='/login'
									>
										{' '}
										Login
									</Button>
									<Button
										variant='contained'
										color='secondary'
										component={Link}
										to='/signup'
									>
										{' '}
										signup
									</Button>
								</div>
							</Typography>
						</div>
					</div>
				</Paper>
			)
		) : (
			<ProfileSkeleton />
		);

		return profileMarkup;
	}
}

const mapStateToProps = (state) => ({
	user: state.user,
});

const mapDistpatchToProps = { uploadImage, getAllUsers };

Profile.prototypes = {
	user: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
	logoutUser: PropTypes.func.isRequired,
	uploadImage: PropTypes.func.isRequired,
};

export default connect(
	mapStateToProps,
	mapDistpatchToProps
)(withStyles(styles)(Profile));
