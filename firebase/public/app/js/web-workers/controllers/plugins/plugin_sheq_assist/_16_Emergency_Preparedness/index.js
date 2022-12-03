
importScripts(
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_16_Emergency_Preparedness/emergency_drill.js",
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_16_Emergency_Preparedness/emergency_numbers.js",
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_16_Emergency_Preparedness/emergency_procedure.js",
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_16_Emergency_Preparedness/emergency_roll_call.js",
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_16_Emergency_Preparedness/evaluation_record.js"
        );

//import * as emergency_drill from './emergency_drill';
//import * as emergency_numbers from './emergency_numbers';
//import * as emergency_procedure from './emergency_procedure';
//import * as emergency_roll_call from './emergency_roll_call';
//import * as evaluation_record from './evaluation_record';
//
//function run(worker) {
//    emergency_drill.run(worker);    
//    emergency_numbers.run(worker);    
//    emergency_procedure.run(worker);  
//    emergency_roll_call.run(worker);  
//    evaluation_record.run(worker);
//}
//
//export {run};