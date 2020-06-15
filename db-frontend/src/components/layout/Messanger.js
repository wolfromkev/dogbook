import React, { Component, Fragment, PureComponent } from 'react';
import classes from './Messanger.module.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllUsers } from '../../redux/actions/dataActions';
import MyButton from '../../utility/MyButton';
import defaultDog from '../../images/defaultDog.png';
//MUI
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MessageIcon from '@material-ui/icons/Message';
import SendIcon from '@material-ui/icons/Send';
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
			<div className={classes.enlargedContainer}>
				<div className={classes.searchContainer}>
					<input
						className={classes.searchBox}
						type='text'
						autoComplete='off'
						placeholder='Search users...'
					></input>
				</div>

				<div className={classes.chatTitleBox}>
					<div className={classes.chatTitle}>
						<div className={classes.chatTitleText}>@kevin</div>
					</div>

					<div className={classes.collapseButton}>
						<MyButton onClick={this.openHandler} toolTip='collapse'>
							<ExpandMoreIcon color='primary'></ExpandMoreIcon>
						</MyButton>
					</div>
				</div>

				<div className={classes.chatList}>
					<div className={classes.searchUserBox}>
						{' '}
						<img className={classes.userAvatar} src={defaultDog} />{' '}
						<div className={classes.infoBox}>
							<div className={classes.userInfo}> @kevin</div>
							<span className={classes.chatInfo}> Hey whatsup man......</span>
							<div className={classes.timeInfo}> 4:13pm 4/20/20</div>
						</div>
					</div>
					<div className={classes.chatRoomBox}>
						{' '}
						<img className={classes.userAvatar} src={defaultDog} />
						<div className={classes.infoBox}>
							<div className={classes.userInfo}> @new</div>
							<div className={classes.chatInfo}> Start a chat!</div>
						</div>
					</div>
				</div>

				<div className={classes.chatBody}>
					<div className={classes.chatConversation}>
						<div className={classes.fromMessageBox}>
							<div className={classes.messageAvatarBox}>
								<img className={classes.messageAvatar} src={defaultDog} />
								<div className={classes.fromMessageTime}> 4:13pm 4/20/20 </div>
							</div>
							<div className={classes.fromMessage}>
								<p className={classes.fromMessageContents}>
									while filling the element’s entire content box. If the
								</p>
							</div>
						</div>

						<div className={classes.toMessageBox}>
							<div className={classes.toMessage}>
								<p className={classes.toMessageContents}>
									while filling the element’s entire content box. If the
								</p>
							</div>
							<div className={classes.toMessageTime}>4:13pm 4/20/20 </div>
						</div>
					</div>

					<div className={classes.messageBoxContainer}>
						<input
							className={classes.messageBox}
							type='text'
							autoComplete='off'
							placeholder='Send a message!'
						/>
						<div className={classes.sendButton}>
							<MyButton onClick={this.openHandler} toolTip='Send'>
								<SendIcon color='primary' />
							</MyButton>
						</div>
					</div>
				</div>
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
