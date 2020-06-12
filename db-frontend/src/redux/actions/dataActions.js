import {
	SET_BARKS,
	LOADING_DATA,
	LIKE_BARK,
	UNLIKE_BARK,
	DELETE_BARK,
	LOADING_UI,
	POST_BARK,
	CLEAR_ERRORS,
	SET_ERRORS,
	SET_BARK,
	STOP_LOADING_UI,
	SUBMIT_COMMENT,
	GET_ALL_USERS,
} from '../types';
import axios from 'axios';

export const getBarks = () => (dispatch) => {
	dispatch({ type: LOADING_DATA });
	axios
		.get('/barks')
		.then((res) => {
			dispatch({
				type: SET_BARKS,
				payload: res.data,
			});
		})
		.catch((err) => {
			dispatch({
				type: SET_BARKS,
				payload: [],
			});
		});
};

export const postBark = (newBark) => (dispatch) => {
	dispatch({ type: LOADING_UI });
	axios
		.post('/bark', newBark)
		.then((res) => {
			dispatch({
				type: POST_BARK,
				payload: res.data,
			});
			dispatch(clearErrors());
		})
		.catch((err) => {
			console.log(err);
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data,
			});
		});
};

export const likeBark = (barkId) => (dispatch) => {
	axios
		.get(`/bark/${barkId}/like`)
		.then((res) => {
			dispatch({
				type: LIKE_BARK,
				payload: res.data,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

export const unlikeBark = (barkId) => (dispatch) => {
	axios
		.get(`/bark/${barkId}/unlike`)
		.then((res) => {
			dispatch({
				type: UNLIKE_BARK,
				payload: res.data,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

export const submitComment = (barkId, commentData) => (dispatch) => {
	axios
		.post(`/bark/${barkId}/comment`, commentData)
		.then((res) => {
			dispatch({
				type: SUBMIT_COMMENT,
				payload: res.data,
			});
			dispatch(clearErrors());
		})
		.catch((err) => {
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data,
			});
		});
};

export const deleteBark = (barkId) => (dispatch) => {
	axios
		.delete(`/bark/${barkId}`)
		.then(() => {
			dispatch({ type: DELETE_BARK, payload: barkId });
		})
		.catch((err) => console.log(err));
};

export const clearErrors = () => (dispatch) => {
	dispatch({ type: CLEAR_ERRORS });
};

export const getBark = (barkId) => (dispatch) => {
	dispatch({ type: LOADING_UI });
	axios
		.get(`/bark/${barkId}`)
		.then((res) => {
			dispatch({
				type: SET_BARK,
				payload: res.data,
			});
			dispatch({ type: STOP_LOADING_UI });
		})
		.catch((err) => console.log(err));
};

export const getUserData = (userHandle) => (dispatch) => {
	dispatch({ type: LOADING_DATA });
	axios
		.get(`/dog/${userHandle}`)
		.then((res) => {
			dispatch({
				type: SET_BARKS,
				payload: res.data.barks,
			});
		})
		.catch((err) => {
			dispatch({
				type: SET_BARKS,
				payload: null,
			});
		});
};

export const getAllUsers = () => (dispatch) => {
	dispatch({ type: LOADING_DATA });
	axios
		.get('/dogs')
		.then((res) => {
			dispatch({
				type: GET_ALL_USERS,
				payload: res.data,
			});
		})
		.catch((err) => {
			dispatch({
				type: GET_ALL_USERS,
				payload: [],
			});
		});
};
