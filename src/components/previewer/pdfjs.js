import {execWhen, isWeb} from '../../utils/Utils';

export default class PDFJs {
    init = (previewPath, element, loadStart, loadStop) => {
        const tag = isWeb() ? 'iframe' : 'webview';
        const webview = document.createElement(tag);

        const isPDF = FileTypes.isPDF(previewPath);
        const isWord = FileTypes.isWord(previewPath);
        const isExcel = FileTypes.isExcel(previewPath);
        const isPPT = FileTypes.isPPT(previewPath);

        if(isWord || isExcel || isPPT) {
            $(element).html(webview);
            setTimeout(() => {
                webview.src = `https://view.officeapps.live.com/op/embed.aspx?src=${previewPath.dlUrls[0]}`;
            }, 100);
        } else {
            webview.src = previewPath;//`js/lib/pdfjs-2.3.200-dist/web/viewer.html?file=${src}`;
            $(element).html(webview);
        }

        //webview.addEventListener('did-start-loading', loadStart, false);
        //webview.addEventListener('did-stop-loading', loadStop, false);
    }
}
