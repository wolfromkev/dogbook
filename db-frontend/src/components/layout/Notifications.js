import React, { Component, Fragment } from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
//MUI
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
		dayjs.extend(relativeTime);
		const notifications = this.props.notifications;
		const anchorElement = this.state.anchorElement;
		let notificationIcon;
		if (Notifications && notifications.length > 0) {
			notifications.filter((not) => not.read === false).length > 0
				? (notificationIcon = (
						<Badge
							badgeContent={
								notifications.filter((not) => not.read === false).length
							}
							color='secondary'
						>
							<NotificationsIcon color='secondary' />
						</Badge>
				  ))
				: (notificationIcon = <NotificationsIcon color='secondary' />);
		} else {
			notificationIcon = <NotificationsIcon color='secondary' />;
		}

		let notificationsMarkup =
			notifications && notifications.length > 0 ? (
				notifications.map((note) => {
					const verb = note.type === 'like' ? 'liked' : 'commented on';
					const time = dayjs(note.createdAt).fromNow();
					const iconColor = note.read ? 'notificationRead' : 'primary';
					const icon =
						note.type === 'like' ? (
							<FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
						) : (
							<ChatIcon color={iconColor} style={{ marginRight: 10 }} />
						);
					return (
						<MenuItem key={note.createdAt} onClick={this.handleClose}>
							{icon}
							<Typography
								component={Link}
								color='default'
								variant='body1'
								to={`/dogs/${note.recipient}/bark/${note.barkId}`}
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
					>
						{notificationIcon}
					</IconButton>
				</Tooltip>
				<Menu
					anchorEl={anchorElement}
					open={Boolean(anchorElement)}
					onClose={this.handleClose}
					onEntered={this.onMenuOpen}
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
	Notifications
);
