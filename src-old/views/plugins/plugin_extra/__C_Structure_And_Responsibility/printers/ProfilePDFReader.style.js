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
        paddingTop: 0,
        paddingBottom: 0,
        paddingHorizontal: 0,
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
        fontSize: 12,
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
        fontSize: 12,
        color: '#888',
    },
    organogramPic: {
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'table',
        marginTop: '10px', 
        width: '100%', 
        height: '100%',
        backgroundColor: '#000'
    },
    contentPanel: {
        flexDirection: 'column',
        width: "100%",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        
        textAlign: 'center',
        backgroundColor: '#fafafa',
    },
    subHeading: {
        fontSize: 12,
        marginBottom: 10,
        paddingBottom: 7,
        textAlign: 'center',
        borderBottom: "1px solid #ddd"
        //    fontFamily: 'Roboto',
    },
});

// </editor-fold>

export default styles;
//573