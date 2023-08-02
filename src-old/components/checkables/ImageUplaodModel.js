import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {PhotoUploadButton} from '../inputs';

@observer
class ImageUplaodModel extends React.Component {

    @observable state = {
        image: null
    };
    
    constructor(props) {
        super(props);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.handleImagePopDone = this.handleImagePopDone.bind(this);
    }

    onChangeImage(value, name, el) {
        this.state.image = value;
    }
    
    handleImagePopDone() {
        const {handleImagePopClose, updateImageLink, contextData} = this.props;
        handleImagePopClose();
        updateImageLink(this.state.image, contextData);
    }

    render() {
        const {handleImagePopOpen, handleImagePopClose} = this.props;
        return <div>
            <Dialog open={handleImagePopOpen} onClose={handleImagePopClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Upload Image Here</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Hey, Creating a Community is fun and easy, just fill these easy fields and get your personlized gang ready within seconds.
                        for question 
                    </DialogContentText>
                    <PhotoUploadButton onChange={this.onChangeImage}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleImagePopClose} color="primary">Cancel</Button>
                    <Button color="primary" onClick={this.handleImagePopDone}>Done</Button>
                </DialogActions>
            </Dialog>
        </div>;
    }
} 

export default ImageUplaodModel;