import {isWeb} from '../../utils/Utils';

export default class PDFJs {
    init = (previewPath, element, loadStart, loadStop) => {
        const tag = isWeb() ? 'iframe' : 'webview';
        const webview = document.createElement(tag);
        webview.src = previewPath;//`js/lib/pdfjs-2.3.200-dist/web/viewer.html?file=${src}`;

        //webview.addEventListener('did-start-loading', loadStart, false);
        //webview.addEventListener('did-stop-loading', loadStop, false);
        $(element).html(webview);
    }
}
