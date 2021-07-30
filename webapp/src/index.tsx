import {Store, Action} from 'redux';

import {GlobalState} from 'mattermost-redux/types/store';

import manifest from './manifest';
/* eslint-disable no-param-reassign, no-console */
// eslint-disable-next-line import/no-unresolved
import {PluginRegistry} from './types/mattermost-webapp';
import ImageUploadModal from './components/image_upload_modal';
import {UPLOAD_IMAGE, INITIALIZE} from './action_types';
import imageUploadModalVisible from './reducer';
let file: any;
let uploadAfterUserDecision : any;
const imagePastedAt = 'Image Pasted at ';

export default class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async initialize(registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>) {
        /* eslint-disable prefer-const */
        let setScreenshotUploadCroppedAreaPixels;
        /* eslint-disable prefer-const */
        let cropScreenshotAccordingToUsersChoice;
        let screenshotUploadCroppedAreaPixels : any;

        // @see https://developers.mattermost.com/extend/plugins/webapp/reference/
        registry.registerFilesWillUploadHook((files, upload) => {
            uploadAfterUserDecision = upload;

            if (files.length === 1 && (files[0].type === 'image/jpeg' || files[0].type === 'image/png')) {
                file = new Blob([files[0]], {type: files[0].type});
                files = null;
                const urlCreator = window.URL || window.webkitURL;
                const imageURL = urlCreator.createObjectURL(file);
                const windowWidth = window.screen.width;
                const windowHeight = window.screen.height;

                //@ts-ignore
                store.dispatch({type: UPLOAD_IMAGE, imgURL: imageURL, aspectRatio: windowWidth / windowHeight, show: true});
            }
            return {
                message: '',
                files,
            };
        });

        //@ts-ignore
        store.dispatch({type: INITIALIZE, handleFinalCrop: cropScreenshotAccordingToUsersChoice, setCroppedAreaPixels: setScreenshotUploadCroppedAreaPixels});
        registry.registerRootComponent(ImageUploadModal);

        //@ts-ignore
        registry.registerReducer(imageUploadModalVisible);
        setScreenshotUploadCroppedAreaPixels = (croppedAreaPixels : {[dimension: string]: number}) => {
            screenshotUploadCroppedAreaPixels = croppedAreaPixels;
        };
        cropScreenshotAccordingToUsersChoice = async (shouldCrop: boolean) => {
            if (file.name === 'image.png') {
                const d = new Date();
                let hour = String(d.getHours());

                //+ operator at the beginning for converting string to int
                hour = Number(hour) < 10 ? `0${hour}` : `${hour}`;

                let minute = String(d.getMinutes());
                minute = Number(minute) < 10 ? `0${minute}` : `${minute}`;

                let ext = '';
                if (file.name) {
                    if (file.name.includes('.')) {
                        ext = file.name.substr(file.name.lastIndexOf('.'));
                    }
                } else if (file.type.includes('/')) {
                    ext = '.' + file.type.split('/')[1].toLowerCase();
                }
                const name = imagePastedAt + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + hour + '-' + minute + ext;
            }

            let newFile: any;

            if (shouldCrop) {
                const canvas = document.createElement('canvas');
                canvas.width = screenshotUploadCroppedAreaPixels.width;
                canvas.height = screenshotUploadCroppedAreaPixels.height;
                const ctx = canvas.getContext('2d');
                const image = new Image();

                await new Promise((resolve) => {
                    /* eslint-disable no-unused-expressions */
                    image.onload = () => {
                        ctx?.drawImage(
                            image,
                            screenshotUploadCroppedAreaPixels.x,
                            screenshotUploadCroppedAreaPixels.y,
                            screenshotUploadCroppedAreaPixels.width,
                            screenshotUploadCroppedAreaPixels.height,
                            0,
                            0,
                            screenshotUploadCroppedAreaPixels.width,
                            screenshotUploadCroppedAreaPixels.height,
                        );
                        resolve('');
                    };
                    image.src = URL.createObjectURL(file);
                });
                newFile = await new Promise((resolve) => canvas.toBlob(resolve));
            } else {
                newFile = new Blob([file], {type: file.type});
            }

            newFile.name = name;
            const files = [];
            files.push(newFile);
            uploadAfterUserDecision(files);
        };
    }
}

declare global {
    interface Window {
        registerPlugin(id: string, plugin: Plugin): void
    }
}

window.registerPlugin(manifest.id, new Plugin());

