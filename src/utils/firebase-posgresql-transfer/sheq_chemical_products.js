import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import updateEmployee from "../../mutations/all/Employee/updateEmployee";
import findByFirestoreIdTeam from "../../mutations/all/Team/findByFirestoreIdTeam";
import updateTeam from "../../mutations/all/Team/updateTeam";
import insertChemicalProduct from "../../mutations/all/Chemicals/ChemicalProduct/insertChemicalProduct";
import findByFirestoreIdChemicalSDS from "../../mutations/all/Chemicals/ChemicalSDS/findByFirestoreIdChemicalSDS";
import updateChemicalProduct from "../../mutations/all/Chemicals/ChemicalProduct/updateChemicalProduct";
import findByFirestoreIdChemicalHazchemsheet
    from "../../mutations/all/Chemicals/ChemicalHazchemsheet/findByFirestoreIdChemicalHazchemsheet";
import findByFirestoreIdChemicalProduct
    from "../../mutations/all/Chemicals/ChemicalProduct/findByFirestoreIdChemicalProduct";

const tbl = "plugin_sheq_assist_Hazardous_Chemical_Substances_chemical_inventory";
//<editor-fold desc="transfer">
export const sheq_chemical_products_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    

    const list = await workers.emit('relay/get_db2', tbl);
    
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            company_id,
            user_id,
            contractor_user_id,
            contractor_id,
            contractor_site_id,
            //
            created_at,
            //0
            client_id,
            project_id,
            site_id,
            client,
            project,
            site,
            //1
            name,
            common_names,
            chemical_name,
            empirical_formula,
            un_num,
            cas_num,
            concentration,
            category,
            physical_state,
            type,
            application_or_use,
            manufacturer,
            manufacturer_addr,
            manufacturer_phone_num,
            manufacturer_email,
            manufacturer_fax,
            manufacturer_website,
            emergency_phone_nums,
            //2
            location_where_product_is_used,
            process_where_product_is_used,
            is_stable,
            is_cool_well_ventilated_area,
            heat_sparks_static_flames,
            spillage_control,
            other_special_info,
            //3
            compatible_with_list,
            incompatible_with_list,
            //4
            risk_level,
            //5
            is_combustible,
            is_flammable,
            flammability_combustibility_class,
            //6
            fire_fighting_foam,
            fire_fighting_dcp,
            fire_fighting_co2,
            fire_fighting_sand,
            fire_fighting_water,
            fire_fighting_other,
            //7
            is_hazardous,
            hazard_class_list,
            //8
            has_sds,
            sds,
            sds_doc,
            sds_date,
            //9
            has_hazchem_sheet,
            hazchem_sheet,
            hazchem_sheet_doc,
            hazchem_sheet_date,
            //10
            has_risk_assessment,
            risk_assessment_doc,
            risk_assessment_date,
            //11
            ppe_type_list,
            //12
            action_or_comments,
            //13
            chemical_stock_list
        } = data;

        const existingItem = await findByFirestoreIdChemicalProduct(id);
        if(existingItem) {
            const pg_sds = await findByFirestoreIdChemicalSDS(sds && sds.id);
            const pg_hazchem_sheet = await findByFirestoreIdChemicalHazchemsheet(hazchem_sheet && hazchem_sheet.id);

            const item = {
                id: existingItem.id,
                //
                created_at: Dates.formatDateSQL(created_at),
                //
                sds_id: pg_sds && pg_sds.id,
                hazchem_sheet_id: pg_hazchem_sheet && pg_hazchem_sheet.id,//later
            };
            console.log('updateChemicalProduct start', item)
            //save
            try {
                const res = await updateChemicalProduct(item);
                console.log('updateChemicalProduct end', res)
            } catch (e) {
                console.log(name, e);
            }
        } else {
            if (company_id) {
                const pg_company = await findByFirestoreIdCompany(company_id);
                const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
                const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
                const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
                const pg_user = await findByFirestoreIdUser(user_id);

                const pg_contractor = await findByFirestoreIdContractor(contractor_id);
                const pg_contractor_site = await findByFirestoreIdSite(contractor_site_id);
                const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

                const item = {
                    firestore_id: id,
                    company_id: pg_company && pg_company.id,
                    user_id: pg_user && pg_user.id,
                    contractor_id: pg_contractor && pg_contractor.id,
                    contractor_site_id: pg_contractor_site && pg_contractor_site.id,
                    contractor_user_id: pg_contractor_user && pg_contractor_user.id,
                    //0
                    client_id: pg_client && pg_client.id,
                    project_id: pg_project && pg_project.id,
                    site_id: pg_site && pg_site.id,
                    //1
                    name,
                    common_names,
                    chemical_name,
                    empirical_formula,
                    un_num,
                    cas_num,
                    concentration,
                    category,
                    physical_state,
                    type,
                    application_or_use,
                    manufacturer,
                    manufacturer_addr,
                    manufacturer_phone_num,
                    manufacturer_email,
                    manufacturer_fax,
                    manufacturer_website,
                    emergency_phone_nums,
                    //2
                    location_where_product_is_used,
                    process_where_product_is_used,
                    is_stable,
                    is_cool_well_ventilated_area,
                    heat_sparks_static_flames,
                    spillage_control,
                    other_special_info,
                    //3
                    compatible_with_list,
                    incompatible_with_list,
                    //4
                    risk_level,
                    //5
                    is_combustible,
                    is_flammable,
                    flammability_combustibility_class,
                    //6
                    fire_fighting_foam,
                    fire_fighting_dcp,
                    fire_fighting_co2,
                    fire_fighting_sand,
                    fire_fighting_water,
                    fire_fighting_other,
                    //7
                    is_hazardous,
                    hazard_class_list,
                    //8
                    has_sds,
                    // sds_id: sds && sds.id,//later
                    sds_doc,
                    sds_date: Dates.formatDateSQL(sds_date),
                    //9
                    has_hazchem_sheet,
                    // hazchem_sheet_id: hazchem_sheet && hazchem_sheet.id,//later
                    hazchem_sheet_doc,
                    hazchem_sheet_date: Dates.formatDateSQL(hazchem_sheet_date),
                    //10
                    has_risk_assessment,
                    risk_assessment_doc,
                    risk_assessment_date: Dates.formatDateSQL(risk_assessment_date),
                    //11
                    ppe_type_list: {
                        data: (ppe_type_list || []).map(v => {
                            if (v.ppe_type) {
                                if(!v.ppe_type.id) {
                                    return;
                                }
                                return {ppe_type_id: v.ppe_type.id};
                            } else {
                                if(!v.id) {
                                    return;
                                }
                                return {ppe_type_id: v.id};
                            }
                        }).filter(v => !!v)
                    },
                    //12
                    action_or_comments,
                    //13
                    chemical_stock_list: {
                        data: (chemical_stock_list || []).filter(v => !!v).map((
                            {is_clearly_labeled, storage_location, unit, qty, date_received, expiry_date}
                        ) => ({
                            is_clearly_labeled,
                            storage_location,
                            unit,
                            qty,
                            date_received,
                            expiry_date: Dates.formatDateSQL(expiry_date)
                        }))
                    }
                };//

                console.log('insertChemicalProduct start', item)
                //save
                try {
                    const res = await insertChemicalProduct(item);
                    console.log('insertChemicalProduct end', res)
                } catch (e) {
                    console.log(name, e);
                }
            } else {
                console.log(name, "NO_COMPANY_ID");
            }
        }
    }
};
//</editor-fold>

//<editor-fold desc="update">
export const sheq_chemical_products_update = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    

    const list = await workers.emit('relay/get_db', tbl);
    
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            name,
        } = data;

        const pg_supervisor = await findByFirestoreIdEmployee(supervisor && supervisor.id);

        let item = await findByFirestoreIdTeam(id);
        await Promise.all((employee_list || []).map(async id => {
            let item2 = await findByFirestoreIdEmployee(id);
            if (item2) {
                item2 = {
                    id: item2.id,
                    team_id: item.id,
                };
                console.log('updateEmployee start', item2)
                try {
                    const res = await updateEmployee(item2);
                    console.log('updateEmployee end', res)
                } catch (e) {
                    console.log(id, e);
                }
            }
        }));

        item = {
            id: item.id,
            supervisor_id: pg_supervisor && pg_supervisor.id,
        };

        console.log('updateTeam start', item)
        try {
            const res = await updateTeam(item);
            console.log('updateTeam end', res)
        } catch (e) {
            console.log(id, name, e);
        }
    }
};
//</editor-fold>
