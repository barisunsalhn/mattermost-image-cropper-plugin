import {connect} from 'react-redux';

import manifest from 'manifest';
import {UPLOAD_IMAGE} from '../action_types';

import ImageUploadModal from './image_upload_modal';

const mapStateToProps = (state) => {
    return {
        imgURL: state['plugins-' + manifest.id].imgURL,
        aspectRatio: state['plugins-' + manifest.id].aspectRatio,
        show: state['plugins-' + manifest.id].show,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal: () => {
            dispatch({type: UPLOAD_IMAGE, show: false});
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageUploadModal);