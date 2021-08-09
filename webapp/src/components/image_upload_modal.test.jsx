import React from 'react';

import {shallow} from 'enzyme';

import {Modal} from 'react-bootstrap';

import ImageUploadModal from './image_upload_modal';

describe('components/imageUploadModal', () => {
    const baseProps = {
        imgURL: 'test',
        show: true,
        aspectRatio: 16 / 9,
        closeModal: jest.fn(),
    };

    test('should match snapshot, modal not shown', () => {
        const show = false;
        const props = {...baseProps, show};
        const wrapper = shallow(<ImageUploadModal {...props}/>);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.contains(<Modal/>)).toBe(false);
    });
    test('should match snapshot, modal shown', () => {
        const show = true;
        const props = {...baseProps, show};
        const wrapper = shallow(<ImageUploadModal {...props}/>);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(Modal).prop('show')).toBe(true);
    });
    test('should match snapshot after clicking upload full button, modal not shown', () => {
        const show = true;
        const props = {...baseProps, show};
        const wrapper = shallow(<ImageUploadModal {...props}/>);
        wrapper.find('#uploadFullButton').simulate('click');
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.contains(<Modal/>)).toBe(false);
    });
    test('should match snapshot after clicking crop button, modal not shown', () => {
        const show = true;
        const props = {...baseProps, show};
        const wrapper = shallow(<ImageUploadModal {...props}/>);
        wrapper.find('#cropButton').simulate('click');
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.contains(<Modal/>)).toBe(false);
    });
},

);