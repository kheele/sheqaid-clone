// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {Page, Text, View} from '@react-pdf/renderer';

import styles from './ProfilePDFReader.style';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageFirst">
@observer
class PageFirst extends React.Component {

    get item() {
        return this.props.item.item;
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.counter.pos++;
        });
    }

    render() {
        let {
            data: {
                client, project, site
            }
        } = this.item;

        let clientName = client && (client.name || client.data.name);
        let projectName = project && (project.name || project.data.name);
        let siteName = site && (site.name || site.data.name);

        const explanationStyle = {margin: '5px auto 0', fontStyle: 'italic', fontSize: 16};

        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    placeItems: "center",
                    justifyContent: 'center',
                    fontSize: 26
                }}>
                    <Text style={{margin: '35px auto 0'}}>EMPLOYEE ORGANOGRAM</Text>
                    {clientName && <Text style={{margin: '35px auto 0', fontSize: 16}}>OF</Text>}
                    {clientName && <View style={[styles.flexColumn, {margin: '35px auto 0'}]}>
                        <Text>{clientName}</Text>
                        <Text style={explanationStyle}>(Company)</Text>
                    </View>}
                    {(projectName || siteName) && <Text style={{margin: '35px auto 0', fontSize: 16}}>AT</Text>}
                    {projectName && <View style={[styles.flexColumn, {margin: '35px auto 0'}]}>
                        <Text>{projectName}</Text>
                        <Text style={explanationStyle}>(Project)</Text>
                    </View>}
                    {siteName && <View style={[styles.flexColumn, {margin: '35px auto 0'}]}>
                        <Text>{siteName}</Text>
                        <Text style={explanationStyle}>(Site)</Text>
                    </View>}
                </View>
            </View>
            <View fixed style={[styles.flexRow, {
                fontSize: 9,
                justifyContent: 'center',
                placeItems: "center",
                padding: '7px',
                borderTop: '1px solid #eee',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0
            }]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQIntel</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Cover Page</Text>
            </View>
        </Page>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageLast">
@observer
class PageLast extends React.Component {

    componentDidMount() {
        setTimeout(() => {
            this.props.counter.pos++;
        });
    }

    render() {

        return <Page size="A4" style={styles.page}>
            <View fixed style={[styles.flexRow, {
                fontSize: 9,
                justifyContent: 'center',
                placeItems: "center",
                padding: '7px',
                borderTop: '1px solid #eee',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0
            }]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQIntel</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Last Page</Text>
            </View>
        </Page>;
    }
}

// </editor-fold>

export {PageFirst, PageLast};