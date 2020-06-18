import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../utility/MyButton';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import Comments from './Comments';
import CommentForm from './CommentForm';
//MUI
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
//Icons
import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from '@material-ui/icons/Chat';
//Redux
import { connect } from 'react-redux';
import { getBark, clearErrors } from '../../redux/actions/dataActions';

const styles = {
	seperator: {
		margin: '4',
		border: 'none',
	},
	profileImage: {
		maxWidth: 60,
		height: 60,
		borderRadius: '50%',
		objectFit: 'cover',
	},
	dialogContent: {
		padding: 20,
		backgroundColor: '#333',
		'& .MuiPaper-root': {
			color: '#00bcd4',
		},
	},

	dialog: {
		backgroundColor: 'transparent',

		'& .MuiPaper-root': {
			backgroundColor: 'transparent',
		},
	},

	closeButton: {
		position: 'absolute',
		left: '90%',
	},

	spinnerDiv: {
		textAlign: 'center',
		marginTop: 50,
		marginBottom: 50,
		'& .MuiCircularProgress-colorPrimary': {
			color: '#00bcd4',
		},
	},
	iconColor: {
		color: '#00bcd4',
	},
	commentText: {
		color: 'white',
		wordWrap: 'break-word',
		width: '100%',
		padding: '1rem',
	},
};

class BarkDialog extends Component {
	state = {
		open: false,
		oldPath: '',
		newPath: '',
	};

	handleOpen = () => {
		let oldPath = window.location.pathname;
		const { userHandle, barkId } = this.props;
		const newPath = `/dogs/${userHandle}/bark/${barkId}`;
		window.history.pushState(null, null, newPath);
		this.setState({ open: true, oldPath, newPath });
		this.props.getBark(this.props.barkId);
	};

	handleClose = () => {
		window.history.pushState(null, null, this.state.oldState);
		this.setState({ open: false });
		this.props.clearErrors();
	};
	render() {
		const {
			classes,
			bark: { barkId, body, createdAt, userImage, userHandle, comments },
			ui: { loading },
		} = this.props;

		const dialogMarkup = loading ? (
			<div className={classes.spinnerDiv}>
				<CircularProgress size={200} />
			</div>
		) : (
			<Grid container className={classes.gridStuff}>
				<Grid item>
					<img src={userImage} alt='Profile' className={classes.profileImage} />
				</Grid>

				<Grid item>
					<Typography
						component={Link}
						variant='h5'
						to={`/dogs/${userHandle}`}
						className={classes.iconColor}
					>
						@{userHandle}
					</Typography>

					<Typography variant='body2'>
						{dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
					</Typography>
				</Grid>

				<div className={classes.commentText}>
					<Typography>{body}</Typography>
				</div>

				<CommentForm barkId={barkId} />

				<Comments comments={comments} />
			</Grid>
		);

		return (
			<Fragment>
				<MyButton
					onClick={this.handleOpen}
					toolTip='See comments!'
					toolClassName={classes.expandBark}
				>
					<ChatIcon className={classes.iconColor}></ChatIcon>
				</MyButton>

				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					fullWidth
					className={classes.dialog}
				>
					<MyButton
						toolTip='Close'
						onClick={this.handleClose}
						toolClassName={classes.closeButton}
					>
						<CloseIcon />
					</MyButton>

					<DialogContent className={classes.dialogContent}>
						{dialogMarkup}
					</DialogContent>
				</Dialog>
			</Fragment>
		);
	}
}

BarkDialog.propTypes = {
	getBark: PropTypes.func.isRequired,
	barkId: PropTypes.string.isRequired,
	userHandle: PropTypes.string.isRequired,
	bark: PropTypes.object.isRequired,
	ui: PropTypes.object.isRequired,
	clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	bark: state.data.bark,
	ui: state.ui,
});

const mapDispatchToProps = {
	getBark,
	clearErrors,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(BarkDialog));
