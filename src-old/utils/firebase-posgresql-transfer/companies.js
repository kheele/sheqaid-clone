import {Dates, execWhen} from "../Utils";
import insertCompany from "mutations/all/Company/insertCompany";

const tbl = "default_companies";
//<editor-fold desc="transfer">
const transfer = async () => {
    await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

    alert(`${tbl}`)

    const list = await workers.emit('relay/get_db', tbl);
    alert(`${tbl}, ${list.length}`)
    for (let n = 0; n < list.length; n++) {
        const {id, data} = list[n];
        const {
            account_type,
            city,
            company_address,
            company_email,
            company_name,
            company_owner,
            company_owner_email,
            company_phone,
            consultant,
            country,
            created_at,
            business_id,
            company_category,
        } = data;

        const city_id = {
            Bloemfontein: 131038,
            "East London": 131093,
            Johannesburg: 131136,
            Kemtonpark: 131136,
            kemptonpark: 131136,
            Maseru: 66568,
            jh: 66568,
            Nelspruit: 131198,
            Pretoria: 131230,
            Gauteng: 131230,
            Sandton: 131136,
            "WINCHESTER HILLS , JOHANNESBURG": 131136,
        };
        const zone_id = {
            Bloemfontein: 932,
            "East London": 938,
            Johannesburg: 936,
            Kemtonpark: 936,
            kemptonpark: 936,
            Maseru: 3028,
            jh: 3028,
            Nelspruit: 937,
            Pretoria: 936,
            Gauteng: 936,
            Sandton: 936,
            "WINCHESTER HILLS , JOHANNESBURG": 936,
        };
        const category_id = {
            Banking: 1,
            Construction: 3,
            Mining: 10,
            Transportation: 12,
            Other: 13,
        };

        const item = {
            firestore_id: id,
            account_type,
            name: company_name,
            email: company_email,
            phone: company_phone,
            address: company_address,
            consultant,
            created_at: Dates.formatTimestampSQL(created_at),//.replace(' ', '/').replaceAll('-','/'),
            //2018/08/27/15:23:45
            city_id: city_id[city],
            business_id: business_id || null,
            // profile_pic: ,
            zone_id: zone_id[city],
            country_iso2: city === 'Maseru' || city === 'jh' ? 'LS' : "ZA",
        };
        if(company_category) {
            item.category_id = category_id[company_category];
        }

        console.log('insertCompany start', item)
        //save plugin
        try {
            const res = await insertCompany(item);
            console.log('insertCompany end', res)

            if (res && res.id) {
                // for (let n = 0; n < module_list.length; n++) {
                //     const v = module_list[n];
                //     const {
                //         id,
                //         title, desc, hover,
                //         discount, has_update, price, sort,
                //         faIconLeft, faIconRight, svgIconLeft, svgIconRight,
                //         key, status, borderColor,
                //         // manager_plugin_id,
                //         company_list
                //     } = v;
                //
                //     console.log('insertModule start',
                //         id,
                //         title, desc, hover,
                //         discount, has_update, price, sort,
                //         faIconLeft, faIconRight, svgIconLeft, svgIconRight,
                //         key, status, borderColor,
                //         manager_plugin_id,
                //         // company_list
                //     )
                //
                //     //save module
                //     const module_res = await insertModule({
                //         title, desc, hover,
                //         discount, has_update, price, sort,
                //         faIconLeft, faIconRight, svgIconLeft, svgIconRight,
                //         key, status, borderColor,
                //         manager_plugin_id,
                //         // company_list
                //     });
                //     console.log('insertModule end', module_res)
                // }
            }
        } catch (e) {
            console.log(e);
        }
    }
};
//</editor-fold>

export default {};
