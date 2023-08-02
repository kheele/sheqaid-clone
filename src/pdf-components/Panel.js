import React from 'react';
import {observer} from 'mobx-react';
import {isObservableArray, observable} from 'mobx';
import {Image, Page, StyleSheet, Text, View} from '@react-pdf/renderer';

import {Dates} from '../utils/Utils';

pdfjsLib.disableWorker = true;

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

const PageWrapper = ({size, orientation, style, children}) => (
  <Page size={size} orientation={orientation} style={style}>
    {children}
  </Page>
);

// <editor-fold defaultstate="collapsed" desc="Panel">
@observer
class Panel extends React.Component {
    
    @observable
    state = {
        renderer: false,
        pdfImages: []
    };
    
    constructor(props) {
        super(props);

        this.createText = this.createText.bind(this);
        this.createImage = this.createImage.bind(this);
        this.createPDF = this.createPDF.bind(this);
    }
    
    componentDidMount() {
        if(!this.isDoc) {
            this.state.renderer = true;
        } else {
            const {value} = this.props;
            const src = value.dlUrls[0];
            setTimeout(() => {
                pdfjsLib.getDocument(src).then(pdf => {
                    const go = async () => {
    //                    let h = 0;
                        for(let pageN = 1; pageN <= pdf.numPages; pageN++){
                            const page = await pdf.getPage(pageN);
                            console.log('got a page', pageN);
                            const scale = 1;
                            const viewport = page.getViewport(scale);

                            //
                            // Prepare canvas using PDF page dimensions
                            //
                            const canvas = document.createElement('canvas');
                            const {body} = document;
                            body.appendChild(canvas);
                            const context = canvas.getContext('2d');
                            canvas.height = viewport.height;
    //                        canvas.height += viewport.height;
                            canvas.width = viewport.width;
    //                        h+= viewport.height;
                            //
                            // Render PDF page into canvas context
                            //
                            const task = page.render({ canvasContext: context, viewport: viewport })
                            await task.promise;
                            const src = canvas.toDataURL('image/jpeg');
                            this.state.pdfImages.push(src);
    //                        console.log('pdf img src', src); 
                            setTimeout(() => {
                                body.removeChild(canvas);
                            });
                        }
                        pdfjsLib.disableWorker = false;
                        this.state.renderer = true;
                    };
                    go();
                }).catch(err => {
                    console.error(err)
                });
//
            }, 500);
        }
    }
    
    createText(value) {
        let {renderer, isOrg, valueStyle = {}} = this.props;
        const style = {fontFamily: "Roboto", fontSize: 10};
        if(!value) {
            value = "N/A";
        } else {
            if(isOrg && isObject(value)) {
                value = value.name || value.data.name;
            } else if(renderer) {
                value = renderer(value);
            } else if(isArray(value) || isObservableArray(value)) {
                value = value.join(', ');
            }
        }
        return <Text style={[style, valueStyle]}>{value}</Text>;
    }
    
    createImage(src) {
        console.log('createImage', src)
        const {imageStyle = {}, rotateImage} = this.props;
        let _copyPicStyle = {};
        if(rotateImage) {
            imageStyle.transform = "rotate(90deg)";
//            _copyPicStyle.width = "100%";
//            _copyPicStyle.height = "300px";
        }
        return <View style={[imageStyle, {marginTop: 0, maxHeight: '780px', flexGrow: 1}]}>
            <Image style={[styles.copyPic, _copyPicStyle, {marginTop: 0, maxHeight: '780px'}]} src={src}/>
        </View>;
    }
    
    createPDF(src) {
        const {imageStyle = {}, rotateImage, pdfPageRenderer} = this.props;
        const {pdfImages} = this.state;
        let _copyPicStyle = {};
        if(rotateImage) {
            imageStyle.transform = "rotate(90deg)";
//            _copyPicStyle.width = "100%";
//            _copyPicStyle.height = "300px";
        }
        
        console.log('createPDF pdfImages', pdfImages)
        const length = pdfImages.length;
        const renderer = (src, n) => {
            if(pdfPageRenderer) {
                return pdfPageRenderer(src, n, length);
            }
            if(n > 0) {
                return <PageWrapper size="A4">
                    <View style={[imageStyle, {marginTop: 0, maxHeight: '100%'}]}>
                        <Image style={[styles.copyPic, _copyPicStyle, {marginTop: 0, height: '100%'}]} src={src}/>
                    </View>
                </PageWrapper>;
            } else {
                return <View style={[imageStyle, {marginTop: 0, maxHeight: '100%'}]}>
                    <Image style={[styles.copyPic, _copyPicStyle, {marginTop: 0, height: '100%'}]} src={src}/>
                </View>;
            }
        };
        return <View style={[styles.flexColumn]}>
            {pdfImages.map(renderer)}
        </View>;
    }
    
    createNoImage() {
        const {imageStyle = {}} = this.props;
        return <View style={[imageStyle, {marginTop: 0, maxHeight: '780px', flexGrow: 1}]}>
            <Image style={[styles.copyPic, {marginTop: 0, width: '100%', height: '100%', maxHeight: '780px'}]} src='./img/no-img.PNG'/>
        </View>;
    }
    
    get isDoc() {
        let {value, type} = this.props;
        if(type === 'file' && value && value.dlUrls && value.dlUrls[0]) {
            value = value.dlUrls[0];
            return value.contains('.pdf') || value.contains('.docx') || value.contains('.doc');
        }
    }
    
    render() {
        if(!this.state.renderer) return null;
        
        let {
            title, value, noValue, colStyle = {}, titleStyle = {}, renderer, type, horizontal,
            wFull, wHalf, wThird, wQuarter,
            borderTop4,
            borderBottom4, borderRight4,
            break: _break = false
        } = this.props;
        
        if(wQuarter) {
            colStyle.width = '25%';
        } else if(wThird) {
            colStyle.width = '33.3333%';
        } else if(wHalf) {
            colStyle.width = '50%';
        } else if(wFull) {
            colStyle.width = '100%';
        }
        if(borderTop4) {
            colStyle.borderTop = '4px solid #fafafa';
        }
        if(borderBottom4) {
            colStyle.borderBottom = '4px solid #fafafa';
        }
        if(borderRight4) {
            colStyle.borderRight = '4px solid #fafafa';
        }
        
        let node;
        if(!value) {
            if(type === 'file') {
                node = this.createNoImage();
            } else if(!noValue) {
                node = <Text style={{fontFamily: "Roboto", fontSize: 10}}>N/A</Text>;
            }
        } else {
            if(type === 'date') {
                node = this.createText(Dates.formatDate(value));
            } else if(type === 'file') {
                if(this.isDoc) {
                    node = this.createPDF(value.dlUrls[0]);
                } else {
                    let dlUrls;
                    if(value.dlUrls) {
                        dlUrls = value.dlUrls[0];
                    } else if(isString(value)) {
                        dlUrls = value;
                    }
                    node = this.createImage(dlUrls);
                }
            } else {
                node = this.createText(value);
            }
        }
        if(horizontal) {
            colStyle.flexDirection = 'row';
        }
        
        if(isArray(horizontal)) {
            titleStyle.width = horizontal[0];
//            if(horizontal[1]) {
//                
//            }
        }
        return <View break={_break} style={[styles.panel, colStyle]}>
            <Text style={[{fontFamily: "Roboto", fontWeight: "bold", fontSize: 10}, titleStyle]}>{title && title.toUpperCase()}</Text>
            {node}
        </View>;
    }
}
// </editor-fold>

export default Panel;