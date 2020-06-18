import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import DogVideo from '../../images/dogVideo.mp4';
//MUI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
//REDUX
import { connect } from 'react-redux';
import { loginUser } from '../../redux/actions/userActions';
import { signUpUser } from '../../redux/actions/userActions';

const style = {
	button: {
		margin: '10px auto 10px auto',
		position: 'relative',
		backgroundColor: '#00bcd4',
	},
	errorMsg: {
		color: 'red',
		fontSize: '1rem',
		marginTop: '1rem',
	},
	progress: {
		position: 'absolute',
	},
	buttonSL: {
		color: '#00bcd4',
	},
	formContainer: {
		zIndex: 100,
		paddingTop: '15rem',
		opacity: '1',
		color: 'black',
		zIndex: '5',
	},
	LSDiv: {
		position: 'relative',
		backgroundColor: '#333',
		height: '60rem',
		width: '100%',
		objectFit: 'cover',
		overflowX: 'hidden',
	},

	videoBackground: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		opacity: '0.3',
		top: 0,
		left: 0,
		objectFit: 'cover',
		pointerEvents: 'none',
	},
	textField: {
		'& .MuiInput-underline::after': {
			borderBottom: '2px solid #00bcd4',
		},
		'& .MuiFormLabel-root.Mui-focused': {
			color: '#00bcd4',
		},
	},
	Title: {
		color: 'white',
	},
};
class LoginSignup extends Component {
	constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			confirmPassword: '',
			handle: '',
			errors: {},
			login: true,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.ui.errors) {
			this.setState({ errors: nextProps.ui.errors });
		}
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	loginSignupHandler = (event) => {
		event.preventDefault();
		this.setState({
			login: !this.state.login,
		});
	};

	handleSubmitLogin = (event) => {
		event.preventDefault();

		const userData = {
			email: this.state.email,
			password: this.state.password,
		};

		this.props.loginUser(userData, this.props.history);
	};

	handleSubmitSignup = (event) => {
		event.preventDefault();

		const newUserData = {
			email: this.state.email,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword,
			handle: this.state.handle.toLocaleLowerCase(),
		};
		this.props.signUpUser(newUserData, this.props.history);
	};

	render() {
		const { errors } = this.state;
		const {
			classes,
			ui: { loading },
		} = this.props;

		let loginSignup =
			this.state.login === true ? (
				<Grid container className={classes.formContainer}>
					<Grid item sm />
					<Grid item sm>
						<Typography variant='h2' className={classes.Title}>
							Welcome to DogBook
						</Typography>
						<form noValidate onSubmit={this.handleSubmitLogin}>
							<TextField
								id='email'
								name='email'
								type='email'
								label='Email'
								className={classes.textField}
								helperText={errors.email}
								error={errors.email ? true : false}
								value={this.state.email}
								onChange={this.handleChange}
								fullWidth
							/>

							<TextField
								id='password'
								name='password'
								type='password'
								label='Password'
								className={classes.textField}
								helperText={errors.password}
								error={errors.password ? true : false}
								value={this.state.password}
								onChange={this.handleChange}
								fullWidth
							/>
							{errors.general && (
								<Typography variant='body2' className={classes.errorMsg}>
									{errors.general}
								</Typography>
							)}
							{errors.error && (
								<Typography variant='body2' className={classes.errorMsg}>
									{errors.error}
								</Typography>
							)}

							<Button
								type='submit'
								color='primary'
								className={classes.button}
								variant='contained'
								disabled={loading}
							>
								Login
								{loading && (
									<CircularProgress
										className={classes.progress}
										size={30}
										color='secondary'
									/>
								)}
							</Button>
							<br></br>
							<Button
								color='primary'
								className={classes.buttonSL}
								onClick={this.loginSignupHandler}
							>
								Sign up
							</Button>
						</form>
					</Grid>
					<Grid item sm />
				</Grid>
			) : (
				<Grid container className={classes.formContainer}>
					<Grid item sm />
					<Grid item sm>
						<Typography variant='h2' className={classes.Title}>
							Signup
						</Typography>
						<form noValidate onSubmit={this.handleSubmitSignup}>
							<TextField
								id='email'
								name='email'
								type='email'
								label='Email'
								className={classes.textField}
								helperText={errors.email}
								error={errors.email ? true : false}
								value={this.state.email}
								onChange={this.handleChange}
								fullWidth
							></TextField>
							<TextField
								id='password'
								name='password'
								type='password'
								label='Password'
								className={classes.textField}
								helperText={errors.password}
								error={errors.password ? true : false}
								value={this.state.password}
								onChange={this.handleChange}
								fullWidth
							></TextField>
							<TextField
								id='confirmPassword'
								name='confirmPassword'
								type='password'
								label='Confirm Password'
								className={classes.textField}
								helperText={errors.confirmPassword}
								error={errors.confirmPassword ? true : false}
								value={this.state.confirmPpassword}
								onChange={this.handleChange}
								fullWidth
							></TextField>
							<TextField
								id='handle'
								name='handle'
								type='text'
								label='Handle'
								className={classes.textField}
								helperText={errors.handle}
								error={errors.handle ? true : false}
								value={this.state.handle}
								onChange={this.handleChange}
								fullWidth
							></TextField>
							{errors.general && (
								<Typography variant='body2' className={classes.errorMsg}>
									{errors.general}
								</Typography>
							)}
							{errors.error && (
								<Typography variant='body2' className={classes.errorMsg}>
									{errors.error}
								</Typography>
							)}

							<Button
								type='submit'
								color='primary'
								className={classes.button}
								variant='contained'
								disabled={loading}
							>
								Sign Up
								{loading && (
									<CircularProgress
										className={classes.progress}
										size={30}
										color='secondary'
									/>
								)}
							</Button>
							<br></br>
							<Button
								className={classes.buttonSL}
								onClick={this.loginSignupHandler}
							>
								Log in
							</Button>
						</form>
					</Grid>
					<Grid item sm />
				</Grid>
			);

		return (
			<div className={classes.LSDiv}>
				<video autoPlay loop muted className={classes.videoBackground}>
					<source src={DogVideo} type='video/mp4' />
				</video>
				{loginSignup}
			</div>
		);
	}
}

LoginSignup.propTypes = {
	classes: PropTypes.object.isRequired,
	loginUser: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	ui: PropTypes.object.isRequired,
	signUpUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	user: state.user,
	ui: state.ui,
});

const mapDispatchToProps = {
	loginUser,
	signUpUser,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(style)(LoginSignup));
