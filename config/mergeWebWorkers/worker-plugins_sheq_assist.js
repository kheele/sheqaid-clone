'use strict';

module.exports = path => [
        // '_00_Document_and_Record_Control/index.js',

        // '_01_Project_Plan/index.js',
        // '_01_Project_Plan/documents.js',
        // '_02_IMS_Policies/index.js',
        //
        // '_05_Trainings/trainings_funs.js',
        // '_05_Trainings/manuals.js',
        // '_05_Trainings/reports.js',
        // '_05_Trainings/training_courses.js',//
        // '_05_Trainings/training_plan.js',
        // '_05_Trainings/training_matrix.js',//
        // '_05_Trainings/toolbox_talks_subject_categories.js',
        '_05_Trainings/toolbox_talks_attendance_registers.js',//
        // '_05_Trainings/training_register.js',
        // '_05_Trainings/toolbox_talks.js',//
        // '_05_Trainings/certificates.js',

        // '_06_Communication_And_Participation/kpi.js',
        // '_06_Communication_And_Participation/management_meeting.js',
        // '_06_Communication_And_Participation/management_meeting_minutes.js',
        // '_06_Communication_And_Participation/safety_meeting.js',
        // '_06_Communication_And_Participation/safety_meeting_minutes.js',

        // '_08_Environmental_Aspects/reports.js',
        // '_08_Environmental_Aspects/checklist.js',
        // '_08_Environmental_Aspects/emp.js',
        // '_08_Environmental_Aspects/qap.js',
        // '_08_Environmental_Aspects/pollution_register.js',
        // '_08_Environmental_Aspects/ncr.js',
        // '_08_Environmental_Aspects/enviro_ra.js',
        // '_08_Environmental_Aspects/incidents_cause_analysis.js',
        // '_08_Environmental_Aspects/incidents_remedial_action_plan.js',
        // '_08_Environmental_Aspects/incidents.js',

        // '_09_HIRA_And_Opportunities/baseline.js',
        // '_09_HIRA_And_Opportunities/task_base.js',
        // '_09_HIRA_And_Opportunities/sop.js',
        // '_09_HIRA_And_Opportunities/swp.js',

        // '_13_2_3_Hazardous_Chemical_Substances/funs_chemical.js',
        // '_13_2_3_Hazardous_Chemical_Substances/funs_container.js',
        // '_13_2_3_Hazardous_Chemical_Substances/funs_hazchem-sheet.js',
        // '_13_2_3_Hazardous_Chemical_Substances/funs_sds.js',
        // '_13_2_3_Hazardous_Chemical_Substances/chemical-inventory.js',//
        '_13_2_3_Hazardous_Chemical_Substances/container-inventory.js',//
        // '_13_2_3_Hazardous_Chemical_Substances/hazchem-sheet.js',//
        // '_13_2_3_Hazardous_Chemical_Substances/msds.js',//
        // '_13_2_3_Hazardous_Chemical_Substances/msds_templates.js',

        // '_16_Emergency_Preparedness/emergency_drill_drill.js',
        // '_16_Emergency_Preparedness/emergency_drill_matrix.js',
        // '_16_Emergency_Preparedness/emergency_drill_report.js',
        // '_16_Emergency_Preparedness/emergency_numbers_external.js',
        // '_16_Emergency_Preparedness/emergency_numbers_internal.js',
        // '_16_Emergency_Preparedness/emergency_procedure.js',
        // '_16_Emergency_Preparedness/emergency_roll_call.js',
        // '_16_Emergency_Preparedness/evaluation_record.js',

        // '_17_Incident_Investigation/funs.js',
        // '_17_Incident_Investigation/stats.js',
        // '_17_Incident_Investigation/_17_Incident_Investigation.js',//
        // '_17_Incident_Investigation/_17_Incident_Investigation_investigations.js',//
        '_17_Incident_Investigation/_17_Incident_Investigation_corrective_actions.js',//
        // '_17_Incident_Investigation/flash_reports.js',
        '_17_Incident_Investigation/man_hours.js',//
        
        // '_18_Nonconformance_Management/ncr_funs.js',
        // '_18_Nonconformance_Management/ncr.js',//

        // '_19_Maintenance/tools.js',//
        // '_19_Maintenance/tools_daily_register.js',
        // '_19_Maintenance/tools_written_off.js',
        '_19_Maintenance/parts.js',//
        '_19_Maintenance/job_cards.js',//
        // '_19_Maintenance/actions.js',
        // '_19_Maintenance/tasks.js',
        // '_19_Maintenance/calibration_record.js',
        // '_19_Maintenance/maintanance_plan.js',
        // '_19_Maintenance/monitoring_plan.js',
        // '_19_Maintenance/docs.js',//

        // '_21_Internal_Audit/audit_questionnaire_funs.js',
        // '_21_Internal_Audit/checkable_templates.js',
        // '_21_Internal_Audit/checkables_impl.js',
        // '_21_Internal_Audit/checkable_checklist.js',
        // '_21_Internal_Audit/checkable_inspection.js',
        // '_21_Internal_Audit/checkable_inspection_schedules.js',
        // '_21_Internal_Audit/checkable_register.js',
        // '_21_Internal_Audit/checkable_templates_schedules.js',
        // '_21_Internal_Audit/safety_observations_report.js',
        // '_21_Internal_Audit/audit.js',//
        // '_21_Internal_Audit/construction_audits.js'
    ].map(v => path + '/plugins/plugin_sheq_assist/' + v);
