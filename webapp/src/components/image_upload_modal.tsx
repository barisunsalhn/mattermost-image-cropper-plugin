// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Modal} from 'react-bootstrap';
import Cropper from 'react-easy-crop';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-unresolved
import {Point} from 'react-easy-crop/types';
import {connect} from 'react-redux';

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
     *  React-easy-crop library returns cropped area pixels during crop operation, and we need to pass that to file upload component to enable user to crop specified area.
     */
    setCroppedAreaPixels: (pixels: {[dimension: string]: number}) => void;

    /**
     *  Handle final crop state after user presses one of two buttons.
     */
    handleFinalCrop: (shouldCrop: boolean) => void;

}

type State = {
    crop: Point;
    zoom: number;
};
class ImageUploadModal extends React.PureComponent<Props, State> {
    static propTypes = {
        imgURL: PropTypes.string.isRequired,
        show: PropTypes.bool.isRequired,
        aspectRatio: PropTypes.number.isRequired,
        setCroppedAreaPixels: PropTypes.func.isRequired,
        handleFinalCrop: PropTypes.func.isRequired,

    }

    constructor(props: any) {
        super(props);
        this.state = {
            crop: {x: 0, y: 0},
            zoom: 1,
        };
    }
    onCropChange = (crop: Point): void => {
        this.setState({crop});
    }

    onCropComplete = (croppedArea: {[startPointsAndDimensions: string]: number}, croppedAreaPixels: {[startPointsAndDimensions: string]: number}): void => {
        this.props.setCroppedAreaPixels(croppedAreaPixels);
    }

    onZoomChange = (zoom: number): void => {
        this.setState({zoom});
    }

    handleButtonClick =(shouldCrop: boolean): void => {
        this.props.handleFinalCrop(shouldCrop);
        doNothing();
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
        const originalScreenshotDOMElement = (
            <Cropper
                image={this.props.imgURL}
                crop={this.state.crop}
                zoom={this.state.zoom}
                aspect={this.props.aspectRatio}
                onCropChange={this.onCropChange}
                onCropComplete={this.onCropComplete}
                onZoomChange={this.onZoomChange}
                showGrid={false}
                classes={{containerClassName: 'container', mediaClassName: 'img screenshot'}}
            />
        );
        return (
            <Modal
                show={this.props.show}
                onHide={doNothing}
                dialogClassName='a11y__modal modal-image screenshot'
                role='dialog'
                aria-labelledby='screenshotUploadModalLabel'
            >
                <Modal.Header
                    closeButton={true}
                >
                    <div>{'Please crop...'}</div>
                </Modal.Header>
                <Modal.Body className='screenshot'>
                    <div>{originalScreenshotDOMElement}</div>
                </Modal.Body>
                <Modal.Footer>
                    {fullyUploadButton}
                    {cropButton}
                </Modal.Footer>
            </Modal>
        );
    }
}
/* eslint-disable no-param-reassign, no-console ,func-names, func-style */

const doNothing = function() {
    console.log(1);
};
const mapStateToProps = function(state : any) {
    return {
        imgURL: state.imgURL,
        aspectRatio: state.aspectRatio,
        handleFinalCrop: state.handleFinalCrop,
        setCroppedAreaPixels: state.setCroppedAreaPixels,
        show: state.show,
    };
};
export default connect(mapStateToProps)(ImageUploadModal);