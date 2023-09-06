(function () {
  class Controller extends AControllerRead {
    constructor(events) {
      super(events, null, "files/");

      const { addAction } = this;
      addAction("upload", this.upload.bind(this));
    }

    // <editor-fold defaultstate="collapsed" desc="upload">
    async upload(evt, data) {
      // return Events.whenLoggedIn(async (loggedUser) => {
      // console.log("files/upload", data);
      if (!data) return null;
      const { file, path, name } = data;
      if (!file) return null;
      if (!path) return null;
      if (!name) return null;

      const gcsUri = await files.upload
        .call(
          this,
          file,
          async (bucketFile) => `${path}/${name}.${fileUtils.getExtension(bucketFile.name)}`
        )
        // eslint-disable-next-line no-unused-vars
        .catch((err) => {
          console.error(err);
          //                        doc_ref.delete();//Promise < void >
          //                        throw e;
        });

      return gcsUri;
      // });
    }
    // </editor-fold>
  }

  // eslint-disable-next-line no-new
  new Controller(events);
})();
