import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';

const style = {
	commentImage: {
		maxWidth: '100%',
		height: 100,
		objectFit: 'cover',
		borderRadius: '50%',
	},
	commentData: {
		marginLeft: 20,

		'& .MuiPaper-root': {
			color: 'white',
		},
	},
	commentBody: {
		overflow: 'auto',
		display: 'inline-block',
		maxWidth: '100%',
		wordWrap: 'break-word',
		color: 'white',
		margin: '1rem',
	},
	textColor: {
		color: '#00bcd4',
	},
};

class Comments extends Component {
	render() {
		const { comments, classes } = this.props;
		return (
			<Grid container>
				{comments.map((comment, index) => {
					const { body, createdAt, userImage, userHandle } = comment;
					return (
						<Fragment key={createdAt}>
							<Grid item sm={12}>
								<Grid container>
									<Grid item sm={2}>
										<img
											src={userImage}
											alt='comment'
											className={classes.commentImage}
										/>
									</Grid>
									<Grid item sm={9}>
										<div className={classes.commentData}>
											<Typography
												variant='h5'
												component={Link}
												to={`/dogs/${userHandle}`}
												className={classes.textColor}
											>
												@{userHandle}
											</Typography>{' '}
											<Typography variant='body2' color='textSecondary'>
												{dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
											</Typography>
											<Typography
												variant='body1'
												className={classes.commentBody}
											>
												{body}
											</Typography>
										</div>
									</Grid>
								</Grid>
							</Grid>
						</Fragment>
					);
				})}
			</Grid>
		);
	}
}

Comments.propType = {
	comments: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
	data: state.data,
});

export default connect(mapStateToProps)(withStyles(style)(Comments));
