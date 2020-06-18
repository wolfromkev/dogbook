import React, { Component, Fragment } from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
//Icons
import NotificationsIcon from '@material-ui/icons/Notifications';
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
//Redux
import { connect } from 'react-redux';
import { markNotificationsRead } from '../../redux/actions/userActions';

const styles = {
	individualIcon: {
		color: '#00bcd4 !important',
	},

	Menu: {
		color: 'white',
		'& .MuiPaper-root': {
			backgroundColor: '#333',
		},
		'& .MuiTypography-body1': {
			color: 'white',
		},
	},

	iconColorNotRead: {
		color: '#00bcd4',
	},
	iconColorRead: {
		color: '#008091',
	},
	notificationTypography: {
		color: 'white',
		'& .MuiTypography-root': {
			color: '#white',
		},
	},
};
class Notifications extends Component {
	state = {
		anchorElement: null,
	};

	onMenuOpen = () => {
		let unreadNotificationsIds = this.props.notifications
			.filter((note) => !note.read)
			.map((note) => note.notificationId);
		this.props.markNotificationsRead(unreadNotificationsIds);
	};

	handleClose = () => {
		this.setState({ anchorElement: null });
	};

	handleOpen = (event) => {
		this.setState({ anchorElement: event.target });
	};

	render() {
		const { classes } = this.props;
		dayjs.extend(relativeTime);
		const notifications = this.props.notifications;
		const anchorElement = this.state.anchorElement;
		let notificationIcon;
		if (notifications && notifications.length > 0) {
			notifications.filter((not) => not.read === false).length > 0
				? (notificationIcon = (
						<Badge
							badgeContent={
								notifications.filter((not) => not.read === false).length
							}
						>
							<NotificationsIcon />
						</Badge>
				  ))
				: (notificationIcon = <NotificationsIcon />);
		} else {
			notificationIcon = <NotificationsIcon />;
		}

		let notificationsMarkup =
			notifications && notifications.length > 0 ? (
				notifications.map((note) => {
					const verb = note.type === 'like' ? 'liked' : 'commented on';
					const time = dayjs(note.createdAt).fromNow();
					const iconColor = note.read
						? classes.iconColorRead
						: classes.iconColorNotRead;
					const icon =
						note.type === 'like' ? (
							<FavoriteIcon className={iconColor} style={{ marginRight: 10 }} />
						) : (
							<ChatIcon className={iconColor} style={{ marginRight: 10 }} />
						);
					return (
						<MenuItem key={note.createdAt} onClick={this.handleClose}>
							{icon}
							<Typography
								component={Link}
								color='default'
								variant='body1'
								to={`/dogs/${note.recipient}/bark/${note.barkId}`}
								className={classes.notificationTypography}
							>
								{note.sender} {verb} your bark at {time}
							</Typography>
						</MenuItem>
					);
				})
			) : (
				<MenuItem onClick={this.handleClose}>No Notifications</MenuItem>
			);

		return (
			<Fragment>
				<Tooltip placement='top' title='Notifications'>
					<IconButton
						aria-owns={anchorElement ? 'simple-menu' : undefined}
						aria-haspopup='true'
						onClick={this.handleOpen}
						className={classes.individualIcon}
					>
						{notificationIcon}
					</IconButton>
				</Tooltip>

				<Menu
					anchorEl={anchorElement}
					open={Boolean(anchorElement)}
					onClose={this.handleClose}
					onEntered={this.onMenuOpen}
					className={classes.Menu}
				>
					{notificationsMarkup}
				</Menu>
			</Fragment>
		);
	}
}

Notifications.protoTypes = {
	markNotificationsRead: PropTypes.func.isRequired,
	notifications: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
	notifications: state.user.notifications,
});

export default connect(mapStateToProps, { markNotificationsRead })(
	withStyles(styles)(Notifications)
);
