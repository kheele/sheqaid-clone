// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {Page, Text, View} from '@react-pdf/renderer';

import styles from './ProfilePDFReader.style';

const PageWrapper = ({size, orientation, style, children}) => (
    <Page wrap size={size} orientation={orientation} style={style}>
        {children}
    </Page>
);

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageFirst">
@observer
class PageFirst extends React.Component {

    render() {
        let {
            data: {
                created_at,
                visibility,
                form, form: {name: formName, desc, type, title_page_list, questions}
            }
        } = this.props.item;
        const {title} = this.props;

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
                    <Text style={{margin: '35px auto 0'}}>{title}</Text>
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
                <Text style={{flexGrow: 1}}>Powered by SHEQ Intel</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Cover Page</Text>
            </View>
        </Page>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageLast">
@observer
class PageLast extends React.Component {

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
                <Text style={{flexGrow: 1}}>Powered by SHEQ Intel</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Last Page</Text>
            </View>
        </Page>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Page2">
@observer
class Page2 extends React.Component {
    render() {
        const {item} = this.props;
        let {
            data: {
                created_at,
                visibility,
                form, form: {name: formName, desc, type, title_page_list, questions}
            }
        } = item;
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>

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
                <Text style={{flexGrow: 1}}>Powered by SHEQ Intel</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </Page>;
    }
}

// </editor-fold>

export {PageFirst, Page2, PageLast};