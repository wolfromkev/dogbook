import {
	SET_USER,
	SET_AUTHENTICATED,
	SET_UNAUTHENTICATED,
	LOADING_USER,
	LIKE_BARK,
	UNLIKE_BARK,
	MARK_NOTIFICATIONS_READ,
	FOLLOW_USER,
	UNFOLLOW_USER,
} from '../types';

const initialState = {
	authenticated: false,
	credentials: {},
	loading: false,
	likes: [],
	notifications: [],
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_AUTHENTICATED:
			return {
				...state,
				authenticated: true,
			};
		case LOADING_USER:
			return {
				...state,
				loading: true,
			};

		case SET_UNAUTHENTICATED:
			return state;

		case SET_USER:
			return {
				...state,
				authenticated: true,
				...action.payload,
				loading: false,
			};

		case LIKE_BARK:
			return {
				...state,
				likes: [
					...state.likes,
					{
						userHandle: state.credentials.handle,
						barkId: action.payload.barkId,
					},
				],
			};
		case UNLIKE_BARK:
			return {
				...state,
				likes: state.likes.filter(
					(like) => like.barkId !== action.payload.barkId
				),
			};
		case MARK_NOTIFICATIONS_READ:
			state.notifications.forEach((note) => {
				note.read = true;
			});
			return {
				...state,
			};
		case FOLLOW_USER:
			state.credentials.following.push(action.payload);
			return {
				...state,
				credentials: {
					...state.credentials,
					following: [...state.credentials.following],
				},
			};

		case UNFOLLOW_USER:
			let delIndex = state.credentials.following.findIndex(
				(dog) => dog === action.payload
			);
			state.credentials.following.splice(delIndex, 1);
			return {
				...state,
				credentials: {
					...state.credentials,
					following: [...state.credentials.following],
				},
			};

		default:
			return state;
	}
}
