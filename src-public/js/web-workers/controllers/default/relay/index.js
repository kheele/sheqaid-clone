(function () {
  class Controller extends AControllerRead {
    constructor(events, db) {
      super(events, db, {}, "relay/");

      const { addAction } = this;
      addAction("send", this.send.bind(this));
    }

    // <editor-fold defaultstate="collapsed" desc="send">
    // eslint-disable-next-line class-methods-use-this
    async send(evt, data) {
      // return Events.whenLoggedIn(async (loggedUser) => {
      // console.log("relay/send", data);
      if (!data) return null;
      const { query, variables, API_URL } = data;
      let { headers = {} } = data;

      if ("headers" in variables) {
        headers = { ...headers, ...variables.headers };
        // eslint-disable-next-line no-param-reassign
        delete variables.headers;
      }

      // Otherwise, fetch data from server
      return fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-access-key": "rhespo-g",
          ...headers,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      }).then((response) => response.json());
    }
    // </editor-fold>
  }

  // eslint-disable-next-line no-new
  new Controller(events, db);
})();
