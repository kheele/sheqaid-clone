import React from "react";

import {AsyncSpan, AsyncTD} from '../views/plugins/components';

window.RenderUtils = {
    renderImage: (f, w, h, defaultPic) => {
        console.log(f)
        if (f) {
            if (f.dlUrls) {
                return <img src={f.dlUrls[0]} width={w} height={h}/>;
            }
            if (f.path) {
                return <img src={f.path} width={w} height={h}/>;
            }
        }
        if(defaultPic) {
            return <img src={defaultPic} width={w} height={h}/>;
        }
        return null;
    },
    renderOrgTD: (v, alt, title, className = "") => {
        if (!v) {
            return <div className={"td " + className}>
                <h6 className="xs-shown font-size-13">{title}</h6>
                {isString(alt) ? alt : "All"}
            </div>;
        }
        return <AsyncTD defaultValue={v} renderer={RenderUtils.renderOrgName} defaultText={alt || "All"} title={title} className={className}/>;
    },
    renderOrgSpan: (v, alt) => {
        if (!v) {
            return <span>{isString(alt) ? alt : "All"}</span>;
        }
        return <AsyncSpan defaultValue={v} renderer={RenderUtils.renderOrgName} defaultText={alt || "All"}/>;
    },
    renderAllOrgsTD: (client, project, site, alt) => {
        return <div className="td">
            <span className="block-inline">
                <b>Company: </b><br />
                {RenderUtils.renderOrgSpan(client)}
            </span>
            <span className="block-inline">
                <b>Project: </b><br />
                {RenderUtils.renderOrgSpan(project)}
            </span>
            <span className="block-inline">
                <b>Site: </b><br />
                {RenderUtils.renderOrgSpan(site)}
            </span> 
        </div>;
    },
    renderOrgName: v => {
        return v === 'All' ? v : (v.name || v.data.name);
    },
    selectedClient: function (key) {
        const {item: {id, data: mainData, data: {project, site}}} = this;
        const client = key ? mainData[key] : mainData.client;
        if (client === 'All') {
            return {value: client, label: client};
        }
        if (client) {
            const {name, data} = client;
            return {value: client, label: name || data.name};
        }
    },
    selectedProject: function () {
        const {item: {id, data: {client, project, site}}} = this;

        if (project === 'All') {
            return {value: project, label: project};
        }
        if (project) {
            const {name, data} = project;
            return {value: project, label: name || data.name};
        }
    },
    selectedSite: function () {
        const {item: {id, data: {client, site}}} = this;

        if (site === 'All') {
            return {value: site, label: site};
        }
        if (site) {
            const {name, data} = site;
            return {value: site, label: name || data.name};
        }
    }
};

window.rootUrl = () => {
    let loc = document.location.toString().replace("index.html", "");
    if (loc.contains('#')) {
        loc = loc.replace(document.location.hash, "").replace("#", "");
    }
    return loc;
};

window.printPDF = url => {
    let loc = rootUrl();
    const {BrowserWindow} = electronRemote;
    let printWindow = new BrowserWindow({
//        width: 0,
//        height: 0,
//        show: false,
//        modal: false,
//        frame: false,
//        parent: electronRemote.getCurrentWindow(),
        webPreferences: {webviewTag: true, nodeIntegration: false, webSecurity: false}
    });
    console.log('url', url)
    printWindow.loadURL(url);
//    printWindow.loadURL(loc + `js/lib/pdfjs-2.3.200-dist/web/viewer.html?file=${url}`);
    printWindow.on('closed', () => {
        printWindow = null;
    });
    printWindow.webContents.on('did-finish-load', () => {
        printWindow.webContents.executeJavaScript("\n\
            new Promise(function(resolve, reject) {\n\
                PDFViewerApplication.eventBus.on('textlayerrendered', function () {\n\
                    document.querySelector('.print').click();\n\
                });\n\
                PDFViewerApplication.eventBus.on('afterprint', function () {\n\
                    resolve(PDFViewerApplication.printing)\n\
                });\n\
            });\n\
        ").then(printing => {
//            alert('printed: ' + printing)
            const options = {
                silent: false
            };
//        printWindow.webContents.print(options, (success, errorType) => {
//            if (!success) {
//                console.log(errorType);
//            }
//            if (!printing) {
            setTimeout(() => {
//                printWindow && printWindow.close();
            }, 5000);
//            }
//        });
        });
    });
};

window.base64ToUrl = (type, base64) => {
    const types = {
        PDF: 'application/pdf',
//        Word: 'application/pdf',
//        Excel: 'application/pdf',
        //images
        PNG: 'image/png',
        GIF: 'image/gif',
        JPG: 'image/jpeg',
        JPEG: 'image/jpeg'
    };
    const mime = types[type];
    const dataUri = `data:${mime};base64,${base64}`;
    return dataUriToUrl(dataUri);
};
window.base64ToUrlPDF = base64 => {
    return base64ToUrl('PDF', base64);
};

window.dataUriToUrl = dataUri => {
//    alert(dataUri)
    function dataUritoBlob(dataUri) {
//        console.log('dataUri', dataUri)
        // convert base64/URLEncoded data component to raw binary data held in a string
        let byteString;

        if (dataUri.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(dataUri.split(',')[1]);
        } else {
            byteString = unescape(dataUri.split(',')[1]);
        }

        // separate out the mime component
        const mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type: mimeString});
    }
//    alert(dataUri)
    const blob = dataUritoBlob(dataUri);
    return URL.createObjectURL(blob);
};

window.saveFileAs = (dataUri, name) => {
    const a = document.createElement("a");
    const url = dataUriToUrl(dataUri);
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
};

window.convertIdToBigint = (encodedHasuraRelayID) => {
    try {
        const decodedRelayID = atob(encodedHasuraRelayID);
        const relayIdAsArray = JSON.parse(decodedRelayID);
        const actualDatabaseID = relayIdAsArray[3];
        // console.log(decodedRelayID); // "[1, \"lifeplan\", \"status_plan_header\", 1]"
        // console.log(relayIdAsArray); // [1, "lifeplan", "status_plan_header", 1]
        // console.log(actualDatabaseID); // 1  (the actual database ID)!
        return actualDatabaseID;
    } catch (e) {
        return encodedHasuraRelayID;
    }
};
