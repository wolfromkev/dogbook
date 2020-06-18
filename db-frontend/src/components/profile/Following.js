import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import uniqid from 'uniqid';
import { getAllUsers } from '../../redux/actions/dataActions';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MUILink from '@material-ui/core/Link';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import { Typography } from '@material-ui/core';

const styles = {
	List: {
		position: 'relative',
		width: '100%',
		maxWidth: 360,
		overflow: 'auto',
		overflowX: 'hidden',
		maxHeight: 300,
		color: 'white',
		'& .MuiTypography-colorPrimary': {
			color: '#00bcd4',
		},
	},
	userHandle: {
		color: '#00bcd4',
	},
	Divider: {
		backgroundColor: 'white',
		opacity: '0.5',
	},
	followingDivider: {
		backgroundColor: 'white',
		opacity: '0.5',
	},

	Typography: {
		color: '#00bcd4',
	},
	followedDog: {
		textDecoration: 'none',
	},
};

class Following extends Component {
	componentDidMount() {
		this.props.getAllUsers();
	}

	render() {
		const { classes } = this.props;
		const { dogs } = this.props.data;
		const { imageUrl } = this.props.data.dogs;
		const { following } = this.props.user;

		let followingArray = dogs.filter((dog) => following.includes(dog.handle));

		let followingToggle =
			following.length !== 0 ? (
				<Fragment className={classes.followedDog}>
					{followingArray.map((dog) => {
						return (
							<Fragment key={uniqid()}>
								<MUILink component={Link} to={`/dogs/${dog.handle}`}>
									<ListItem
										key={dog.userHandle}
										button
										className={classes.followedDog}
									>
										<ListItemAvatar>
											<Avatar alt='profile Image' src={imageUrl} />
										</ListItemAvatar>
										<p className={classes.userHandle}> @{dog.handle}</p>
									</ListItem>
								</MUILink>

								<Divider
									variant='middle'
									className={classes.followingDivider}
								/>
							</Fragment>
						);
					})}
				</Fragment>
			) : (
				<Fragment>
					<Typography align='center' className={classes.Typography}>
						{' '}
						You don't follow anyone yet.
					</Typography>
				</Fragment>
			);

		return (
			<div>
				<List dense className={classes.List}>
					<Typography align='center' className={classes.Typography}>
						{' '}
						Following
					</Typography>
					<Divider component='li' className={classes.Divider} />
					{followingToggle}
				</List>
			</div>
		);
	}
}

Following.prototypes = {
	data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	data: state.data,
	user: state.user.credentials,
});

export default connect(mapStateToProps, { getAllUsers })(
	withStyles(styles)(Following)
);
