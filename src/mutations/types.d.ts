
//<editor-fold desc="EntityClient">
export type EntityClient = {
    id: bigint;
    name: string;
    created_at: object;
};
//</editor-fold>

//<editor-fold desc="EntityCompanyCategory">
export type EntityCompanyCategory = {
    id: bigint;
    name: string;
    created_at: object;
};
//</editor-fold>

//<editor-fold desc="EntityCity">
export type EntityCity = {
    id: bigint;
    name: string;
    latitude: string;
    longitude: string;
    wikiDataId: string;
    country_iso2: string;
    country: EntityCountry;//default_countries_obj_rel_insert_input
    zone: EntityZone;//default_zones_obj_rel_insert_input
    zone_id: bigint;
    zone_code: string;
    company_list: [EntityCompany];//default_companies_arr_rel_insert_input
};
//</editor-fold>

//<editor-fold desc="EntityCompany">
export type EntityCompany = {
    id: bigint;
    account_type: string;//account_type
    name: string;
    email: string;
    phone: string;
    address: string;
    category_id: bigint;
    category: EntityCompanyCategory;
    consultant: boolean;
    no_projects: boolean;
    created_at: object;
    country: EntityCountry;
    country_iso2: string;
    city: EntityCity;
    city_id: bigint;
    business_id: string;
    profile_pic: string;
    zone: EntityZone;
    zone_id: bigint;
};
//</editor-fold>

//<editor-fold desc="EntityCountry">
export type EntityCountry = {
    capital: string;
    city_list: [EntityCity];//default_cities_arr_rel_insert_input
    company_list: [EntityCompany];//default_companies_arr_rel_insert_input
    currency: string;
    currency_name: string;
    currency_symbol: string;
    date_format: string;
    emoji: string;
    emojiU: string;
    id: bigint;
    iso2: string;
    iso3: string;
    latitude: string;
    living_address_list: [];//hr_employees_living_address_arr_rel_insert_input
    longitude: string;
    name: string;
    native: string;
    numeric_code: string;
    phone_code: string;
    region: string;
    subregion: string;
    symbol: string;
    timezones: object;
    tld: string;
    translations: object;
    zone_list: [EntityZone];//default_zones_arr_rel_insert_input
};
//</editor-fold>

//<editor-fold desc="EntityModule">
export type EntityModule = {
    id: number;
    borderColor: string;
    desc: string;
    discount: number;
    faIconLeft: string;
    faIconRight: string;
    has_update: boolean;
    hover: string;
    key: string;
    manager_plugin_id: number;
    price: number;
    sort: number;
    svgIconLeft: string;
    svgIconRight: string;
    title: string;
    status: string;//manager_module_status
    manager_plugin: EntityPlugin;//default_manager_plugin_obj_rel_insert_input
    company_list: [EntityCompany];//proxy_plugin_module__company_arr_rel_insert_input
    signature_setting_list: [];//default_signature_settings_arr_rel_insert_input
};
//</editor-fold>

//<editor-fold desc="EntityPermissionModule">
export type EntityPermissionModule = {
    id: bigint;

};
//</editor-fold>

//<editor-fold desc="EntityPermissionOther">
export type EntityPermissionOther = {
    id: bigint;

};
//</editor-fold>

//<editor-fold desc="EntityPlugin">
export type EntityPlugin = {
    id: number;
    app: string;//manager_plugin_app;
    key: string;
    status: string;//manager_plugin_status
    title: string;
    desc: string;
    module_list: [EntityModule];//default_manager_module_arr_rel_insert_input
    signature_setting_list: [];//default_signature_settings_arr_rel_insert_input
};
//</editor-fold>

//<editor-fold desc="EntityProject">
export type EntityProject = {
    id: bigint;
    name: string;
    created_at: object;
};
//</editor-fold>

//<editor-fold desc="EntitySite">
export type EntitySite = {
    id: bigint;
    name: string;
    created_at: object;
};
//</editor-fold>

//<editor-fold desc="EntityUser">
export type EntityUser = {
    id: bigint;

};
//</editor-fold>

//<editor-fold desc="EntityZone">
export type EntityZone = {
    id: bigint;
    name: string;
    code: string;
    type: string;
    latitude: string;
    longitude: string;
    country_iso2: string;
    country: EntityCountry;//default_countries_obj_rel_insert_input
    city_list: [EntityCity];//default_cities_arr_rel_insert_input
    company_list: [EntityCompany];//default_companies_arr_rel_insert_input
};
//</editor-fold>
