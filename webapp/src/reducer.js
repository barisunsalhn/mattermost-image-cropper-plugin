export {combineReducers} from 'redux';
import {INITIALIZE, UPLOAD_IMAGE} from './action_types';
const initialState = {
    imgURL: null,
    setCroppedAreaPixels: null,
    aspectRatio: 16 / 9,
    handleFinalCrop: null,
    show: false,
};

const imageUploadModalVisible = (state = {initialState}, action) => {
    switch (action.type) {
    case INITIALIZE:
        return {
            ...state,

            handleFinalCrop: action.handleFinalCrop,
            setCroppedAreaPixels: action.setCroppedAreaPixels,
        };
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