import React, { Component, Fragment } from 'react';
import classes from './Messanger.module.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllUsers } from '../../redux/actions/dataActions';

//MUI
import MessageIcon from '@material-ui/icons/Message';

class Messanger extends Component {
	state = {
		opened: true,
	};

	openHandler = () => {
		this.setState({ opened: !this.state.opened });
		console.log(this.state.opened);
	};
	render() {
		let messanger = this.state.opened ? (
			<div className={classes.enlargedContainer} onClick={this.openHandler}>
				<div className={classes.searchContainer}></div>
				<div className={classes.conversationList}></div>
				<div className={classes.newMessageContainer}></div>
				<div className={classes.chatTitle}></div>
				<div className={classes.chatMessageList}></div>
				<div className={classes.chatForm}></div>
			</div>
		) : (
			<div className={classes.collapsedMessageBox} onClick={this.openHandler}>
				<MessageIcon className={classes.chatIcon}></MessageIcon>
				<div className={classes.chatWord}>Start a chat</div>
			</div>
		);

		return (
			<Fragment>
				<div className={classes.messageRoot}> {messanger}</div>
			</Fragment>
		);
	}
}

Messanger.propTypes = {
	authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	authenticated: state.user.authenticated,
	dogs: state.data.dogs,
});

export default connect(mapStateToProps, { getAllUsers })(Messanger);
