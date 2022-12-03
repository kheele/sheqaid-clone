import React from 'react';
import {observer} from 'mobx-react';
import {View as ViewImpl} from '@react-pdf/renderer';

@observer
class View extends React.Component {
    get style() {
        let {
            style, 
            row, column
        } = this.props;
        style = style || [];
        if (isObject(style)) {
            style = Object.keys(style).map(key => {
                return {[key]: style[key]};
            });
        }
        if (row) {
            style.push({flexDirection: 'row'});
        }
        if (column) {
            style.push({flexDirection: 'column'});
        }
        
        const keys = ['row', 'column'];
        Object.keys(this.props).filter(key => !keys.contains(key)).forEach(key => {
            style.push({[key]: this.props[key]});
        });
        
        console.log('style', style)
        return style;
    }

    render() {
        let {children} = this.props;
        return <ViewImpl style={this.style}>
            {children}
        </ViewImpl>;
    }
}

export default View;