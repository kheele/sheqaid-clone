/**
 * @generated SignedSource<<d6dcbaf0476420dee9c92185daa7dc1b>>
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
    "name": "id"
  }
],
v1 = [
  {
    "fields": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "_eq",
            "variableName": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "id"
      }
    ],
    "kind": "ObjectValue",
    "name": "where"
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
  "name": "physical_state",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v7 = [
  (v2/*: any*/)
],
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_chemical_products",
  "kind": "LinkedField",
  "name": "product",
  "plural": false,
  "selections": (v7/*: any*/),
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_chemical_sds",
  "kind": "LinkedField",
  "name": "sds",
  "plural": false,
  "selections": (v7/*: any*/),
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "contacts_emergency_name",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "contacts_emergency_num",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "contacts_manufacturer_name",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "contacts_manufacturer_num",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "doc",
  "storageKey": null
},
v15 = [
  (v2/*: any*/),
  (v14/*: any*/),
  (v6/*: any*/)
],
v16 = {
  "alias": "precaution_photo_concentrate_list",
  "args": [
    {
      "kind": "Literal",
      "name": "where",
      "value": {
        "type": {
          "_eq": "Concentrate"
        }
      }
    }
  ],
  "concreteType": "sheq_chemical_hazchem_sheet_docs",
  "kind": "LinkedField",
  "name": "precaution_photo_list",
  "plural": true,
  "selections": (v15/*: any*/),
  "storageKey": "precaution_photo_list(where:{\"type\":{\"_eq\":\"Concentrate\"}})"
},
v17 = {
  "alias": "precaution_photo_application_list",
  "args": [
    {
      "kind": "Literal",
      "name": "where",
      "value": {
        "type": {
          "_eq": "Application"
        }
      }
    }
  ],
  "concreteType": "sheq_chemical_hazchem_sheet_docs",
  "kind": "LinkedField",
  "name": "precaution_photo_list",
  "plural": true,
  "selections": (v15/*: any*/),
  "storageKey": "precaution_photo_list(where:{\"type\":{\"_eq\":\"Application\"}})"
},
v18 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": {
        "_eq": "Active Ingredient"
      }
    }
  }
],
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "group",
  "storageKey": null
},
v21 = {
  "_eq": "Hazard Identification"
},
v22 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v21/*: any*/),
      "type": {
        "_eq": "Physical"
      }
    }
  }
],
v23 = [
  (v19/*: any*/),
  (v20/*: any*/),
  (v6/*: any*/)
],
v24 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v21/*: any*/),
      "type": {
        "_eq": "Reproductive"
      }
    }
  }
],
v25 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v21/*: any*/),
      "type": {
        "_eq": "Biological"
      }
    }
  }
],
v26 = {
  "_eq": "First Aid Procedure"
},
v27 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v26/*: any*/),
      "type": {
        "_eq": "Splashes In Eyes"
      }
    }
  }
],
v28 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v26/*: any*/),
      "type": {
        "_eq": "Contact with Skin"
      }
    }
  }
],
v29 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v26/*: any*/),
      "type": {
        "_eq": "Mouth Contact or Eaten"
      }
    }
  }
],
v30 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v26/*: any*/),
      "type": {
        "_eq": "Fumes Breathed In"
      }
    }
  }
],
v31 = {
  "_eq": "Emergency Action For Spills"
},
v32 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v31/*: any*/),
      "type": {
        "_eq": "Small Spills"
      }
    }
  }
],
v33 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v31/*: any*/),
      "type": {
        "_eq": "Large Spills"
      }
    }
  }
],
v34 = {
  "_eq": "Disposal"
},
v35 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v34/*: any*/),
      "type": {
        "_eq": "Used Containers"
      }
    }
  }
],
v36 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v34/*: any*/),
      "type": {
        "_eq": "Unused Product"
      }
    }
  }
],
v37 = [
  (v2/*: any*/),
  (v4/*: any*/)
],
v38 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v37/*: any*/),
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v37/*: any*/),
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "concreteType": "default_sites",
  "kind": "LinkedField",
  "name": "site",
  "plural": false,
  "selections": (v37/*: any*/),
  "storageKey": null
},
v41 = [
  (v19/*: any*/),
  (v20/*: any*/),
  (v6/*: any*/),
  (v2/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "findByIdChemicalHazchemsheetQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "sheq_chemical_hazchem_sheetsConnection",
        "kind": "LinkedField",
        "name": "sheq_chemical_hazchem_sheets_connection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_chemical_hazchem_sheetsEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_chemical_hazchem_sheets",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  {
                    "alias": "active_ingredient_list",
                    "args": (v18/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": [
                      (v19/*: any*/),
                      (v20/*: any*/)
                    ],
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Active Ingredient\"}})"
                  },
                  {
                    "alias": "hazard_identification_physical_list",
                    "args": (v22/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v23/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Hazard Identification\"},\"type\":{\"_eq\":\"Physical\"}})"
                  },
                  {
                    "alias": "hazard_identification_reproductive_list",
                    "args": (v24/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v23/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Hazard Identification\"},\"type\":{\"_eq\":\"Reproductive\"}})"
                  },
                  {
                    "alias": "hazard_identification_biological_list",
                    "args": (v25/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v23/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Hazard Identification\"},\"type\":{\"_eq\":\"Biological\"}})"
                  },
                  {
                    "alias": "first_aid_procedure_splashes_in_eyes_list",
                    "args": (v27/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v23/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Splashes In Eyes\"}})"
                  },
                  {
                    "alias": "first_aid_procedure_contact_with_skin_list",
                    "args": (v28/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v23/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Contact with Skin\"}})"
                  },
                  {
                    "alias": "first_aid_procedure_mouth_contact_or_eaten_list",
                    "args": (v29/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v23/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Mouth Contact or Eaten\"}})"
                  },
                  {
                    "alias": "first_aid_procedure_fumes_breathed_in_list",
                    "args": (v30/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v23/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Fumes Breathed In\"}})"
                  },
                  {
                    "alias": "emergency_action_for_spills_small_list",
                    "args": (v32/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v23/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Emergency Action For Spills\"},\"type\":{\"_eq\":\"Small Spills\"}})"
                  },
                  {
                    "alias": "emergency_action_for_spills_large_list",
                    "args": (v33/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v23/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Emergency Action For Spills\"},\"type\":{\"_eq\":\"Large Spills\"}})"
                  },
                  {
                    "alias": "disposal_used_container_list",
                    "args": (v35/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v23/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Disposal\"},\"type\":{\"_eq\":\"Used Containers\"}})"
                  },
                  {
                    "alias": "disposal_unused_product_list",
                    "args": (v36/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v23/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Disposal\"},\"type\":{\"_eq\":\"Unused Product\"}})"
                  },
                  (v38/*: any*/),
                  (v39/*: any*/),
                  (v40/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdChemicalHazchemsheetQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "sheq_chemical_hazchem_sheetsConnection",
        "kind": "LinkedField",
        "name": "sheq_chemical_hazchem_sheets_connection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_chemical_hazchem_sheetsEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_chemical_hazchem_sheets",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  {
                    "alias": "active_ingredient_list",
                    "args": (v18/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": [
                      (v19/*: any*/),
                      (v20/*: any*/),
                      (v2/*: any*/)
                    ],
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Active Ingredient\"}})"
                  },
                  {
                    "alias": "hazard_identification_physical_list",
                    "args": (v22/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v41/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Hazard Identification\"},\"type\":{\"_eq\":\"Physical\"}})"
                  },
                  {
                    "alias": "hazard_identification_reproductive_list",
                    "args": (v24/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v41/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Hazard Identification\"},\"type\":{\"_eq\":\"Reproductive\"}})"
                  },
                  {
                    "alias": "hazard_identification_biological_list",
                    "args": (v25/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v41/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Hazard Identification\"},\"type\":{\"_eq\":\"Biological\"}})"
                  },
                  {
                    "alias": "first_aid_procedure_splashes_in_eyes_list",
                    "args": (v27/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v41/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Splashes In Eyes\"}})"
                  },
                  {
                    "alias": "first_aid_procedure_contact_with_skin_list",
                    "args": (v28/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v41/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Contact with Skin\"}})"
                  },
                  {
                    "alias": "first_aid_procedure_mouth_contact_or_eaten_list",
                    "args": (v29/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v41/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Mouth Contact or Eaten\"}})"
                  },
                  {
                    "alias": "first_aid_procedure_fumes_breathed_in_list",
                    "args": (v30/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v41/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Fumes Breathed In\"}})"
                  },
                  {
                    "alias": "emergency_action_for_spills_small_list",
                    "args": (v32/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v41/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Emergency Action For Spills\"},\"type\":{\"_eq\":\"Small Spills\"}})"
                  },
                  {
                    "alias": "emergency_action_for_spills_large_list",
                    "args": (v33/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v41/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Emergency Action For Spills\"},\"type\":{\"_eq\":\"Large Spills\"}})"
                  },
                  {
                    "alias": "disposal_used_container_list",
                    "args": (v35/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v41/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Disposal\"},\"type\":{\"_eq\":\"Used Containers\"}})"
                  },
                  {
                    "alias": "disposal_unused_product_list",
                    "args": (v36/*: any*/),
                    "concreteType": "sheq_chemical_hazchem_sheets_lists",
                    "kind": "LinkedField",
                    "name": "list",
                    "plural": true,
                    "selections": (v41/*: any*/),
                    "storageKey": "list(where:{\"group\":{\"_eq\":\"Disposal\"},\"type\":{\"_eq\":\"Unused Product\"}})"
                  },
                  (v38/*: any*/),
                  (v39/*: any*/),
                  (v40/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "26c461d11258ccc68a1938b2ea9c2b08",
    "id": null,
    "metadata": {},
    "name": "findByIdChemicalHazchemsheetQuery",
    "operationKind": "query",
    "text": "query findByIdChemicalHazchemsheetQuery(\n  $id: bigint\n) {\n  sheq_chemical_hazchem_sheets_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        created_at\n        name\n        physical_state\n        type\n        product {\n          id\n        }\n        sds {\n          id\n        }\n        contacts_emergency_name\n        contacts_emergency_num\n        contacts_manufacturer_name\n        contacts_manufacturer_num\n        doc\n        precaution_photo_concentrate_list: precaution_photo_list(where: {type: {_eq: \"Concentrate\"}}) {\n          id\n          doc\n          type\n        }\n        precaution_photo_application_list: precaution_photo_list(where: {type: {_eq: \"Application\"}}) {\n          id\n          doc\n          type\n        }\n        active_ingredient_list: list(where: {group: {_eq: \"Active Ingredient\"}}) {\n          value\n          group\n          id\n        }\n        hazard_identification_physical_list: list(where: {group: {_eq: \"Hazard Identification\"}, type: {_eq: \"Physical\"}}) {\n          value\n          group\n          type\n          id\n        }\n        hazard_identification_reproductive_list: list(where: {group: {_eq: \"Hazard Identification\"}, type: {_eq: \"Reproductive\"}}) {\n          value\n          group\n          type\n          id\n        }\n        hazard_identification_biological_list: list(where: {group: {_eq: \"Hazard Identification\"}, type: {_eq: \"Biological\"}}) {\n          value\n          group\n          type\n          id\n        }\n        first_aid_procedure_splashes_in_eyes_list: list(where: {group: {_eq: \"First Aid Procedure\"}, type: {_eq: \"Splashes In Eyes\"}}) {\n          value\n          group\n          type\n          id\n        }\n        first_aid_procedure_contact_with_skin_list: list(where: {group: {_eq: \"First Aid Procedure\"}, type: {_eq: \"Contact with Skin\"}}) {\n          value\n          group\n          type\n          id\n        }\n        first_aid_procedure_mouth_contact_or_eaten_list: list(where: {group: {_eq: \"First Aid Procedure\"}, type: {_eq: \"Mouth Contact or Eaten\"}}) {\n          value\n          group\n          type\n          id\n        }\n        first_aid_procedure_fumes_breathed_in_list: list(where: {group: {_eq: \"First Aid Procedure\"}, type: {_eq: \"Fumes Breathed In\"}}) {\n          value\n          group\n          type\n          id\n        }\n        emergency_action_for_spills_small_list: list(where: {group: {_eq: \"Emergency Action For Spills\"}, type: {_eq: \"Small Spills\"}}) {\n          value\n          group\n          type\n          id\n        }\n        emergency_action_for_spills_large_list: list(where: {group: {_eq: \"Emergency Action For Spills\"}, type: {_eq: \"Large Spills\"}}) {\n          value\n          group\n          type\n          id\n        }\n        disposal_used_container_list: list(where: {group: {_eq: \"Disposal\"}, type: {_eq: \"Used Containers\"}}) {\n          value\n          group\n          type\n          id\n        }\n        disposal_unused_product_list: list(where: {group: {_eq: \"Disposal\"}, type: {_eq: \"Unused Product\"}}) {\n          value\n          group\n          type\n          id\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n        site {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "848039a6799ffbc908811907cf3d15b0";

module.exports = node;
