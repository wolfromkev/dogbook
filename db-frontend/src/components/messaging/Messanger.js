import React, { Component, Fragment } from 'react';
import { db } from '../../Firestore';
import classes from './Messanger.module.css';
import { connect } from 'react-redux';
import { getMessages } from '../../redux/actions/dataActions';
import { sendMessage } from '../../redux/actions/userActions';
import MyButton from '../../utility/MyButton';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import uniqid from 'uniqid';
import arrayFilter from '../../utility/arrayFilter';
import Link from 'react-router-dom/Link';
//MUI
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MessageIcon from '@material-ui/icons/Message';
import SendIcon from '@material-ui/icons/Send';

class Messanger extends Component {
	state = {
		opened: false,
		search: '',
		message: '',
		recipient: null,
		userId: null,
		readError: null,
	};

	async componentDidMount() {
		try {
			db.collection(`messages`).onSnapshot((doc) => {
				this.props.getMessages();
			});
		} catch (error) {
			this.setState({ readError: error.message });
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.credentials.handle !== prevProps.credentials.handle) {
			this.setState({ userId: this.props.credentials.handle });
		}
	}

	openHandler = () => {
		this.setState({ opened: !this.state.opened, recipient: null });
	};

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	setChatUser = (dog) => {
		this.setState({ recipient: dog });
	};

	sendMessage = (event) => {
		event.preventDefault();
		let message = {
			body: this.state.message,
			recipient: this.state.recipient,
		};
		this.setState({
			message: '',
		});
		this.props.sendMessage(message);
		this.forceUpdate();
	};

	render() {
		dayjs.extend(relativeTime);
		const { messages, dogs, credentials } = this.props;
		let chatList, messageRender;

		if (credentials.msgGroup && dogs.length > 0 && messages.length > 0) {
			if (this.state.search.length === 0) {
				chatList = credentials.msgGroup.map((user) => {
					let dog = dogs.find((el) => el.handle === user);

					let reversedMessages = messages.slice().sort(function (a, b) {
						return new Date(b.time) - new Date(a.time);
					});
					let lastMessage = reversedMessages.find(
						(el) => el.recipient === user || el.sender === user
					);

					return (
						<div
							className={classes.searchUserBox}
							onClick={() => this.setChatUser(dog.handle)}
						>
							{' '}
							<div className={classes.avatarChatList}>
								<img
									className={classes.userAvatar}
									src={dog.imageUrl}
									alt='dogPhoto'
								/>
							</div>
							<div className={classes.infoBox}>
								<div className={classes.userInfo}> @{dog.handle}</div>
								<span className={classes.chatInfo}>
									{' '}
									{lastMessage.content.length < 15
										? lastMessage.content
										: lastMessage.content.substring(0, 15) + '...'}
								</span>
								<div className={classes.timeInfo}>
									{' '}
									{dayjs(lastMessage.time).fromNow()}{' '}
								</div>
							</div>
						</div>
					);
				});
			} else {
				let filteredDogs = arrayFilter(dogs, this.state.search);
				if (filteredDogs.length > 0) {
					chatList = filteredDogs.map((dog) => {
						return (
							<Fragment key={uniqid()}>
								<div
									className={classes.chatRoomBox}
									onClick={() => this.setChatUser(dog.handle)}
								>
									{' '}
									<div className={classes.avatarChatList}>
										<img
											className={classes.userAvatar}
											src={dog.imageUrl}
											alt='dogPhoto'
										/>
									</div>
									<div className={classes.infoBox}>
										<div className={classes.userInfo}> @{dog.handle}</div>
										<div className={classes.chatInfo}> Start a chat!</div>
									</div>
								</div>
							</Fragment>
						);
					});
				}
			}
		}

		if (messages && this.state.recipient) {
			let msgFilter = messages.filter((msg) => {
				if (
					msg.recipient === this.state.recipient ||
					msg.sender === this.state.recipient
				) {
					return true;
				} else return false;
			});
			messageRender = msgFilter.map((msg) => {
				if (msg.recipient !== this.state.recipient) {
					let dog = dogs.find((el) => el.handle === msg.sender);
					return (
						<div className={classes.fromMessageBox}>
							<div className={classes.messageAvatarBox}>
								<img
									className={classes.messageAvatar}
									src={dog.imageUrl}
									alt='dogPhoto'
								/>
							</div>
							<div className={classes.fromMsgContentTime}>
								<div className={classes.fromMessage}>
									<p className={classes.fromMessageContents}>{msg.content}</p>
								</div>

								<div className={classes.fromMessageTime}>
									{' '}
									{dayjs(msg.time).fromNow()}
								</div>
							</div>
						</div>
					);
				} else {
					return (
						<div className={classes.toMessageBox}>
							<div className={classes.toMessage}>
								<p className={classes.toMessageContents}>{msg.content}</p>
							</div>
							<div className={classes.toMessageTime}>
								{' '}
								{dayjs(msg.time).fromNow()}{' '}
							</div>
						</div>
					);
				}
			});
		}

		let messageBoxRender = this.state.recipient ? (
			<div className={classes.messageBoxContainer}>
				<input
					className={classes.messageBox}
					type='text'
					name='message'
					onChange={this.handleChange}
					autoComplete='off'
					placeholder='Send a message!'
					value={this.state.message}
				/>
				<div className={classes.sendButton}>
					<MyButton onClick={this.sendMessage} toolTip='Send'>
						<SendIcon className={classes.buttonColor} />
					</MyButton>
				</div>
			</div>
		) : null;

		let messanger = this.state.opened ? (
			<div className={classes.enlargedContainer}>
				<div className={classes.searchContainer}>
					<input
						className={classes.searchBox}
						type='text'
						autoComplete='off'
						placeholder='Search users...'
						name='search'
						onChange={this.handleChange}
						value={this.state.search}
					></input>
				</div>

				<div className={classes.chatTitleBox}>
					<div className={classes.chatTitle}>
						<div className={classes.chatTitleText}>
							<Link to={`/dogs/${this.state.recipient}`}>
								{this.state.recipient ? '@' + this.state.recipient : null}
							</Link>
						</div>
					</div>

					<div className={classes.collapseButton}>
						<MyButton onClick={this.openHandler} toolTip='collapse'>
							<ExpandMoreIcon className={classes.buttonColor}></ExpandMoreIcon>
						</MyButton>
					</div>
				</div>

				<div className={classes.chatList}>{chatList}</div>

				<div className={classes.chatBody}>
					<div className={classes.chatConversation}>{messageRender}</div>

					{messageBoxRender}
				</div>
			</div>
		) : (
			<div className={classes.collapsedMessageBox} onClick={this.openHandler}>
				<MessageIcon className={classes.chatIcon}></MessageIcon>
				<div className={classes.chatWord}>Start a chat</div>
			</div>
		);

		let messangerAuth = this.props.authenticated ? (
			<div className={classes.messageRoot}> {messanger}</div>
		) : null;

		return <Fragment>{messangerAuth}</Fragment>;
	}
}

Messanger.propTypes = {};

const mapStateToProps = (state) => ({
	dogs: state.data.dogs,
	messages: state.data.messages,
	credentials: state.user.credentials,
	authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, {
	sendMessage,
	getMessages,
})(Messanger);
