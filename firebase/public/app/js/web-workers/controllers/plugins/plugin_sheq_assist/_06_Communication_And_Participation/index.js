
importScripts(
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_06_Communication_And_Participation/kpi.js",
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_06_Communication_And_Participation/management_meeting.js",
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_06_Communication_And_Participation/management_meeting_minutes.js",
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_06_Communication_And_Participation/safety_meeting.js",
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_06_Communication_And_Participation/safety_meeting_minutes.js"
        );

//import * as kpi from './kpi';
//
//import * as management_meeting from './management_meeting';
//import * as management_meeting_minutes from './management_meeting_minutes';
//
//import * as safety_meeting from './safety_meeting';
//import * as safety_meeting_minutes from './safety_meeting_minutes';
//
//function run(worker) {
//    kpi.run(worker);   
//    
//    management_meeting.run(worker);   
//    management_meeting_minutes.run(worker); 
//    
//    safety_meeting.run(worker);   
//    safety_meeting_minutes.run(worker); 
//}
//
//export {run};