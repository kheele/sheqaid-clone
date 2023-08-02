import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import insertSector from "mutations/all/Sector/insertSector";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";

const tbl = "default_sectors";
//<editor-fold desc="transfer">
export const sectors_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    alert(`${tbl}`)

    const list = await workers.emit('relay/get_db', tbl);
    alert(`${tbl}, ${list.length}`)
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            name,
            created_at,
            company_id,
            client_id,
            client,
            user_id,

            contractor_id,
            contractor_user_id,
        } = data;

        const pg_company = await findByFirestoreIdCompany(company_id);
        const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
        const pg_user = await findByFirestoreIdUser(user_id);

        const pg_contractor = await findByFirestoreIdContractor(contractor_id);
        const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

        const item = {
            firestore_id: id,
            name,
            sector_owner: 'Private',//Public,Private
            created_at: Dates.formatTimestampSQL(created_at),
            company_id: pg_company.id,
            client_id: pg_client && pg_client.id,
            user_id: pg_user && pg_user.id,

            contractor_id: pg_contractor && pg_contractor.id,
            contractor_user_id: pg_contractor_user && pg_contractor_user.id,
        };//

        console.log('insertSector start', item)
        //save plugin
        try {
            const res = await insertSector(item);
            console.log('insertSector end', res)
        } catch (e) {
            console.log(name, e);
        }
    }
};
//</editor-fold>

//<editor-fold desc="create">
export const sectors_create = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    let list = [
        {
            "name": "Technology",
            "desc": "Companies that design, develop, and sell technology products and services, such as software, hardware, and electronics."
        },
        {
            "name": "Finance",
            "desc": "Companies that provide financial services, such as banking, insurance, and investment."
        },
        {
            "name": "Retail",
            "desc": "Companies that sell goods and services directly to consumers, such as department stores, supermarkets, and online retailers."
        },
        {
            "name": "Manufacturing",
            "desc": "Companies that produce goods, such as clothing, appliances, and vehicles."
        },
        {
            "name": "Healthcare",
            "desc": "Companies that provide healthcare products and services, such as hospitals, pharmaceuticals, and medical devices."
        },
        {
            "name": "Energy",
            "desc": "Companies that produce, distribute, and sell energy, such as oil, gas, and renewable energy sources."
        },
        {
            "name": "Transportation",
            "desc": "Companies that provide transportation services, such as airlines, railroads, and trucking."
        },
        {
            "name": "Construction",
            "desc": "Companies that build and repair buildings, roads, and other infrastructure."
        },
        {
            "name": "Agriculture",
            "desc": "Companies that produce food, fiber, and other agricultural products."
        },
        {
            "name": "Media",
            "desc": "Companies that produce and distribute news, entertainment, and other media content."
        },
        {
            "name": "Hospitality",
            "desc": "Companies that provide accommodation, food, and other services to travelers and tourists."
        },
        {
            "name": "Education",
            "desc": "Companies that provide educational services, such as schools, universities, and online courses."
        },
        {
            "name": "Government",
            "desc": "Government agencies and departments that provide services to the public."
        },
        {
            "name": "Non-profit",
            "desc": "Non-profit organizations that serve a particular cause or group of people."
        },
        {
            "name": "Real estate",
            "desc": "Companies that buy, sell, and manage properties, such as residential and commercial buildings."
        },
        {
            "name": "Creative arts",
            "desc": "Companies that produce and distribute creative works, such as movies, music, and art."
        },
        {
            "name": "Sports and recreation",
            "desc": "Companies that produce and sell sports and recreation equipment, and provide sports and recreation services."
        },
        {
            "name": "Beauty and wellness",
            "desc": "Companies that produce and sell beauty and wellness products, and provide beauty and wellness services."
        },
        {
            "name": "Environmental",
            "desc": "Companies that produce and sell products and services related to the environment, such as renewable energy, sustainability, and eco-tourism."
        },
        {
            "name": "Chemicals",
            "desc": "Companies that produce and sell chemicals, such as pharmaceuticals, plastics, and cleaning products."
        },
        {
            "name": "Fire Management",
            "desc": "Companies that provide fire management services, such as fire prevention, suppression, and control."
        },
        {
            "name": "Harvesting",
            "desc": "Companies that harvest natural resources, such as timber, oil, and minerals."
        },
        {
            "name": "Mining",
            "desc": "Companies that extract and process minerals and other materials from the earth."
        },
        {
            "name": "Silviculture",
            "desc": "Companies that provide services for growing and caring for forests, including planting and nurturing trees, thinning and pruning, and controlling pests and diseases. Companies in the silviculture sector may provide silvicultural services, such as forest management and regeneration, or produce and sell products derived from forests, such as timber, paper, and wood products."
        },
        {
            "name": "Forestry",
            "desc": "Companies that provide the science and practice of managing forests for a variety of purposes, including timber production, conservation, and recreation. Companies in the forestry sector may be involved in forest management, logging, and the production of forest products, such as lumber and paper."
        },
        {
            "name": "Railway",
            "desc": "Companies that operate railroads and provide railway transportation services, as well as companies that manufacture and maintain railway equipment, such as locomotives and railcars. Railway companies may also provide related services, such as freight and passenger transportation, and may operate in both the public and private sectors."
        },
        ...[
            "Telecommunications: Companies that provide telecommunications services, such as phone and internet service.",
            "Logistics: Companies that provide logistics and supply chain management services, such as transportation, warehousing, and distribution.",
            "Food and beverage: Companies that produce and sell food and beverages, such as restaurants, cafes, and food manufacturers.",
            "Entertainment: Companies that provide entertainment, such as theme parks, movies, and live events.",
            "Security: Companies that provide security services, such as security guards and security systems.",
            "Data and analytics: Companies that provide data and analytics services, such as data storage, analysis, and visualization.",
            "Consumer goods: Companies that produce and sell consumer goods, such as household products, personal care products, and pet products.",
        ].map(v => {
            const parts = v.split(': ');
            return {
                name: parts[0].trim(),
                desc: parts[1].trim(),
            };
        })
    ].distinct('name');

    list.sortBy('name');

    alert(`${tbl}, ${list.length}`)

    for (let n = 0; n < list.length; n++) {
        const {
            name,
            desc,
        } = list[n];

        const item = {
            name,
            desc,
            sector_owner: 'Public',//Public,Private
        };//

        console.log('insertSector start', item)
        //save
        try {
            const res = await insertSector(item);
            console.log('insertSector end', res)
        } catch (e) {
            console.log(name, e);
        }
    }
};
//</editor-fold>