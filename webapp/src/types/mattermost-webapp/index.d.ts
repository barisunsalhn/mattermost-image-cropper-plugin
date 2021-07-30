import React from 'react';

import image_upload_modal from '../../components/image_upload_modal';

export interface PluginRegistry {

    registerRootComponent(ImageUploadModal: any);
    registerFilesWillUploadHook(arg0: (files: any, upload: any) => { message: string; files: any; });
    registerPostTypeComponent(typeName: string, component: React.ElementType);
}
