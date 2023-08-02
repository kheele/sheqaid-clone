import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import insertDepartment from "mutations/all/Department/insertDepartment";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";

const tbl = "plugin_sheq_assist_departments";
//<editor-fold desc="transfer">
export const departments_transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    alert(`${tbl}`)

    const list1 = await workers.emit('relay/get_db', tbl);
    const list2 = await workers.emit('relay/get_db_hr', tbl);
    const list = [
        ...list1,
        ...list2
    ];
    alert(`${tbl}, ${list1.length}, ${list2.length}`)

    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            name,
            desc,
            created_at,
            company_id,
            client_id,
            project_id,
            site_id,
            client,
            project,
            site,
            user_id,

            contractor_id,
            contractor_user_id,
        } = data;

        const pg_company = await findByFirestoreIdCompany(company_id);
        const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
        const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
        const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
        const pg_user = await findByFirestoreIdUser(user_id);

        const pg_contractor = await findByFirestoreIdContractor(contractor_id);
        const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

        const item = {
            firestore_id: id,
            name,
            desc,
            department_owner: 'Private',
            created_at: Dates.formatTimestampSQL(created_at),
            company_id: pg_company.id,
            client_id: pg_client && pg_client.id,
            project_id: pg_project && pg_project.id,
            site_id: pg_site && pg_site.id,
            user_id: pg_user && pg_user.id,

            contractor_id: pg_contractor && pg_contractor.id,
            contractor_user_id: pg_contractor_user && pg_contractor_user.id,
        };//

        console.log('insertDepartment start', item)
        //save plugin
        try {
            const res = await insertDepartment(item);
            console.log('insertDepartment end', res)
        } catch (e) {
            console.log(name, e);
        }
    }
};
//</editor-fold>

//<editor-fold desc="create">
export const departments_create = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    let list = [
        'Marketing: This department is responsible for promoting the company`s products or services to customers and generating leads.',
        'Sales: This department is responsible for selling the company`s products or services to customers.',
        'Human Resources: This department is responsible for managing the company`s employees, including hiring, training, and employee relations.',
        'Finance: This department is responsible for managing the company`s financial affairs, including budgeting, accounting, and financial reporting.',
        'Operations: This department is responsible for managing the day-to-day activities of the company, including production, logistics, and supply chain management.',
        'Information Technology: This department is responsible for managing the company`s technology infrastructure, including computer systems, networks, and data storage.',
        'Customer Service: This department is responsible for handling customer inquiries, complaints, and feedback.',
        'Research and Development: This department is responsible for developing new products or improving existing products.',
        'Legal: This department is responsible for handling legal matters related to the company, including contracts, intellectual property, and compliance.',
        'Executive: This department consists of the company`s executive team, including the CEO, CFO, and other top-level executives.',
        'Product Management: This department is responsible for managing the development and launch of new products, as well as the ongoing management of existing products.',
        'Engineering: This department is responsible for designing, developing, and testing new products or technologies.',
        'Quality Assurance: This department is responsible for ensuring that the company`s products or services meet certain standards of quality.',
        'Purchasing: This department is responsible for sourcing and purchasing materials, supplies, and equipment needed for the company`s operations.',
        'Logistics: This department is responsible for managing the flow of goods and materials within the company, including transportation, warehousing, and distribution.',
        'Safety: This department is responsible for implementing and enforcing safety policies and procedures to prevent accidents and injuries.',
        'Environmental: This department is responsible for managing the company`s environmental impact, including compliance with environmental regulations and efforts to reduce waste and emissions.',
        'Public Relations: This department is responsible for managing the company`s reputation and relationships with the media, stakeholders, and the general public.',
        'Training and Development: This department is responsible for providing training and professional development opportunities for employees.',
        'Real Estate: This department is responsible for managing the company`s real estate holdings, including leasing, property management, and construction.',
        'Creative Services: This department is responsible for developing creative materials for the company, including branding, advertising, and design.',
        'Event Planning: This department is responsible for planning and executing events for the company, such as trade shows, product launches, and corporate events.',
        'Travel: This department is responsible for managing travel arrangements for employees, including flights, hotels, and rental cars.',
        'Translation: This department is responsible for translating the company`s materials and communications into different languages.',
        'Human Resources Information Systems: This department is responsible for managing the company`s human resources software and systems, including payroll and benefits.',
        'Corporate Social Responsibility: This department is responsible for managing the company`s efforts to have a positive impact on society and the environment.',
        'Government Relations: This department is responsible for managing the company`s relationships with government agencies and officials.',
        'Learning and Development: This department is responsible for developing and delivering training and development programs for employees.',
        'Global Expansion: This department is responsible for managing the company`s expansion into new markets and countries.',
        'Internal Communications: This department is responsible for managing communication within the company, including employee newsletters, intranet, and internal events.',
        'Talent Acquisition: This department is responsible for recruiting and hiring new employees for the company.',
        'Compensation and Benefits: This department is responsible for managing the company`s employee compensation and benefits programs, including salary, bonuses, and insurance.',
        'Workforce Planning: This department is responsible for forecasting the company`s workforce needs and developing strategies to meet those needs.',
        'Employee Relations: This department is responsible for managing employee relations, including handling grievances and disputes.',
        'Diversity and Inclusion: This department is responsible for promoting diversity and inclusion within the company, including implementing policies and programs to support diversity.',
        'Labor Relations: This department is responsible for managing the company`s relationships with labor unions and other employee organizations.',
        'Employee Engagement: This department is responsible for improving employee engagement and retention, including implementing programs and initiatives to support employee well-being.',
        'Talent Management: This department is responsible for identifying and developing the skills and talents of employees within the company.',
        'Leadership Development: This department is responsible for developing leadership skills and capabilities among the company`s employees.',
        'Organizational Development: This department is responsible for improving the overall effectiveness of the company, including implementing changes to the organizational structure or processes.',
        'Data Science: This department is responsible for analyzing and interpreting large data sets to extract insights and inform business decisions.',
        'Business Intelligence: This department is responsible for collecting and analyzing data from various sources to provide insights and support decision-making.',
        'Business Analytics: This department is responsible for using data and analytics to help the company understand its business and make informed decisions.',
        'Supply Chain Management: This department is responsible for managing the flow of goods and materials from suppliers to customers, including procurement, production, and distribution.',
        'Manufacturing: This department is responsible for producing the company`s products, including planning, scheduling, and quality control.',
        'Project Management: This department is responsible for managing the company`s projects, including planning, execution, and delivery.',
        'Inventory Management: This department is responsible for managing the company`s inventory levels, including ordering, tracking, and replenishment.',
        'Distribution: This department is responsible for distributing the company`s products to customers, including transportation, warehousing, and logistics.',
        'E-commerce: This department is responsible for managing the company`s online sales and fulfillment operations.',
        'Social Media: This department is responsible for managing the company`s social media presence and content.',
        'Data Security: This department is responsible for protecting the company`s data from unauthorized access or breaches.',
        'Cybersecurity: This department is responsible for protecting the company`s computer systems and networks from cyber threats.',
        'Information Governance: This department is responsible for managing the company`s data and information assets, including policy development and compliance.',
        'Compliance: This department is responsible for ensuring that the company complies with all relevant laws and regulations.',
        'Legal Operations: This department is responsible for managing the day-to-day operations of the company`s legal department, including budgeting, process improvement, and technology.',
        'Procurement: This department is responsible for sourcing and purchasing goods and services for the company.',
        'Financial Planning and Analysis: This department is responsible for developing and analyzing financial plans and budgets for the company.',
        'Treasury: This department is responsible for managing the company`s financial resources, including cash management and risk management.',
        'Accounting: This department is responsible for recording and reconciling the company`s financial transactions.',
        'Auditing: This department is responsible for reviewing and verifying the accuracy of the company`s financial records.',
        'Strategic Planning: This department is responsible for developing long-term strategies and plans for the company`s growth and success.',
        'Business Development: This department is responsible for identifying and pursuing new business opportunities for the company.',
        'Corporate Strategy: This department is responsible for analyzing the company`s strategic position and making recommendations for improvement.',
        'Mergers and Acquisitions: This department is responsible for managing the company`s mergers and acquisitions, including due diligence and integration.',
        'Innovation: This department is responsible for fostering innovation and new ideas within the company.',
        'Intellectual Property: This department is responsible for managing the company`s intellectual property, including patents, trademarks, and copyrights.',
        'Commercialization: This department is responsible for bringing new products or technologies to market.',
        'Corporate Communications: This department is responsible for managing the company`s public image and communications with stakeholders.',
        'Investor Relations: This department is responsible for managing the company`s relationships with investors, including financial reporting and shareholder communications.',
        'Corporate Social Responsibility: This department is responsible for managing the company`s efforts to have a positive impact on society and the environment.',
        'Sustainability: This department is responsible for developing and implementing sustainability initiatives for the company.',
        'Community Relations: This department is responsible for managing the company`s relationships with local communities.',
        'Philanthropy: This department is responsible for managing the company`s charitable giving and philanthropic efforts.',
        'Government Affairs: This department is responsible for managing the company`s relationships with government agencies and officials.',
        'Public Policy: This department is responsible for developing and advocating for public policy positions that align with the company`s interests.',
        'Political Action: This department is responsible for managing the company`s political activities, including lobbying and campaign contributions.',
        'Crisis Management: This department is responsible for managing the company`s response to crisis situations, such as natural disasters, accidents, or public relations disasters.',
        'Brand Management: This department is responsible for managing and protecting the company`s brand reputation and identity.',
        'Advertising: This department is responsible for developing and placing advertisements for the company.',
        'Public Relations: This department is responsible for managing the company`s reputation and relationships with the media, stakeholders, and the general public.',
        'Media Relations: This department is responsible for managing the company`s relationships with the media, including press releases and media events.',
        'Event Planning: This department is responsible for planning and executing events for the company, such as trade shows, product launches, and corporate events.',
        'Hospitality: This department is responsible for managing the company`s hospitality and entertainment functions, including catering, events, and guest services.',
        'Corporate Gifts: This department is responsible for selecting and distributing gifts and promotional items to clients, employees, and partners.',
        'Travel Management: This department is responsible for managing travel arrangements for employees, including flights, hotels, and rental cars.',
        'Translation: This department is responsible for translating the company`s materials and communications into different languages.',
        'Learning and Development: This department is responsible for developing and delivering training and development programs for employees.',
        'Talent Management: This department is responsible for identifying and developing the skills and talents of employees within the company.',
        'Leadership Development: This department is responsible for developing leadership skills and capabilities among the company`s employees.',
        'Organizational Development: This department is responsible for improving the overall effectiveness of the company, including implementing changes to the organizational structure or processes.',
        'Business Process Improvement: This department is responsible for identifying and implementing improvements to the company`s business processes to increase efficiency and effectiveness.',
        'Change Management: This department is responsible for managing and implementing change within the company, including communication, training, and stakeholder engagement.',
        'Process Engineering: This department is responsible for designing and improving the company`s business processes, including identifying bottlenecks and inefficiencies.',
        'Six Sigma: This department is responsible for implementing the Six Sigma methodology to improve quality and eliminate defects in the company`s processes.',
        'Lean: This department is responsible for implementing the Lean methodology to eliminate waste and improve efficiency in the company`s processes.',
        'Continuous Improvement: This department is responsible for identifying and implementing ongoing improvements to the company`s processes and systems.',
        'Quality Assurance: This department is responsible for ensuring that the company`s products or services meet certain standards of quality.',
        'Quality Control: This department is responsible for inspecting and testing the company`s products or services to ensure they meet quality standards.',
        'Regulatory Affairs: This department is responsible for managing the company`s compliance with regulatory requirements, including obtaining necessary approvals and licenses.'
    ].map(v => {
        const parts = v.split(': ');
        return {
            name: parts[0].trim(),
            desc: parts[1].trim(),
        };
    }).distinct('name');

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
            department_owner: 'Public',
        };//

        console.log('insertDepartment start', item)
        //save
        try {
            const res = await insertDepartment(item);
            console.log('insertDepartment end', res)
        } catch (e) {
            console.log(name, e);
        }
    }
};
//</editor-fold>
