import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';
//MUI
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const styles = {};

class CommentForm extends Component {
	state = {
		body: '',
		errors: {},
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.ui.errors) {
			this.setState({ errors: nextProps.ui.errors });
		}

		if (!nextProps.ui.errors && !nextProps.ui.loading) {
			this.setState({ body: '' });
		}
	}

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleSubmit = (event) => {
		event.preventDefault();
		this.props.submitComment(this.props.barkId, { body: this.state.body });
	};

	render() {
		const { classes, authenticated } = this.props;
		const errors = this.state.errors;

		const commentFormMarkup = authenticated ? (
			<Grid item sm={12} style={{ textAlign: 'right' }}>
				<form onSubmit={this.handleSubmit}>
					<TextField
						name='body'
						type='text'
						label='Comment on Bark'
						error={errors.comment ? true : false}
						helperText={errors.comment}
						value={this.state.body}
						onChange={this.handleChange}
						className={classes.TextField}
						fullWidth
					></TextField>

					<Button type='submit' variant='contained' color='primary'>
						Submit
					</Button>
				</form>
			</Grid>
		) : null;

		return commentFormMarkup;
	}
}

CommentForm.propType = {
	submitComment: PropTypes.func.isRequired,
	ui: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
	barkId: PropTypes.string.isRequired,
	authenticated: PropTypes.bool.isRequired,
};

const mapSateToProps = (state) => ({
	ui: state.ui,
	authenticated: state.user.authenticated,
});

export default connect(mapSateToProps, { submitComment })(
	withStyles(styles)(CommentForm)
);
