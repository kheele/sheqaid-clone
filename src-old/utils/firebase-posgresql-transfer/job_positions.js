import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdJobCategory from "../../mutations/all/JobCategory/findByFirestoreIdJobCategory";
import insertJobPosition from "../../mutations/all/JobPosition/insertJobPosition";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByNameJobCategory from "../../mutations/all/JobCategory/findByNameJobCategory";

const tbl = "plugin_sheq_assist_job_positions";
//<editor-fold desc="transfer">
export const job_positions_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    alert(`${tbl}`)

    const list1 = await workers.emit('relay/get_db', tbl);
    const list2 = await workers.emit('relay/get_db_hr', tbl);

    const list = [];
    const fn = (item) => {
        if (list.noneMatch(({id, data: {name, company_id, client_id, project_id, site_id}}) => {
            return name === item.data.name &&
                company_id === item.data.company_id &&
                client_id === item.data.client_id &&
                project_id === item.data.project_id &&
                site_id === item.data.site_id;
        })) {
            list.push(item);
        }
    };
    list1.forEach(fn);
    list2.forEach(fn);

    alert(`${tbl}, ${list.length}`)

    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            name,
            desc,
            job_category,
            doc,
            created_at,
            company_id,
            client_id,
            project_id,
            site_id,
            client,
            project,
            site,
            user_id,
            job_category_id,

            contractor_id,
            contractor_user_id,
        } = data;

        const pg_company = await findByFirestoreIdCompany(company_id);
        const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
        const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
        const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
        const pg_user = await findByFirestoreIdUser(user_id);

        let pg_job_category;
        if(job_category_id) {
            pg_job_category = await findByFirestoreIdJobCategory(job_category_id);
            if(!pg_job_category && job_category) {
                pg_job_category = await findByNameJobCategory(job_category, pg_client && pg_client.id);
            }
        } else if(job_category) {
            pg_job_category = await findByNameJobCategory(job_category, pg_client && pg_client.id);
        }

        const pg_contractor = await findByFirestoreIdContractor(contractor_id);
        const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

        const item = {
            firestore_id: id,
            name,
            desc,
            doc,
            created_at: Dates.formatTimestampSQL(created_at),
            company_id: pg_company && pg_company.id,
            client_id: pg_client && pg_client.id,
            project_id: pg_project && pg_project.id,
            site_id: pg_site && pg_site.id,
            user_id: pg_user && pg_user.id,
            job_category_id: pg_job_category && pg_job_category.id,

            contractor_id: pg_contractor && pg_contractor.id,
            contractor_user_id: pg_contractor_user && pg_contractor_user.id,
        };//

        console.log('insertJobPosition start', item)
        //save plugin
        try {
            const res = await insertJobPosition(item);
            console.log('insertJobPosition end', res)
        } catch (e) {
            console.log(name, e);
        }
    }
};
//</editor-fold>

//<editor-fold desc="create">
export const job_positions_create = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    let list = [
        {
            "name": "CEO",
            "desc": "The CEO is responsible for the overall strategic direction and performance of the company."
        },
        {
            "name": "CFO",
            "desc": "The CFO is responsible for the financial management and performance of the company."
        },
        {
            "name": "CTO",
            "desc": "The CTO is responsible for the technology strategy and execution of the company."
        },
        {
            "name": "HR Manager",
            "desc": "The HR Manager is responsible for the human resources function of the company, including hiring, employee relations, and benefits."
        },
        {
            "name": "Marketing Manager",
            "desc": "The Marketing Manager is responsible for the marketing strategy and execution of the company."
        },
        {
            "name": "Sales Manager",
            "desc": "The Sales Manager is responsible for the sales strategy and execution of the company."
        },
        {
            "name": "Product Manager",
            "desc": "The Product Manager is responsible for the product strategy and execution of the company."
        },
        {
            "name": "Operations Manager",
            "desc": "The Operations Manager is responsible for the operational efficiency and performance of the company."
        },
        {
            "name": "Customer Success Manager",
            "desc": "The Customer Success Manager is responsible for ensuring customer satisfaction and success with the company's products or services."
        },
        ...[
            "Academic librarian",
            "Accountant",
            "Accounting technician",
            "Actuary",
            "Adult nurse",
            "Advertising account executive",
            "Advertising account planner",
            "Advertising copywriter",
            "Advice worker",
            "Advocate (Scotland)",
            "Aeronautical engineer",
            "Agricultural consultant",
            "Agricultural manager",
            "Aid worker/humanitarian worker",
            "Air traffic controller",
            "Airline cabin crew",
            "Amenity horticulturist",
            "Analytical chemist",
            "Animal nutritionist",
            "Animator",
            "Archaeologist",
            "Architect",
            "Architectural technologist",
            "Archivist",
            "Armed forces officer",
            "Aromatherapist",
            "Art therapist",
            "Arts administrator",
            "Auditor",
            "Automotive engineer",
            "Barrister",
            "Barrister’s clerk",
            "Bilingual secretary",
            "Biomedical engineer",
            "Biomedical scientist",
            "Biotechnologist",
            "Brand manager",
            "Broadcasting presenter",
            "Building control officer/surveyor",
            "Building services engineer",
            "Building surveyor",
            "Camera operator",
            "Careers adviser (higher education)",
            "Careers adviser",
            "Careers consultant",
            "Cartographer",
            "Catering manager",
            "Charities administrator",
            "Charities fundraiser",
            "Chemical (process) engineer",
            "Child psychotherapist",
            "Children's nurse",
            "Chiropractor",
            "Civil engineer",
            "Civil Service administrator",
            "Clinical biochemist",
            "Clinical cytogeneticist",
            "Clinical microbiologist",
            "Clinical molecular geneticist",
            "Clinical research associate",
            "Clinical scientist - tissue typing",
            "Clothing and textile technologist",
            "Colour technologist",
            "Commercial horticulturist",
            "Commercial/residential/rural surveyor",
            "Commissioning editor",
            "Commissioning engineer",
            "Commodity broker",
            "Communications engineer",
            "Community arts worker",
            "Community education officer",
            "Community worker",
            "Company secretary",
            "Computer sales support",
            "Computer scientist",
            "Conference organiser",
            "Consultant",
            "Consumer rights adviser",
            "Control and instrumentation engineer",
            "Corporate banker",
            "Corporate treasurer",
            "Counsellor",
            "Courier/tour guide",
            "Court reporter/verbatim reporter",
            "Credit analyst",
            "Crown Prosecution Service lawyer",
            "Crystallographer",
            "Curator",
            "Customs officer",
            "Cyber security specialist",
            "Dance movement therapist",
            "Data analyst",
            "Data scientist",
            "Data visualisation analyst",
            "Database administrator",
            "Debt/finance adviser",
            "Dental hygienist",
            "Dentist",
            "Design engineer",
            "Dietitian",
            "Diplomatic service",
            "Doctor (general practitioner, GP)",
            "Doctor (hospital)",
            "Dramatherapist",
            "Economist",
            "Editorial assistant",
            "Education administrator",
            "Electrical engineer",
            "Electronics engineer",
            "Employment advice worker",
            "Energy conservation officer",
            "Engineering geologist",
            "Environmental education officer",
            "Environmental health officer",
            "Environmental manager",
            "Environmental scientist",
            "Equal opportunities officer",
            "Equality and diversity officer",
            "Ergonomist",
            "Estate agent",
            "European Commission administrators",
            "Exhibition display designer",
            "Exhibition organiser",
            "Exploration geologist",
            "Facilities manager",
            "Field trials officer",
            "Financial manager",
            "Firefighter",
            "Fisheries officer",
            "Fitness centre manager",
            "Food scientist",
            "Food technologist",
            "Forensic scientist",
            "Geneticist",
            "Geographical information systems manager",
            "Geomatics/land surveyor",
            "Government lawyer",
            "Government research officer",
            "Graphic designer",
            "Health and safety adviser",
            "Health and safety inspector",
            "Health promotion specialist",
            "Health service manager",
            "Health visitor",
            "Herbalist",
            "Heritage manager",
            "Higher education administrator",
            "Higher education advice worker",
            "Homeless worker",
            "Horticultural consultant",
            "Hotel manager",
            "Housing adviser",
            "Human resources officer",
            "Hydrologist",
            "Illustrator",
            "Immigration officer",
            "Immunologist",
            "Industrial/product designer",
            "Information scientist",
            "Information systems manager",
            "Information technology/software trainers",
            "Insurance broker",
            "Insurance claims inspector",
            "Insurance risk surveyor",
            "Insurance underwriter",
            "Interpreter",
            "Investment analyst",
            "Investment banker - corporate finance",
            "Investment banker – operations",
            "Investment fund manager",
            "IT consultant",
            "IT support analyst",
            "Journalist",
            "Laboratory technician",
            "Land-based engineer",
            "Landscape architect",
            "Learning disability nurse",
            "Learning mentor",
            "Lecturer (adult education)",
            "Lecturer (further education)",
            "Lecturer (higher education)",
            "Legal executive",
            "Leisure centre manager",
            "Licensed conveyancer",
            "Local government administrator",
            "Local government lawyer",
            "Logistics/distribution manager",
            "Magazine features editor",
            "Magazine journalist",
            "Maintenance engineer",
            "Management accountant",
            "Manufacturing engineer",
            "Manufacturing machine operator",
            "Manufacturing toolmaker",
            "Marine scientist",
            "Market research analyst",
            "Market research executive",
            "Marketing account manager",
            "Marketing assistant",
            "Marketing executive",
            "Materials engineer",
            "Materials specialist",
            "Mechanical engineer",
            "Media analyst",
            "Media buyer",
            "Media planner",
            "Medical physicist",
            "Medical representative",
            "Mental health nurse",
            "Metallurgist",
            "Meteorologist",
            "Microbiologist",
            "Midwife",
            "Mining engineer",
            "Mobile developer",
            "Multimedia programmer",
            "Multimedia specialists",
            "Museum education officer",
            "Museum/gallery exhibition officer",
            "Music therapist",
            "Nano-scientist",
            "Nature conservation officer",
            "Naval architect",
            "Network administrator",
            "Nurse",
            "Nutritional therapist",
            "Nutritionist",
            "Occupational therapist",
            "Oceanographer",
            "Office manager",
            "Operational researcher",
            "Orthopedist",
            "Outdoor pursuits manager",
            "Packaging technologist",
            "Paediatric nurse",
            "Paramedic",
            "Patent attorney",
            "Patent examiner",
            "Pension scheme manager",
            "Personal assistant",
            "Petroleum engineer",
            "Pharmacist",
            "Pharmacologist",
            "Pharmacovigilance officer",
            "Photographer",
            "Physiotherapist",
            "Picture researcher",
            "Planning and development surveyor",
            "Planning technician",
            "Plant breeder",
            "Police officer",
            "Political party agent",
            "Political party research officer",
            "Practice nurse",
            "Press photographer",
            "Press sub-editor",
            "Prison officer",
            "Private music teacher",
            "Probation officer",
            "Product development scientist",
            "Programme researcher",
            "Project manager",
            "Psychologist (clinical)",
            "Psychologist (educational)",
            "Psychotherapist",
            "Public affairs consultant (lobbyist)",
            "Public affairs consultant (research)",
            "Public house manager",
            "Public librarian",
            "Public relations (PR) officer",
            "QA analyst",
            "Quality assurance manager",
            "Quantity surveyor",
            "Records manager",
            "Recruitment consultant",
            "Recycling officer",
            "Regulatory affairs officer",
            "Research chemist",
            "Research scientist",
            "Restaurant manager",
            "Retail banker",
            "Retail buyer",
            "Retail manager",
            "Retail merchandiser",
            "Retail pharmacist",
            "Sales executive",
            "Scene of crime officer",
            "Secretary",
            "Seismic interpreter",
            "Site engineer",
            "Site manager",
            "Social researcher",
            "Social worker",
            "Software developer",
            "Soil scientist",
            "Solicitor",
            "Speech and language therapist",
            "Sports coach",
            "Sports development officer",
            "Sports therapist",
            "Statistician",
            "Stockbroker",
            "Structural engineer",
            "Systems analyst",
            "Systems developer",
            "Tax inspector",
            "Teacher (nursery/early years)",
            "Teacher (primary)",
            "Teacher (secondary)",
            "Teacher (special educational needs)",
            "Teaching/classroom assistant",
            "Technical author",
            "Technical sales engineer",
            "TEFL/TESL teacher",
            "Television production assistant",
            "Test automation developer",
            "Tour operator",
            "Tourism officer",
            "Tourist information manager",
            "Town and country planner",
            "Toxicologist",
            "Trade union research officer",
            "Trader",
            "Trading standards officer",
            "Training and development officer",
            "Translator",
            "Transportation planner",
            "Travel agent",
            "TV/film/theatre set designer",
            "UX designer",
            "Validation engineer",
            "Veterinary nurse",
            "Veterinary surgeon",
            "Video game designer",
            "Video game developer",
            "Volunteer work organiser",
            "Warehouse manager",
            "Waste disposal officer",
            "Water conservation officer",
            "Water engineer",
            "Web designer",
            "Web developer",
            "Welfare rights adviser",
            "Writer",
            "Youth worker"
        ].map(name => ({name})),
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
            job_position_owner: 'Public',//Public,Private
        };//

        console.log('insertJobPosition start', item)
        //save plugin
        try {
            const res = await insertJobPosition(item);
            console.log('insertJobPosition end', res)
        } catch (e) {
            console.log(name, e);
        }
    }
};
//</editor-fold>