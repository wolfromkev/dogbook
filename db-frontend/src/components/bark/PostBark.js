import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../utility/MyButton';
//Redux
import { connect } from 'react-redux';

import { postBark, clearErrors } from '../../redux/actions/dataActions';
//MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';

import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

const styles = (theme) => ({
	submitButton: {
		position: 'relative',
		float: 'right',
	},
	progressSpinner: {
		position: 'absolute',
	},
	closeButton: {
		position: 'absolute',
		left: '91%',
		top: '6%',
	},
	dialogCard: {
		'& .MuiPaper-root': {
			backgroundColor: '#333',
		},
	},
	buttonColor: {
		color: '#00bcd4',
	},
});

class PostBark extends Component {
	state = {
		open: false,
		body: '',
		errors: {},
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.ui.errors) {
			this.setState({
				errors: nextProps.ui.errors,
			});
		}
		if (!nextProps.ui.errors && !nextProps.ui.loading) {
			this.setState({ body: '', open: false, errors: {} });
		}
	}

	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.props.clearErrors();
		this.setState({ open: false, errors: {} });
	};
	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};
	handleSubmit = (event) => {
		event.preventDefault();
		this.props.postBark({ body: this.state.body });
	};
	render() {
		const { errors } = this.state;
		const {
			classes,
			ui: { loading },
		} = this.props;
		return (
			<Fragment>
				<MyButton onClick={this.handleOpen} toolTip='Post a bark!'>
					<AddIcon className={classes.buttonColor} />
				</MyButton>
				<div className={classes.dialogCard}>
					<Dialog
						open={this.state.open}
						onClose={this.handleClose}
						fullWidth
						maxWidth='sm'
						className={classes.dialogCard}
					>
						<MyButton
							toolTip='Close'
							onClick={this.handleClose}
							toolClassName={classes.closeButton}
						>
							<CloseIcon></CloseIcon>
						</MyButton>
						<DialogTitle className={classes.dialogCard}>
							Post a new Bark!
						</DialogTitle>
						<DialogContent className={classes.dialogCard}>
							<form onSubmit={this.handleSubmit}>
								<TextField
									name='body'
									type='text'
									label='Post a bark!'
									multiline
									rows='3'
									placeholder='Bark a bark'
									error={errors.body ? true : false}
									helperText={errors.body}
									className={classes.TextField}
									onChange={this.handleChange}
									fullWidth
								/>
								<Button
									type='submit'
									variant='contained'
									className={classes.submitButton}
									disabled={loading}
								>
									{' '}
									Submit
									{loading && (
										<CircularProgress
											size={30}
											className={classes.progressSpinner}
										></CircularProgress>
									)}
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</Fragment>
		);
	}
}

PostBark.propTypes = {
	postBark: PropTypes.func.isRequired,
	clearErrors: PropTypes.func.isRequired,
	ui: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	ui: state.ui,
});

export default connect(mapStateToProps, { postBark, clearErrors })(
	withStyles(styles)(PostBark)
);
