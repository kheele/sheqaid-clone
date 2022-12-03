
importScripts(
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_19_Maintenance/tools.js",
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_19_Maintenance/tools_daily_register.js",
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_19_Maintenance/tools_written_off.js",
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_19_Maintenance/actions.js",
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_19_Maintenance/tasks.js",
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_19_Maintenance/calibration_record.js",
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_19_Maintenance/maintanance_plan.js",
        self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_19_Maintenance/monitoring_plan.js"
        );

//import * as tools from './tools';
//import * as tools_daily_register from './tools_daily_register';
//import * as tools_written_off from './tools_written_off';
//
//import * as actions from './actions';
//import * as tasks from './tasks';
//
//import * as calibration_record from './calibration_record';
//import * as maintanance_plan from './maintanance_plan';
//import * as monitoring_plan from './monitoring_plan';
//
//function run(worker) {
//    tools.run(worker);   
//    tools_daily_register.run(worker);   
//    tools_written_off.run(worker);   
//     
//    actions.run(worker);    
//    tasks.run(worker); 
//    
//    calibration_record.run(worker);  
//    maintanance_plan.run(worker);  
//    monitoring_plan.run(worker);      
//}
//
//export {run};