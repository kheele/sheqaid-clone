import React from "react";
import PropTypes from "prop-types";
import {Editor} from '@tinymce/tinymce-react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';

@observer
class TinyMCE extends React.Component {
    static propTypes = {
        state: PropTypes.object
    };
    
    @observable state = {
        open: true,
        value: null
    };

    constructor(props) {
        super(props);

        this.handleEditorChange = this.handleEditorChange.bind(this);
    }
    
    componentWillMount() {
        const {open, closed, state = {}, value, defaultValue} = this.props;
        this.state.value = value || defaultValue;
        if('open' in this.props || ('state' in this.props && 'showTinyMCE' in state)) {
            this.state.open = open || state.showTinyMCE;
        }
    }

    handleEditorChange(val) {
        const {name, onChange} = this.props;
        this.state.value = val;
        onChange && onChange(val, name, this);
    }
    
    get isOpen() {
        return this.state.open;
    }
    
    show() {
        this.state.open = true;
    }
    
    hide() {
        this.state.open = false;
    }

    get config() {
        const {height = 900, readonly = false} = this.props;
        return {
            height: height || 900,
            readonly,
            menubar: true,
            plugins: [
                'advlist autolink lists advlist link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount pagebreak',
                'autoresize autosave'
            ],
            toolbar:
                'undo redo | formatselect | bold italic backcolor | \
		alignleft aligncenter alignright alignjustify | \
		bullist numlist outdent indent | removeformat | restoredraft | help',
            autoresize_bottom_margin: 30,
//            autoresize_overflow_padding: 30,
            min_height: height || 100,
            /*plugins: 'importcss autosave save directionality visualblocks visualchars template codesample hr nonbreaking toc imagetools textpattern noneditable quickbars emoticons',
             imagetools_cors_hosts: ['picsum.photos'],
             menubar: 'file edit view insert format tools table help',
             toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
             toolbar_sticky: true,
             autosave_ask_before_unload: true,
             autosave_interval: "30s",
             autosave_prefix: "{path}{query}-{id}-",
             autosave_restore_when_empty: false,
             autosave_retention: "2m",
             image_advtab: true,
             content_css: '//www.tiny.cloud/css/codepen.min.css',
             link_list: [
             title: 'My page 1', value: 'http://www.tinymce.com' },
             { title: 'My page 2', value: 'http://www.moxiecode.com' }
             ],
             image_list: [
             { title: 'My page 1', value: 'http://www.tinymce.com' },
             { title: 'My page 2', value: 'http://www.moxiecode.com' }
             ],
             image_class_list: [
             { title: 'None', value: '' },
             { title: 'Some class', value: 'class-name' }
             ],
             importcss_append: true,
             height: 400,
             file_picker_callback: function (callback, value, meta) {
             /* Provide file and text for the link dialog */
            //	if (meta.filetype === 'file') {
            //		callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
            //	}

            /* Provide image and alt text for the image dialog */
            //	if (meta.filetype === 'image') {
            //		callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
            //	}

            /* Provide alternative source and posted for the media dialog */
            /*	if (meta.filetype === 'media') {
             callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
             }
             },
             templates: [
             { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
             { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
             { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
             ],
             template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
             template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
             height: 600,
             image_caption: true,
             quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
             noneditable_noneditable_class: "mceNonEditable",
             toolbar_mode: 'sliding',
             contextmenu: "link image imagetools table"*/
        };
    }

    render() {
        if(!this.state.open) {
            return null;
        }
        const {value} = this.state;
        
        if(this.props.readonly) {
            return <div dangerouslySetInnerHTML={{ __html: value || 'Not Available'}} />;
        }
        
        return <Editor
            key="Editor"
            initialValue={value}
            init={this.config}
            onEditorChange={this.handleEditorChange}
        />;
    }
}

export default TinyMCE;
