import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import MyButton from '../../utility/MyButton';

//MUI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

import { connect } from 'react-redux';
import { deleteBark } from '../../redux/actions/dataActions';

const styles = {
	deleteButton: {
		top: '1%',
		left: '94%',
		position: 'absolute',
	},
	dialogBox: {
		backgroundColor: 'rgba(0,0,0,0.3)',

		'& .MuiPaper-root': {
			backgroundColor: '#333',
		},
	},

	iconColor: {
		color: '#00bcd4',
	},
	title: {
		color: 'white',
	},
};

class DeleteBark extends Component {
	state = {
		open: false,
	};
	handleOpen = () => {
		this.setState({ open: true });
	};
	handleClose = () => {
		this.setState({ open: false });
	};
	deleteBark = () => {
		this.props.deleteBark(this.props.barkId);
		this.setState({ open: false });
	};
	render() {
		const { classes } = this.props;

		return (
			<Fragment>
				<MyButton
					toolTip='Delete Bark'
					onClick={this.handleOpen}
					btnClassName={classes.deleteButton}
				>
					<DeleteOutline className={classes.iconColor}></DeleteOutline>
				</MyButton>

				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					fullWidth
					maxWidth='sm'
					className={classes.dialogBox}
				>
					<DialogTitle className={classes.title}>
						Are you sure you want to delete this?
					</DialogTitle>
					<DialogActions>
						<Button onClick={this.handleClose} className={classes.iconColor}>
							Cancel{' '}
						</Button>
						<Button onClick={this.deleteBark} className={classes.iconColor}>
							Delete{' '}
						</Button>
					</DialogActions>
				</Dialog>
			</Fragment>
		);
	}
}

DeleteBark.propTypes = {
	deleteBark: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
	barkId: PropTypes.string.isRequired,
};

export default connect(null, { deleteBark })(withStyles(styles)(DeleteBark));
