/**
 * @generated SignedSource<<14db26bb909f987cd317bc2913112fc9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "object"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "object",
    "variableName": "object"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "created_at",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "common_names",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chemical_name",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "empirical_formula",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "un_num",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cas_num",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "concentration",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "category",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "physical_state",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "application_or_use",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "manufacturer",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "manufacturer_addr",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "manufacturer_phone_num",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "manufacturer_email",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "manufacturer_fax",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "manufacturer_website",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "emergency_phone_nums",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "location_where_product_is_used",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "process_where_product_is_used",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "is_stable",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "is_cool_well_ventilated_area",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "heat_sparks_static_flames",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "spillage_control",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "other_special_info",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "compatible_with_list",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "incompatible_with_list",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "risk_level",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "is_combustible",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "is_flammable",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "flammability_combustibility_class",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fire_fighting_foam",
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fire_fighting_dcp",
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fire_fighting_co2",
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fire_fighting_sand",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fire_fighting_water",
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fire_fighting_other",
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "is_hazardous",
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hazard_class_list",
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "has_sds",
  "storageKey": null
},
v44 = [
  (v2/*: any*/)
],
v45 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_chemical_sds",
  "kind": "LinkedField",
  "name": "sds",
  "plural": false,
  "selections": (v44/*: any*/),
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "sds_doc",
  "storageKey": null
},
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "sds_date",
  "storageKey": null
},
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "has_hazchem_sheet",
  "storageKey": null
},
v49 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_chemical_hazchem_sheets",
  "kind": "LinkedField",
  "name": "hazchem_sheet",
  "plural": false,
  "selections": (v44/*: any*/),
  "storageKey": null
},
v50 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hazchem_sheet_doc",
  "storageKey": null
},
v51 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hazchem_sheet_date",
  "storageKey": null
},
v52 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "has_risk_assessment",
  "storageKey": null
},
v53 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "risk_assessment_doc",
  "storageKey": null
},
v54 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "risk_assessment_date",
  "storageKey": null
},
v55 = [
  (v2/*: any*/),
  (v4/*: any*/)
],
v56 = {
  "alias": null,
  "args": null,
  "concreteType": "ppe",
  "kind": "LinkedField",
  "name": "ppe",
  "plural": false,
  "selections": (v55/*: any*/),
  "storageKey": null
},
v57 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "action_or_comments",
  "storageKey": null
},
v58 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "is_clearly_labeled",
  "storageKey": null
},
v59 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "storage_location",
  "storageKey": null
},
v60 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "unit",
  "storageKey": null
},
v61 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "qty",
  "storageKey": null
},
v62 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date_received",
  "storageKey": null
},
v63 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "expiry_date",
  "storageKey": null
},
v64 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v55/*: any*/),
  "storageKey": null
},
v65 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v55/*: any*/),
  "storageKey": null
},
v66 = {
  "alias": null,
  "args": null,
  "concreteType": "default_sites",
  "kind": "LinkedField",
  "name": "site",
  "plural": false,
  "selections": (v55/*: any*/),
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertChemicalProductMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "sheq_chemical_products",
        "kind": "LinkedField",
        "name": "insert_sheq_chemical_products_one",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v20/*: any*/),
          (v21/*: any*/),
          (v22/*: any*/),
          (v23/*: any*/),
          (v24/*: any*/),
          (v25/*: any*/),
          (v26/*: any*/),
          (v27/*: any*/),
          (v28/*: any*/),
          (v29/*: any*/),
          (v30/*: any*/),
          (v31/*: any*/),
          (v32/*: any*/),
          (v33/*: any*/),
          (v34/*: any*/),
          (v35/*: any*/),
          (v36/*: any*/),
          (v37/*: any*/),
          (v38/*: any*/),
          (v39/*: any*/),
          (v40/*: any*/),
          (v41/*: any*/),
          (v42/*: any*/),
          (v43/*: any*/),
          (v45/*: any*/),
          (v46/*: any*/),
          (v47/*: any*/),
          (v48/*: any*/),
          (v49/*: any*/),
          (v50/*: any*/),
          (v51/*: any*/),
          (v52/*: any*/),
          (v53/*: any*/),
          (v54/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_chemical_product__ppe",
            "kind": "LinkedField",
            "name": "ppe_list",
            "plural": true,
            "selections": [
              (v56/*: any*/)
            ],
            "storageKey": null
          },
          (v57/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_chemical_product_stock",
            "kind": "LinkedField",
            "name": "chemical_stock_list",
            "plural": true,
            "selections": [
              (v58/*: any*/),
              (v59/*: any*/),
              (v60/*: any*/),
              (v61/*: any*/),
              (v62/*: any*/),
              (v63/*: any*/)
            ],
            "storageKey": null
          },
          (v64/*: any*/),
          (v65/*: any*/),
          (v66/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertChemicalProductMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "sheq_chemical_products",
        "kind": "LinkedField",
        "name": "insert_sheq_chemical_products_one",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v20/*: any*/),
          (v21/*: any*/),
          (v22/*: any*/),
          (v23/*: any*/),
          (v24/*: any*/),
          (v25/*: any*/),
          (v26/*: any*/),
          (v27/*: any*/),
          (v28/*: any*/),
          (v29/*: any*/),
          (v30/*: any*/),
          (v31/*: any*/),
          (v32/*: any*/),
          (v33/*: any*/),
          (v34/*: any*/),
          (v35/*: any*/),
          (v36/*: any*/),
          (v37/*: any*/),
          (v38/*: any*/),
          (v39/*: any*/),
          (v40/*: any*/),
          (v41/*: any*/),
          (v42/*: any*/),
          (v43/*: any*/),
          (v45/*: any*/),
          (v46/*: any*/),
          (v47/*: any*/),
          (v48/*: any*/),
          (v49/*: any*/),
          (v50/*: any*/),
          (v51/*: any*/),
          (v52/*: any*/),
          (v53/*: any*/),
          (v54/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_chemical_product__ppe",
            "kind": "LinkedField",
            "name": "ppe_list",
            "plural": true,
            "selections": [
              (v56/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v57/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_chemical_product_stock",
            "kind": "LinkedField",
            "name": "chemical_stock_list",
            "plural": true,
            "selections": [
              (v58/*: any*/),
              (v59/*: any*/),
              (v60/*: any*/),
              (v61/*: any*/),
              (v62/*: any*/),
              (v63/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v64/*: any*/),
          (v65/*: any*/),
          (v66/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "24309859e5097aaebe70137147e2065b",
    "id": null,
    "metadata": {},
    "name": "insertChemicalProductMutation",
    "operationKind": "mutation",
    "text": "mutation insertChemicalProductMutation(\n  $object: sheq_chemical_products_insert_input!\n) {\n  insert_sheq_chemical_products_one(object: $object) {\n    id\n    created_at\n    name\n    common_names\n    chemical_name\n    empirical_formula\n    un_num\n    cas_num\n    concentration\n    category\n    physical_state\n    type\n    application_or_use\n    manufacturer\n    manufacturer_addr\n    manufacturer_phone_num\n    manufacturer_email\n    manufacturer_fax\n    manufacturer_website\n    emergency_phone_nums\n    location_where_product_is_used\n    process_where_product_is_used\n    is_stable\n    is_cool_well_ventilated_area\n    heat_sparks_static_flames\n    spillage_control\n    other_special_info\n    compatible_with_list\n    incompatible_with_list\n    risk_level\n    is_combustible\n    is_flammable\n    flammability_combustibility_class\n    fire_fighting_foam\n    fire_fighting_dcp\n    fire_fighting_co2\n    fire_fighting_sand\n    fire_fighting_water\n    fire_fighting_other\n    is_hazardous\n    hazard_class_list\n    has_sds\n    sds {\n      id\n    }\n    sds_doc\n    sds_date\n    has_hazchem_sheet\n    hazchem_sheet {\n      id\n    }\n    hazchem_sheet_doc\n    hazchem_sheet_date\n    has_risk_assessment\n    risk_assessment_doc\n    risk_assessment_date\n    ppe_list {\n      ppe {\n        id\n        name\n      }\n      id\n    }\n    action_or_comments\n    chemical_stock_list {\n      is_clearly_labeled\n      storage_location\n      unit\n      qty\n      date_received\n      expiry_date\n      id\n    }\n    client {\n      id\n      name\n    }\n    project {\n      id\n      name\n    }\n    site {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "7ffc765accd7539d606941ff5eb25dab";

module.exports = node;
