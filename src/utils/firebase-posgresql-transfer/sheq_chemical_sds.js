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
import insertChemicalSDS from "../../mutations/all/Chemicals/ChemicalSDS/insertChemicalSDS";
import findByFirestoreIdChemicalProduct
    from "../../mutations/all/Chemicals/ChemicalProduct/findByFirestoreIdChemicalProduct";
import findByFirestoreIdChemicalSDS from "../../mutations/all/Chemicals/ChemicalSDS/findByFirestoreIdChemicalSDS";
import findByFirestoreIdChemicalHazchemsheet
    from "../../mutations/all/Chemicals/ChemicalHazchemsheet/findByFirestoreIdChemicalHazchemsheet";
import updateChemicalProduct from "../../mutations/all/Chemicals/ChemicalProduct/updateChemicalProduct";
import updateChemicalSDS from "../../mutations/all/Chemicals/ChemicalSDS/updateChemicalSDS";

const tbl = "plugin_sheq_assist_Hazardous_Chemical_Substances_msds";
//<editor-fold desc="transfer">
export const sheq_chemical_sds_transfer = async () => {
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
            client_id, project_id, site_id,
            client, project, site,
            //1
            product,
            name, common_names, chemical_name, empirical_formula, un_num,
            category, date_identified,//other added
            application_or_use,
            manufacturer, manufacturer_addr, manufacturer_phone_num, manufacturer_email, manufacturer_fax, manufacturer_website,
            emergency_phone_nums,
//            emergency_phone, //replaced with emergency_phone_nums
            risk_level,//other added
            more_product_info,
            //2
            composition_or_information_on_ingredients,
            //3
            hazards_identification,
            //4
            first_aid_measures_and_precautions,
            //5
            firefighting_measures,
            //6
            accidental_release_measures,
            //7
            handling_and_storage_requirements,
            //8
            exposure_controls_or_personal_protection,
            //9
            physical_and_chemical_properties,
            //10
            stability_and_reactivity,
            //11
            toxicological_info,
            //12
            ecological_info,
            //13
            disposal_considerations,
            //14
            transport_info,
            //15
            regulatory_info,
            //16
            other_info,
            //17
            doc
        } = data;

        const existingItem = await findByFirestoreIdChemicalSDS(id);
        if(existingItem) {
            const pg_product = await findByFirestoreIdChemicalProduct(product && product.id);

            const item = {
                id: existingItem.id,
                //
                created_at: Dates.formatDateSQL(created_at),
                //
                product_id: pg_product && pg_product.id,
            };
            console.log('updateChemicalSDS start', item)
            //save
            try {
                const res = await updateChemicalSDS(item);
                console.log('updateChemicalSDS end', res)
            } catch (e) {
                console.log(name, e);
            }
        } else {
            const pg_company = await findByFirestoreIdCompany(company_id);
            const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
            const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
            const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
            const pg_user = await findByFirestoreIdUser(user_id);

            const pg_contractor = await findByFirestoreIdContractor(contractor_id);
            const pg_contractor_site = await findByFirestoreIdSite(contractor_site_id);
            const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

            const pg_product = await findByFirestoreIdChemicalProduct(product && product.id);

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
                product_id: pg_product && pg_product.id,
                name,
                common_names,
                chemical_name,
                empirical_formula,
                un_num,
                category,
                date_identified: Dates.formatDateSQL(date_identified),//other added
                application_or_use,
                manufacturer,
                manufacturer_addr,
                manufacturer_phone_num,
                manufacturer_email,
                manufacturer_fax,
                manufacturer_website,
                emergency_phone_nums,
//            emergency_phone, //replaced with emergency_phone_nums
                risk_level,//other added
                more_product_info,
                //2
                composition_or_information_on_ingredients,
                //3
                hazards_identification,
                //4
                first_aid_measures_and_precautions,
                //5
                firefighting_measures,
                //6
                accidental_release_measures,
                //7
                handling_and_storage_requirements,
                //8
                exposure_controls_or_personal_protection,
                //9
                physical_and_chemical_properties,
                //10
                stability_and_reactivity,
                //11
                toxicological_info,
                //12
                ecological_info,
                //13
                disposal_considerations,
                //14
                transport_info,
                //15
                regulatory_info,
                //16
                other_info,
                //17
                doc
            };//

            console.log('insertChemicalSDS start', item)
            //save
            try {
                const res = await insertChemicalSDS(item);
                console.log('insertChemicalSDS end', res)
            } catch (e) {
                console.log(name, e);
            }
        }
    }
};
//</editor-fold>

//<editor-fold desc="update">
export const sheq_chemical_sds_update = async () => {
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
            if(item2) {
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
