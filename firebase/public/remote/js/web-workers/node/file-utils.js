
(() => {
    
    // <editor-fold defaultstate="collapsed" desc="fileUtils. Click on the + sign on the left to edit the code.">
    self.fileUtils = {
        getFileName: function (filePath) {
            return filePath.split('\\').pop().split('/').pop();
        },

        getExtension: function (filePath) {
//            console.log('getExtension', filePath.substring(filePath.lastIndexOf('.') + 1, filePath.length))
            return filePath.substring(filePath.lastIndexOf('.') + 1, filePath.length) || filePath;
        }
    };
    // </editor-fold>

})();