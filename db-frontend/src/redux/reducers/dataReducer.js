import {
	SET_BARKS,
	LOADING_DATA,
	LIKE_BARK,
	UNLIKE_BARK,
	DELETE_BARK,
	POST_BARK,
	SET_BARK,
	SUBMIT_COMMENT,
	GET_ALL_USERS,
} from '../types';

const initialState = {
	barks: [],
	bark: {},
	loading: false,
	dogs: [],
};

export default function (state = initialState, action) {
	switch (action.type) {
		case LOADING_DATA:
			return {
				...state,
				loading: true,
			};
		case SET_BARKS:
			return {
				...state,
				barks: action.payload,
				loading: false,
			};
		case SET_BARK:
			return {
				...state,
				bark: action.payload,
			};
		case LIKE_BARK:
		case UNLIKE_BARK:
			let index = state.barks.findIndex(
				(bark) => bark.barkId === action.payload.barkId
			);
			state.barks[index] = action.payload;
			if (state.bark.barkId === action.payload.barkId) {
				state.bark = action.payload;
			}
			return {
				...state,
			};
		case DELETE_BARK:
			let delIndex = state.barks.findIndex(
				(bark) => bark.barkId === action.payload
			);
			state.barks.splice(delIndex, 1);
			return {
				...state,
			};
		case POST_BARK:
			return {
				...state,
				barks: [action.payload, ...state.barks],
			};
		case SUBMIT_COMMENT:
			return {
				...state,
				bark: {
					...state.bark,
					comments: [action.payload, ...state.bark.comments],
				},
			};
		case GET_ALL_USERS:
			return {
				...state,
				loading: false,
				dogs: action.payload,
			};

		default:
			return state;
	}
}
