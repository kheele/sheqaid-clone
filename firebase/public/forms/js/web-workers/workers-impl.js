
importScripts(self.locationRoot + "js/web-workers/node/electron_modules.js");

importScripts(self.locationRoot + "js/web-workers/node/moment-2.24.0.min.js");

importScripts(self.locationRoot + "worker-contr.js");

importScripts(self.locationRoot + "worker-utils.js");

importScripts(self.locationRoot + "worker-funs.js");

//admin
importScripts(self.locationRoot + "worker-admin.js");
//default
importScripts(self.locationRoot + "worker-defaults.js");
//plugins
importScripts(self.locationRoot + "worker-plugins_claim_management.js");
importScripts(self.locationRoot + "worker-plugins_hr_management.js");
importScripts(self.locationRoot + "worker-plugins_extra.js");
importScripts(self.locationRoot + "worker-plugins_general.js");
importScripts(self.locationRoot + "worker-plugins_sheq_assist.js");