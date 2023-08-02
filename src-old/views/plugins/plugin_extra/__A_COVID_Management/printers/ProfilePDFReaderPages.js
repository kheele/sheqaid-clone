// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {Page, Text, View} from '@react-pdf/renderer';

import {styles} from '../../../../../pdf-components';

const PageWrapper = ({size, orientation, style, children}) => (
  <Page wrap size={size} orientation={orientation} style={style}>
    {children}
  </Page>
);

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageFirst">
@observer
class PageFirst extends React.Component {
    
    componentDidMount() {
        setTimeout(() => {
            this.props.counter.pos = "PageFirst";
        }, 100);
    }
    
    render() {
        let {title, item: list} = this.props;
        
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        
        return <PageWrapper size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={{height: '100%', display: 'flex', flexDirection: 'column', placeItems: "center", justifyContent: 'center', fontSize: 26}}>
                    <Text style={{margin: '20px auto 0'}}>{title}</Text>
                    <Text style={{margin: '0px auto 20px', fontSize: '15px'}}>OF</Text>
                    
                    {selectedClient && <Text style={{margin: '30px auto 0px'}}>COMPANY</Text>}
                    {selectedClient && <Text style={{margin: '-30px auto 20px', fontSize: '15px'}}>{selectedClient.data.name}</Text>}
                        
                    {selectedProject && <Text style={{margin: '30px auto 0px'}}>PROJECT</Text>}
                    {selectedProject && <Text style={{margin: '-30px auto 20px', fontSize: '15px'}}>{selectedProject.data.name}</Text>}
                        
                    {selectedSite && <Text style={{margin: '30px auto 0px'}}>SITE</Text>}
                    {selectedSite && <Text style={{margin: '-30px auto 0', fontSize: '15px'}}>{selectedSite.data.name}</Text>}
                </View>
            </View>
        </PageWrapper>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageLast">
@observer
class PageLast extends React.Component {
    
    render() {
        
        return <PageWrapper size="A4" style={styles.page}>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '4px solid #fafafa', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '4px solid #ddd', paddingLeft: 10, width: '60px'}}>Last Page</Text>
            </View>
        </PageWrapper>;
    }
}
// </editor-fold>

export {
    PageFirst, PageLast
};