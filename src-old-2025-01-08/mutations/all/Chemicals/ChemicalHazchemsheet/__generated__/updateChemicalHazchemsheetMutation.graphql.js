/**
 * @generated SignedSource<<93ec97d49368a75c01dd309897e812fc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "kind": "Variable",
    "name": "_set",
    "variableName": "_set"
  },
  {
    "kind": "Variable",
    "name": "pk_columns",
    "variableName": "id"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "created_at",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "physical_state",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v8 = [
  (v3/*: any*/)
],
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_chemical_products",
  "kind": "LinkedField",
  "name": "product",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_chemical_sds",
  "kind": "LinkedField",
  "name": "sds",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "contacts_emergency_name",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "contacts_emergency_num",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "contacts_manufacturer_name",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "contacts_manufacturer_num",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "doc",
  "storageKey": null
},
v16 = [
  (v3/*: any*/),
  (v15/*: any*/),
  (v7/*: any*/)
],
v17 = {
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
  "selections": (v16/*: any*/),
  "storageKey": "precaution_photo_list(where:{\"type\":{\"_eq\":\"Concentrate\"}})"
},
v18 = {
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
  "selections": (v16/*: any*/),
  "storageKey": "precaution_photo_list(where:{\"type\":{\"_eq\":\"Application\"}})"
},
v19 = [
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
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "group",
  "storageKey": null
},
v22 = {
  "_eq": "Hazard Identification"
},
v23 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v22/*: any*/),
      "type": {
        "_eq": "Physical"
      }
    }
  }
],
v24 = [
  (v20/*: any*/),
  (v21/*: any*/),
  (v7/*: any*/)
],
v25 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v22/*: any*/),
      "type": {
        "_eq": "Reproductive"
      }
    }
  }
],
v26 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v22/*: any*/),
      "type": {
        "_eq": "Biological"
      }
    }
  }
],
v27 = {
  "_eq": "First Aid Procedure"
},
v28 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v27/*: any*/),
      "type": {
        "_eq": "Splashes In Eyes"
      }
    }
  }
],
v29 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v27/*: any*/),
      "type": {
        "_eq": "Contact with Skin"
      }
    }
  }
],
v30 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v27/*: any*/),
      "type": {
        "_eq": "Mouth Contact or Eaten"
      }
    }
  }
],
v31 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v27/*: any*/),
      "type": {
        "_eq": "Fumes Breathed In"
      }
    }
  }
],
v32 = {
  "_eq": "Emergency Action For Spills"
},
v33 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v32/*: any*/),
      "type": {
        "_eq": "Small Spills"
      }
    }
  }
],
v34 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v32/*: any*/),
      "type": {
        "_eq": "Large Spills"
      }
    }
  }
],
v35 = {
  "_eq": "Disposal"
},
v36 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v35/*: any*/),
      "type": {
        "_eq": "Used Containers"
      }
    }
  }
],
v37 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "group": (v35/*: any*/),
      "type": {
        "_eq": "Unused Product"
      }
    }
  }
],
v38 = [
  (v3/*: any*/),
  (v5/*: any*/)
],
v39 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v38/*: any*/),
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v38/*: any*/),
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "concreteType": "default_sites",
  "kind": "LinkedField",
  "name": "site",
  "plural": false,
  "selections": (v38/*: any*/),
  "storageKey": null
},
v42 = [
  (v20/*: any*/),
  (v21/*: any*/),
  (v7/*: any*/),
  (v3/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateChemicalHazchemsheetMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "sheq_chemical_hazchem_sheets",
        "kind": "LinkedField",
        "name": "update_sheq_chemical_hazchem_sheets_by_pk",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          {
            "alias": "active_ingredient_list",
            "args": (v19/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": [
              (v20/*: any*/),
              (v21/*: any*/)
            ],
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Active Ingredient\"}})"
          },
          {
            "alias": "hazard_identification_physical_list",
            "args": (v23/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v24/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Hazard Identification\"},\"type\":{\"_eq\":\"Physical\"}})"
          },
          {
            "alias": "hazard_identification_reproductive_list",
            "args": (v25/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v24/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Hazard Identification\"},\"type\":{\"_eq\":\"Reproductive\"}})"
          },
          {
            "alias": "hazard_identification_biological_list",
            "args": (v26/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v24/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Hazard Identification\"},\"type\":{\"_eq\":\"Biological\"}})"
          },
          {
            "alias": "first_aid_procedure_splashes_in_eyes_list",
            "args": (v28/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v24/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Splashes In Eyes\"}})"
          },
          {
            "alias": "first_aid_procedure_contact_with_skin_list",
            "args": (v29/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v24/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Contact with Skin\"}})"
          },
          {
            "alias": "first_aid_procedure_mouth_contact_or_eaten_list",
            "args": (v30/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v24/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Mouth Contact or Eaten\"}})"
          },
          {
            "alias": "first_aid_procedure_fumes_breathed_in_list",
            "args": (v31/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v24/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Fumes Breathed In\"}})"
          },
          {
            "alias": "emergency_action_for_spills_small_list",
            "args": (v33/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v24/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Emergency Action For Spills\"},\"type\":{\"_eq\":\"Small Spills\"}})"
          },
          {
            "alias": "emergency_action_for_spills_large_list",
            "args": (v34/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v24/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Emergency Action For Spills\"},\"type\":{\"_eq\":\"Large Spills\"}})"
          },
          {
            "alias": "disposal_used_container_list",
            "args": (v36/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v24/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Disposal\"},\"type\":{\"_eq\":\"Used Containers\"}})"
          },
          {
            "alias": "disposal_unused_product_list",
            "args": (v37/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v24/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Disposal\"},\"type\":{\"_eq\":\"Unused Product\"}})"
          },
          (v39/*: any*/),
          (v40/*: any*/),
          (v41/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateChemicalHazchemsheetMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "sheq_chemical_hazchem_sheets",
        "kind": "LinkedField",
        "name": "update_sheq_chemical_hazchem_sheets_by_pk",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          {
            "alias": "active_ingredient_list",
            "args": (v19/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": [
              (v20/*: any*/),
              (v21/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Active Ingredient\"}})"
          },
          {
            "alias": "hazard_identification_physical_list",
            "args": (v23/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v42/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Hazard Identification\"},\"type\":{\"_eq\":\"Physical\"}})"
          },
          {
            "alias": "hazard_identification_reproductive_list",
            "args": (v25/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v42/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Hazard Identification\"},\"type\":{\"_eq\":\"Reproductive\"}})"
          },
          {
            "alias": "hazard_identification_biological_list",
            "args": (v26/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v42/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Hazard Identification\"},\"type\":{\"_eq\":\"Biological\"}})"
          },
          {
            "alias": "first_aid_procedure_splashes_in_eyes_list",
            "args": (v28/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v42/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Splashes In Eyes\"}})"
          },
          {
            "alias": "first_aid_procedure_contact_with_skin_list",
            "args": (v29/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v42/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Contact with Skin\"}})"
          },
          {
            "alias": "first_aid_procedure_mouth_contact_or_eaten_list",
            "args": (v30/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v42/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Mouth Contact or Eaten\"}})"
          },
          {
            "alias": "first_aid_procedure_fumes_breathed_in_list",
            "args": (v31/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v42/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"First Aid Procedure\"},\"type\":{\"_eq\":\"Fumes Breathed In\"}})"
          },
          {
            "alias": "emergency_action_for_spills_small_list",
            "args": (v33/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v42/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Emergency Action For Spills\"},\"type\":{\"_eq\":\"Small Spills\"}})"
          },
          {
            "alias": "emergency_action_for_spills_large_list",
            "args": (v34/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v42/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Emergency Action For Spills\"},\"type\":{\"_eq\":\"Large Spills\"}})"
          },
          {
            "alias": "disposal_used_container_list",
            "args": (v36/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v42/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Disposal\"},\"type\":{\"_eq\":\"Used Containers\"}})"
          },
          {
            "alias": "disposal_unused_product_list",
            "args": (v37/*: any*/),
            "concreteType": "sheq_chemical_hazchem_sheets_lists",
            "kind": "LinkedField",
            "name": "list",
            "plural": true,
            "selections": (v42/*: any*/),
            "storageKey": "list(where:{\"group\":{\"_eq\":\"Disposal\"},\"type\":{\"_eq\":\"Unused Product\"}})"
          },
          (v39/*: any*/),
          (v40/*: any*/),
          (v41/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "3c44e6987cf578716c63387ee77c9693",
    "id": null,
    "metadata": {},
    "name": "updateChemicalHazchemsheetMutation",
    "operationKind": "mutation",
    "text": "mutation updateChemicalHazchemsheetMutation(\n  $id: sheq_chemical_hazchem_sheets_pk_columns_input!\n  $_set: sheq_chemical_hazchem_sheets_set_input!\n) {\n  update_sheq_chemical_hazchem_sheets_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    created_at\n    name\n    physical_state\n    type\n    product {\n      id\n    }\n    sds {\n      id\n    }\n    contacts_emergency_name\n    contacts_emergency_num\n    contacts_manufacturer_name\n    contacts_manufacturer_num\n    doc\n    precaution_photo_concentrate_list: precaution_photo_list(where: {type: {_eq: \"Concentrate\"}}) {\n      id\n      doc\n      type\n    }\n    precaution_photo_application_list: precaution_photo_list(where: {type: {_eq: \"Application\"}}) {\n      id\n      doc\n      type\n    }\n    active_ingredient_list: list(where: {group: {_eq: \"Active Ingredient\"}}) {\n      value\n      group\n      id\n    }\n    hazard_identification_physical_list: list(where: {group: {_eq: \"Hazard Identification\"}, type: {_eq: \"Physical\"}}) {\n      value\n      group\n      type\n      id\n    }\n    hazard_identification_reproductive_list: list(where: {group: {_eq: \"Hazard Identification\"}, type: {_eq: \"Reproductive\"}}) {\n      value\n      group\n      type\n      id\n    }\n    hazard_identification_biological_list: list(where: {group: {_eq: \"Hazard Identification\"}, type: {_eq: \"Biological\"}}) {\n      value\n      group\n      type\n      id\n    }\n    first_aid_procedure_splashes_in_eyes_list: list(where: {group: {_eq: \"First Aid Procedure\"}, type: {_eq: \"Splashes In Eyes\"}}) {\n      value\n      group\n      type\n      id\n    }\n    first_aid_procedure_contact_with_skin_list: list(where: {group: {_eq: \"First Aid Procedure\"}, type: {_eq: \"Contact with Skin\"}}) {\n      value\n      group\n      type\n      id\n    }\n    first_aid_procedure_mouth_contact_or_eaten_list: list(where: {group: {_eq: \"First Aid Procedure\"}, type: {_eq: \"Mouth Contact or Eaten\"}}) {\n      value\n      group\n      type\n      id\n    }\n    first_aid_procedure_fumes_breathed_in_list: list(where: {group: {_eq: \"First Aid Procedure\"}, type: {_eq: \"Fumes Breathed In\"}}) {\n      value\n      group\n      type\n      id\n    }\n    emergency_action_for_spills_small_list: list(where: {group: {_eq: \"Emergency Action For Spills\"}, type: {_eq: \"Small Spills\"}}) {\n      value\n      group\n      type\n      id\n    }\n    emergency_action_for_spills_large_list: list(where: {group: {_eq: \"Emergency Action For Spills\"}, type: {_eq: \"Large Spills\"}}) {\n      value\n      group\n      type\n      id\n    }\n    disposal_used_container_list: list(where: {group: {_eq: \"Disposal\"}, type: {_eq: \"Used Containers\"}}) {\n      value\n      group\n      type\n      id\n    }\n    disposal_unused_product_list: list(where: {group: {_eq: \"Disposal\"}, type: {_eq: \"Unused Product\"}}) {\n      value\n      group\n      type\n      id\n    }\n    client {\n      id\n      name\n    }\n    project {\n      id\n      name\n    }\n    site {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "f49294a387f467c05e024f7f4de227af";

module.exports = node;
