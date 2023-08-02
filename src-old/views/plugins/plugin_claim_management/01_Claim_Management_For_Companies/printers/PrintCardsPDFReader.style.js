// <editor-fold defaultstate="collapsed" desc="imports">
import {Font, StyleSheet} from '@react-pdf/renderer';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Font.register">
//Font.register({family: 'Font Awesome 5 Free', src: 'css/lib/onsenui/fa-5.15.1/webfonts/fa-solid-900.ttf'});
//Font.register({ family: 'Roboto', src: source });
//Font.register({ family: 'FamilyName', src: source, fontStyle: 'normal', fontWeight: 'normal', fonts?: [] });
Font.register({family: 'Roboto', fonts: [
        {src: 'fonts/roboto/Roboto-Regular.ttf'}, // font-style: normal, font-weight: normal
        {src: 'fonts/roboto/Roboto-Medium.ttf', fontStyle: 'italic'},
        {src: 'fonts/roboto/Roboto-Bold.ttf'}, //fontStyle: 'italic', fontWeight: 700 },

    ]});
//Font.registerEmojiSource({
//  format: 'png',
//  url: 'https://twemoji.maxcdn.com/2/72x72/',
//});
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="styles">
const styles = StyleSheet.create({
    page: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingHorizontal: 0,
        flexDirection: 'column',
        textTransform: 'uppercase',
        fontFamily: "Roboto",
        color: '#fff'
    },
    flex: {
        flexDirection: 'row'
    },
    flexRow: {
        flexDirection: 'row',
    },
    panel: {
        flexDirection: 'column',
        flexGrow: 1,
        backgroundColor: "#fff",
        textAlign: 'left',
        lineHeight: 1.5,
        fontSize: 10,
        padding: 2,
//        borderRight: "2px dashed #ddd"
    },
    col2: {width: '50%'},
    col3: {width: '33.3333%'},
    col4: {width: '25%'},
    profilePicCover: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        placeItems: "center",
        position: 'absolute',
        top: 70,
        left: 0,
        right: 0,
    },
    profilePic: {
        borderRadius: '50%',
        width: 64,
        height: 64,
//        border: "2px solid #fff",
        backgroundColor: '#fff'
    },
    content: {
        flexDirection: 'column',
        width: "100%",
        padding: 0,
        placeItems: "center",

        textAlign: 'center',
        fontSize: 12
    },
    cardPanelGroupPage: {
        flexDirection: 'column',
        width: "100%",

        textAlign: 'center',
//        borderBottom: '1px dashed #eee',
    },
    cardPanelGroup: {
        flexDirection: 'row',
        width: "100%",

        textAlign: 'center',
        borderTop: '1px dashed #eee',
    },
    cardPanel: {
        flexDirection: 'column',
        width: 166, //584.6666
        height: 279.92, //1240
        padding: 0,
        margin: 0,
        position: 'relative',

        textAlign: 'center',
        borderRight: '1px dashed #eee',
    },
    cardPanelBackgroundImg: {
        position: 'absolute',
        minWidth: '100%',
        minHeight: '100%',
        display: 'block',
        height: '100%',
        width: '100%'
    },
    companyName: {
        fontFamily: "Roboto",
        fontSize: 7,
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        textAlign: 'center'
    },
    qrCodeImgCover: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        placeItems: "center",
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
    },
    qrCodeImg: {
        width: 45,
        height: 45,
    },
    employeeName: {
        position: 'absolute',
        top: 140,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 12
    },
    employeePos: {
        position: 'absolute',
        top: 155,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 9.5,
    },
    detailsPanel: {
        flexDirection: 'row',
        display: 'flex',
        position: 'absolute',
        top: 180,
        left: 0,
        right: 0,
        height: 50
    },
    detailsPanelLeft: {
        width: '40%',
        flexDirection: 'column',
        display: 'flex',
        textAlign: 'right',
        fontSize: 7,
        lineHeight: '2px'
    },
    detailsPanelRight: {
        width: '60%',
        flexDirection: 'column',
        display: 'flex',
        textAlign: 'left',
        paddingLeft: 4,
        fontSize: 7,
        lineHeight: '2px'
    },
    linksPanel: {
        position: 'absolute',
        top: 265,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 6
    },
    backDetailsPanel: {
        flexDirection: 'column',
        display: 'flex',
        position: 'absolute',
        top: 25,
        left: 0,
        right: 0,
        height: 145
    },
    backDetailsTitle: {
        fontSize: 8,
        marginBottom: 2
    },
    backDetailsTable: {
        borderLeft: '1px solid #fff',
        borderBottom: '1px solid #fff',
        display: 'flex',
        flexDirection: 'column',
        marginHorizontal: 2,
        marginBottom: 8
    },
    backDetailsTableRow: {
        display: 'flex',
        flexDirection: 'row',
//        height: 10,
        borderTop: '1px solid #fff',
    },
    backDetailsTableCell: {
        borderRight: '1px solid #fff',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        paddingBottom: 2,
        fontSize: 6,
    },
    backDetailsTableEm: {
//        fontStyle: 'bold'
    },
});
// </editor-fold>

export default styles;