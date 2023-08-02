import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import ReactPDF, {Document, Page, StyleSheet, Text, View} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});
// Create Document Component
class MyDocument extends React.Component {
    render() {
        return <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>;
    }
}

@observer
class PDFWriter extends React.Component {
    static propTypes = {
        state: PropTypes.object.isRequired
    };
    
    save(doc){
        ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`);
    }

    render() {
        const {state: {doc}} = this.props;
        console.log('this.props.state.doc', doc)
        return null;
    }
}

export default PDFWriter;
