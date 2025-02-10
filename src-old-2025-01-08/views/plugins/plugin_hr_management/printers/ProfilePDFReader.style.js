// <editor-fold defaultstate="collapsed" desc="imports">
import {Font, StyleSheet} from '@react-pdf/renderer';

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="styles">
//Font.register({family: 'Font Awesome 5 Free', src: 'css/lib/onsenui/fa-5.15.1/webfonts/fa-solid-900.ttf'});
//Font.register({ family: 'Roboto', src: source });
//Font.register({ family: 'FamilyName', src: source, fontStyle: 'normal', fontWeight: 'normal', fonts?: [] });
Font.register({ family: 'Roboto', fonts: [
    {src: 'fonts/roboto/Roboto-Regular.ttf'}, // font-style: normal, font-weight: normal
    {src: 'fonts/roboto/Roboto-Medium.ttf', fontStyle: 'italic' },
    {src: 'fonts/roboto/Roboto-Bold.ttf'}, //fontStyle: 'italic', fontWeight: 700 },
    
]});
//Font.registerEmojiSource({
//  format: 'png',
//  url: 'https://twemoji.maxcdn.com/2/72x72/',
//});

const styles = StyleSheet.create({
    page: {
        paddingTop: 35,
        paddingBottom: 45,
        paddingHorizontal: 35,
        flexDirection: 'column',
        textTransform: 'uppercase',
        fontFamily: "Roboto"
    },
    flex: {
        flexDirection: 'row'
    },
//    flexGrow: {
//        flexGrow: 1,
//        width: "50%"
//    },
    flexRow: {
        flexDirection: 'row',
    },
    gridGap5: {
        gap: '5px',
    },
    panel: {
        flexDirection: 'column',
        flexGrow: 1,
        backgroundColor: "#fff",
        textAlign: 'left',
        lineHeight: 1.4,
        fontSize: 10,
        padding: 10,
//        borderRight: "2px dashed #ddd"
    },
    col1: {width: '100%'},
    col2: {width: '50%'},
    col3: {width: '33.3333%'},
    col4: {width: '25%'},
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    footerText: {
        margin: 12,
        fontSize: 11,
        marginBottom: 5,
        textAlign: 'center',
        //    fontFamily: 'Roboto',
    },
    header: {
        width: "100%",
        padding: 10,
        marginBottom: 15,
        display: "grid",
        borderRadius: 5,
        placeItems: "center",
        
        textAlign: 'center',
        backgroundColor: '#fafafa',
        fontSize: 16,
        color: '#888',
        
//    fontFamily: 'Roboto',
    },
    content: {
        flexDirection: 'column',
        width: "100%",
        padding: 0,
        marginBottom: 10,
        borderRadius: 5,
        placeItems: "center",
        
        textAlign: 'center',
        fontSize: 11,
        color: '#888',
    },
    profilePicCover: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        placeItems: "center"
    },
    profilePic: {
        width: 60,
        height: 60,
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        border: "5px solid #eee",
        borderRadius: "50%",
        backgroundColor: '#eee'
    },
    copyPic: {
        maxWidth: '100%',
        maxHeight: 400,
        marginLeft: 'auto',
        marginTop: 10,
        marginRight: 'auto',
        display: 'table',
        backgroundColor: '#000'
    },
    contentPanel: {
        flexDirection: 'column',
        width: "100%",
        padding: 5,
        marginBottom: 10,
        borderRadius: 5,
        
        textAlign: 'center',
        backgroundColor: '#fafafa',
    },
    subHeading: {
        fontSize: 11,
        marginBottom: 10,
        paddingBottom: 5,
        textAlign: 'center',
        borderBottom: "2px solid #eee"
        //    fontFamily: 'Roboto',
    },
    headingPoint: {
        backgroundColor: '#f7f7f7',
        marginBottom: '5px',
        padding: '5px', 
        fontWeight: 'bold'
    },
    headingPoint2: {
        borderBottom: '1px solid #eee', 
        paddingBottom: '5px', 
        fontSize: 10
    },
    
    table: {
        borderLeft: '1px solid #fff',
        borderBottom: '1px solid #fff',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff', 
        padding: 10
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
//        height: 10,
        borderTop: '1px solid #fff',
    },
    tableCell: {
        borderRight: '1px solid #fff',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        paddingBottom: 2,
        fontSize: 6,
    },
    tableEm: {
//        fontStyle: 'bold'
    },
    evidencePanelGroup: {
        flexDirection: 'row',
        width: "100%",

        textAlign: 'center',
        borderTop: '1px dashed #eee',
    },
});

// </editor-fold>

export default styles;
//573