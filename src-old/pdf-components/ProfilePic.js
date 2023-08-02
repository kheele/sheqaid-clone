import React from 'react';
import {observer} from 'mobx-react';
import {Image, Path, Svg} from '@react-pdf/renderer';

import styles from './ProfilePDFReader.style';

// <editor-fold defaultstate="collapsed" desc="ProfilePic">
@observer
class ProfilePic extends React.Component {
    
    render() {
        const {profilePic, style} = this.props;
        if(profilePic && profilePic.dlUrls && profilePic.dlUrls[0]) {
            return <Image style={[styles.profilePic, style || {}]} src={profilePic.dlUrls[0]}/>;
        } else {
            const width = style && style.width || 64;
            const height = style && style.height || 64;
            return <Svg style={[styles.profilePic, {width, height}]} viewBox="0 0 448 512" width={width} height={height}>
                <Path fill="#ddd" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/>
            </Svg>;
        }
    }
}
// </editor-fold>

export default ProfilePic;