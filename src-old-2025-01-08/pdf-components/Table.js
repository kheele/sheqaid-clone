import React from 'react';
import {observer} from 'mobx-react';
import {StyleSheet, Text, View} from '@react-pdf/renderer';

// <editor-fold defaultstate="collapsed" desc="styles">
const styles = StyleSheet.create({
    table: {
        border: '2px solid #fff',
        display: 'flex',
        flexDirection: 'column',
        marginHorizontal: 2,
        marginBottom: 8
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
    //  height: 10,
    },
    tableEm: {
    //fontStyle: 'bold'
    },
    tableCell: {
//      borderRight: '2px solid #fff',
        display: 'flex',
        justifyContent: 'flex-start',
        alignContent: 'center',
        textAlign: 'left',
        flexWrap: 'wrap',
        padding: '5px 5px 5px 5px',
        fontSize: 10.5
    }
});
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Table">
@observer
class Table extends React.Component{
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.renderItem = this.renderItem.bind(this);
    }
    // </editor-fold>

    renderItem(row, idx) {
        const {th, col} = this.props;
        const renderCellItem = (cell, n) => {
            const borderLeft = n > 0 ? {borderLeft: '2px solid #fff'} : {};
            return <View key={n} style={[styles.tableCell, {width: col[n], ...borderLeft}]}>
                {cell && isString(cell) && <Text>{cell}</Text>}
                {cell && !isString(cell) && cell}
            </View>;
        };
        const borderTop = idx > 0 ? {borderTop: '2px solid #fff'} : {};
        let _styleTableRow = {...styles.tableRow, ...borderTop};
        return <View key={idx} style={[_styleTableRow]}>
            {row.map(renderCellItem)}
        </View>;
    }
        
    render() {
        const {list} = this.props;
        return <View style={styles.table}>
            {list.map(this.renderItem)}
        </View>;
    }
}
// </editor-fold>

export default Table;