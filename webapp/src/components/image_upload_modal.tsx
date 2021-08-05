// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Modal} from 'react-bootstrap';
import Cropper from 'react-easy-crop';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-unresolved
import {Point} from 'react-easy-crop/types';
import {connect} from 'react-redux';
import './image_upload_modal.scss';

import {UPLOAD_IMAGE} from '../action_types';
import manifest from 'manifest';
import {cropImageAccordingToUsersChoice} from '../index';
/* eslint-disable no-param-reassign, no-console */
type Props = {

    /**
     * Image url to provide into react-easy-cropper.
     */
    imgURL: string;

    /**
     * Show modal.
     */
    show: boolean;

    /**
     *  Aspect ratio (Think of a scenario where user pastes screenshot of 2 or more screen, s/he might want to crop it according to one of his screens. In this case we want to provide a shortcut for him to save his time.).
     */
    aspectRatio: number;

    /**
     *  Used for closing modal.
     */
    closeModal: () => void;

}

type State = {
    crop: Point;
    zoom: number;
    croppedAreaPixels: {[startPointsAndDimensions: string]: number};
};

class ImageUploadModal extends React.PureComponent<Props, State> {
    static propTypes = {
        imgURL: PropTypes.string.isRequired,
        show: PropTypes.bool.isRequired,
        aspectRatio: PropTypes.number.isRequired,

    }
    constructor(props: any) {
        super(props);
        this.state = {
            crop: {x: 0, y: 0},
            zoom: 1,
            croppedAreaPixels: {x: 0, y: 0, width: 0, height: 0},
        };
    }

    onCropChange = (crop: Point): void => {
        this.setState({crop});
    }

    onCropComplete = (croppedArea: {[startPointsAndDimensions: string]: number}, croppedAreaPixels: {[startPointsAndDimensions: string]: number}): void => {
        this.setState({croppedAreaPixels});
    }

    onZoomChange = (zoom: number): void => {
        this.setState({zoom});
    }

    handleButtonClick =(shouldCrop: boolean): void => {
        cropImageAccordingToUsersChoice(shouldCrop, this.state.croppedAreaPixels);
        this.props.closeModal();
    }

    render() {
        const fullyUploadButton = (
            <button
                type='button'
                className='btn btn-primary save-button'
                onClick={() => this.handleButtonClick(false)}
                id='fullyUploadButton'
            >
                {'Upload full'}
            </button>
        );

        const cropButton = (
            <button
                type='button'
                className='btn btn-primary save-button'
                onClick={() => this.handleButtonClick(true)}
                id='cropButton'
            >
                {'Crop'}
            </button>
        );

        //React-easy-crop is chosen over react-cropper due to this https://github.com/react-cropper/react-cropper/issues/555
        const imageDOMElement = (
            <Cropper
                image={this.props.imgURL}
                crop={this.state.crop}
                zoom={this.state.zoom}
                aspect={this.props.aspectRatio}
                onCropChange={this.onCropChange}
                onCropComplete={this.onCropComplete}
                onZoomChange={this.onZoomChange}
                showGrid={false}
                classes={{containerClassName: 'container'}}
            />
        );

        return (
            this.props.show === true ?
                <Modal
                    show={true}
                    onHide={this.props.closeModal}
                    dialogClassName='a11y__modal modal-image image'
                    role='dialog'
                    aria-labelledby='imageUploadModalLabel'
                >
                    <Modal.Header
                        closeButton={true}
                        className={'image'}
                    >
                        <div>{'Please crop your image or screenshot pasted...'}</div>
                    </Modal.Header>
                    <Modal.Body className='image'>
                        <div>{imageDOMElement}</div>
                    </Modal.Body>
                    <Modal.Footer>
                        {fullyUploadButton}
                        {cropButton}
                    </Modal.Footer>
                </Modal> : null);
    }
}
/* eslint-disable no-param-reassign ,func-names, func-style */

const mapStateToProps = function(state : any) {
    return {
        imgURL: state['plugins-' + manifest.id].imgURL,
        aspectRatio: state['plugins-' + manifest.id].aspectRatio,
        show: state['plugins-' + manifest.id].show,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        closeModal: () => {
            dispatch({type: UPLOAD_IMAGE, show: false});
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageUploadModal);