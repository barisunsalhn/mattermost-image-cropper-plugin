export {combineReducers} from 'redux';
import {UPLOAD_IMAGE} from './action_types';
const initialState = {
    imgURL: null,
    aspectRatio: 16 / 9,
    show: false,
};

const imageUploadModalVisible = (state = {initialState}, action) => {
    switch (action.type) {
    case UPLOAD_IMAGE:
        return {
            ...state,
            show: action.show,
            imgURL: action.imgURL,
            aspectRatio: action.aspectRatio,
        };
    default:
        return state;
    }
};

export default imageUploadModalVisible;