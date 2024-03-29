import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../utility/MyButton';
//Redux
import { connect } from 'react-redux';
import { editUserDetails } from '../../redux/actions/userActions';

//MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';

const styles = (theme) => ({
	button: {
		marginTop: 20,
		position: 'center',
		float: 'right',
	},
	textField: {
		margin: '10px auto 10px auto',
	},
	iconColor: {
		color: '#00bcd4',
	},
	dialogBox: {
		backgroundColor: '#333',
		color: '#00bcd4',
	},
	textColor: {
		color: '#00bcd4',

		'& .MuiInput-underline::after': {
			borderBottom: '2px solid #00bcd4',
		},

		'& .MuiFormLabel-root': {
			color: 'white',
		},
		'& .MuiInputBase-input': {
			color: '#00bcd4',
		},
	},
	dialogBoxRoot: {
		'& .MuiPaper-root': {
			backgroundColor: 'transparent',
		},
	},
});

class EditDetails extends Component {
	state = {
		bio: '',
		website: '',
		location: '',
		open: false,
	};
	mapUserDetailsToState = (credentials) => {
		this.setState({
			bio: credentials.bio ? credentials.bio : '',
			website: credentials.website ? credentials.website : '',
			location: credentials.location ? credentials.location : '',
		});
	};
	handleOpen = () => {
		this.setState({ open: true });
		this.mapUserDetailsToState(this.props.credentials);
	};

	componentDidMount() {
		const { credentials } = this.props;
		this.mapUserDetailsToState(credentials);
	}
	handleClose = () => {
		this.setState({ open: false });
	};

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};
	handleSubmit = () => {
		const userDetails = {
			bio: this.state.bio,
			website: this.state.website,
			location: this.state.location,
		};
		this.props.editUserDetails(userDetails);
		this.handleClose();
	};

	render() {
		const { classes } = this.props;
		return (
			<Fragment>
				<MyButton
					toolTip='Edit Details'
					onClick={this.handleOpen}
					btnClassName={classes.button}
					btnPlacement='top'
				>
					<EditIcon className={classes.iconColor} />
				</MyButton>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					fullWidth
					max-width='sm'
					className={classes.dialogBoxRoot}
				>
					<DialogTitle className={classes.dialogBox}>Edit Details</DialogTitle>
					<DialogContent className={classes.dialogBox}>
						<form className={classes.textColor}>
							<TextField
								name='bio'
								type='text'
								label='Bio'
								multiline
								rows='3'
								placeholder='Tell me about yourself'
								className={classes.TextField}
								value={this.state.bio}
								onChange={this.handleChange}
								fullWidth
							></TextField>
							<TextField
								name='website'
								type='text'
								label='Website'
								placeholder='Your Personal Website'
								className={classes.TextField}
								value={this.state.website}
								onChange={this.handleChange}
								fullWidth
							></TextField>
							<TextField
								name='location'
								type='text'
								label='Location'
								placeholder='Where are you from?'
								className={classes.TextField}
								value={this.state.location}
								onChange={this.handleChange}
								fullWidth
							></TextField>
						</form>
					</DialogContent>
					<DialogActions className={classes.dialogBox}>
						<Button onClick={this.handleClose} className={classes.iconColor}>
							Cancel
						</Button>
						<Button onClick={this.handleSubmit} className={classes.iconColor}>
							Save
						</Button>
					</DialogActions>
				</Dialog>
			</Fragment>
		);
	}
}

EditDetails.propTypes = {
	editUserDetails: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	credentials: state.user.credentials,
});

export default connect(mapStateToProps, { editUserDetails })(
	withStyles(styles)(EditDetails)
);
