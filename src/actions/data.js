import { API } from 'aws-amplify';
import { getUsers } from '../constants/awsWrappers';
import {
  ADD_USER_FORM_NAME,
  DATA_CLEAR_ERROR,
  DATA_CLEAR_UNDO,
  DATA_ERROR,
  DATA_ADD_USER,
  DATA_REMOVE_USER,
  DATA_UNDO_REMOVE_USER,
  DATA_USER,
  DATA_USERS
} from '../constants';

export const clearError = () => dispatch =>
  dispatch({ type: DATA_CLEAR_ERROR });

export const user = data => async dispatch => {
  try {
    // const data = await getUser(id);
    dispatch({ type: DATA_USER, data });
  } catch (err) {
    dispatch({ type: DATA_ERROR, err });
  }
};

export const usersOrg = () => async dispatch => {
  try {
    const data = await getUsers();
    dispatch({ type: DATA_USERS, data });
  } catch (err) {
    dispatch({ type: DATA_ERROR, err });
  }
};

export const users = () => async dispatch => {
  try {
    const data = await API.get('todosCRUD', `/todos`);

    if (!Array.isArray(data) && data.error) {
      dispatch({ type: DATA_ERROR, err: { message: data.error } });
    } else {
      dispatch({ type: DATA_USERS, data });
    }
  } catch (err) {
    dispatch({ type: DATA_ERROR, err });
  }
};

export const add = (successCallback, argument) => async (dispatch, state) => {
  const user = state().form[ADD_USER_FORM_NAME].values;

  user.todoId = state().data.users.length;

  dispatch({ type: DATA_ADD_USER, data: user });
  successCallback(argument);

  try {
    await API.post('todosCRUD', '/todos', { body: user });
  } catch (err) {
    dispatch({ type: DATA_REMOVE_USER, user });
    dispatch({ type: DATA_ERROR, err });
  }
};

export const remove = user => async dispatch =>
  dispatch({ type: DATA_REMOVE_USER, user });

export const undoRemove = user => async dispatch =>
  dispatch({ type: DATA_UNDO_REMOVE_USER, user });

export const actuallyRemove = user => async dispatch => {
  dispatch({ type: DATA_CLEAR_UNDO });

  try {
    await API.del('todosCRUD', `/todos/object/${user.team}/${user.todoId}`);
  } catch (err) {
    dispatch({ type: DATA_ERROR, err });
  }
};
