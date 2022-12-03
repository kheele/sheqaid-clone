
(() => {
    importScripts(self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/__A_COVID_Management/cases_impl.js");

    importScripts(
//            self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/__A_COVID_Management/reports.js",
            self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/__A_COVID_Management/screening.js",
            self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/__A_COVID_Management/vulnerable.js",
            self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/__A_COVID_Management/return-to-work.js",
            self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/__A_COVID_Management/positive.js",
            self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/__A_COVID_Management/documents.js"
            );
})();

//import * as reports from './reports';
//import * as screening from './screening';
//import * as vulnerable from './vulnerable';
//import * as return_to_work from './return-to-work';
//import * as positive from './positive';
//
//import * as businesses from './businesses';
//
//function run(worker) { 
//    reports.run(worker);   
//    screening.run(worker); 
//    vulnerable.run(worker); 
//    return_to_work.run(worker); 
//    positive.run(worker); 
//    
//    businesses.run(worker); 
//}
//
//export {run};