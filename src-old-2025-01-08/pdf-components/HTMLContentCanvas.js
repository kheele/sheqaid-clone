import React from 'react';
import ReactDOMServer from "react-dom/server";
import html2canvas from 'html2canvas';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Image as PDFImage, StyleSheet} from '@react-pdf/renderer';

// <editor-fold defaultstate="collapsed" desc="styles">
const styles = StyleSheet.create({
    flexRow: {
        flexDirection: 'row',
    },
    flexColumn: {
        flexDirection: 'column',
    },
    panel: {
        flexDirection: 'column',
        flexGrow: 1,
        backgroundColor: "#fff",
        textAlign: 'left',
        lineHeight: 1.4,
        fontSize: 10,
        paddingVertical: 5,
        paddingHorizontal: 7,
//        borderRight: "2px dashed #ddd"
    },
    copyPic: {
        maxWidth: '100%',
        maxHeight: 400,
        marginLeft: 'auto',
        marginTop: 10,
        marginRight: 'auto',
        display: 'table',
        backgroundColor: '#000'
    }
});
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="HTMLContentCanvas">
@observer
class HTMLContentCanvas extends React.Component {

    @observable
    state = {
        src: null,
        height: null
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {children} = this.props;
        const html = ReactDOMServer.renderToStaticMarkup(children);
        
        const id = `html2canvas-${new Date().getTime()}`;
        
        const jqEl = $(html).attr('id', id).appendTo(document.body);
        
        const canvas = document.createElement("canvas");
        const width = jqEl.width();
        const height = jqEl.height();
        const scale = 1;
        canvas.width = width * scale;
        canvas.height = height * scale;
//        canvas.style.width = width + "px" ;
//        canvas.style.hight = height + "px";
//        const context = canvas.getContext("2d");
//        context.scale(scale, scale);
        
        this.state.width = width;
        this.state.height = height;

        const domEl = document.querySelector(`#${id}`);
        
        html2canvas(domEl, { 
            useCORS: true,
            allowTaint: false,
            canvas,
            scale: 1,
            width,
            height
        }).then(canvas => {
//            const context = canvas.getContext("2d");
//            context.scale(scale, scale);
            this.state.src = canvas.toDataURL('image/jpeg');
            document.body.removeChild(domEl);
        });
    }

    render() {
        const {src, width, height} = this.state;
        if (!src) {
            return null;
        }

        return <PDFImage src={src} style={{width, height}}/>;
    }
}
// </editor-fold>

export default HTMLContentCanvas;