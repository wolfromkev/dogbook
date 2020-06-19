import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import LoginSignup from '../components/profile/loginSignup';

const styles = {
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflowY: 'scroll',
		overflowX: 'hidden',
		height: '80rem',
		width: '80%',
		position: 'relative',
		margin: '4rem auto 0 auto',
		maxWidth: '100rem',
	},
	gridList: {
		position: 'relative',
	},

	image: {
		objectFit: 'scale-down',
	},
	titleBar: {
		textAlign: 'center',
		color: '#00bcd4',
	},
	body: {
		fontSize: '200%',
	},

	cardTitle: {
		fontSize: '150%',
		color: '#00bcd4',
	},

	maindiv: {
		textAlign: 'center',
	},
	textColor: {
		color: '#00bcd4',
	},
};

class Home extends Component {
	componentDidMount() {
		this.props.getBarks();
	}
	componentDidUpdate(prevProps) {
		if (prevProps.authenticated !== this.props.authenticated) {
			this.props.history.push('/home');
		}
	}

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.maindiv}>
				<LoginSignup history={this.props.history} />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	data: state.data,
	authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(withStyles(styles)(Home));

/*

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Link from 'react-router-dom/Link';
import Typography from '@material-ui/core/Typography';

<h1 className={classes.textColor}> See what the dogs are barking! </h1>
				<div className={classes.root}>
					<GridList cellHeight={150} spacing={16} className={classes.gridList}>
						{barks.map((bark) => (
							<GridListTile
								key={bark.barkId}
								cols={1}
								rows={2}
								component={Link}
								to={`/dogs/${bark.userHandle}`}
							>
								<img src={bark.userImage} alt={bark.title} />
								<GridListTileBar
									title={<span className={classes.body}>{bark.body}</span>}
									titlePosition='top'
									className={classes.titleBar}
									subtitle={
										<Typography
											variant='h5'
											color='primary'
											className={classes.cardTitle}
										>
											@{bark.userHandle}
										</Typography>
									}
								></GridListTileBar>
							</GridListTile>
						))}
					</GridList>
				</div>

				*/
