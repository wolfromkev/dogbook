import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { Link } from 'react-router-dom';
import arrayFilter from '../../utility/arrayFilter';
//MUI
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MUILink from '@material-ui/core/Link';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Typography } from '@material-ui/core';

const styles = {
	List: {},
	searchContainer: {
		backgroundColor: 'white',
		borderRadius: '3px',
		width: '30rem',
	},
	Typography: {
		textAlign: 'center',
	},
};

class SearchModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
		};
	}

	handleOpen = () => {
		this.setState({ open: true });
	};
	handleClose = () => {
		this.setState({ open: false });
	};
	render() {
		const { classes, dogs } = this.props;
		let searchResults;
		let filteredDogs = arrayFilter(dogs, this.props.searchValue);

		if (filteredDogs.length > 0) {
			searchResults = filteredDogs.map((dog) => {
				return (
					<Fragment key={uniqid()}>
						<MUILink
							component={Link}
							to={`/dogs/${dog.handle}`}
							color='primary'
							variant='h5'
							onClick={this.props.clearSearch}
						>
							<ListItem key={dog.userHandle} button>
								<ListItemAvatar>
									<Avatar alt='profile Image' src={dog.imageUrl} />
								</ListItemAvatar>
								<ListItemText id={dog.handle} primary={`@${dog.handle}`} />
							</ListItem>
						</MUILink>

						<Divider variant='middle' className={classes.followingDivider} />
					</Fragment>
				);
			});
		} else {
			searchResults = (
				<Fragment>
					<Typography className={classes.Typography}>
						{' '}
						No users with that handle were found.
					</Typography>

					<Divider variant='middle' className={classes.followingDivider} />
				</Fragment>
			);
		}

		return (
			<div className={classes.searchContainer}>
				<List dense className={classes.List}>
					<div className={classes.searchBox}>{searchResults}</div>
				</List>
			</div>
		);
	}
}

SearchModal.propTypes = {
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	user: state.user,
	dogs: state.data.dogs,
});

export default connect(mapStateToProps, null)(withStyles(styles)(SearchModal));
