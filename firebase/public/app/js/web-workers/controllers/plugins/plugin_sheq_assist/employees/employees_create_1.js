
async function transferAllEmployees(evt) {
    [
        {tbl: 'plugin_sheq_assist_employees', keywords: ({lname, fname}) => [lname, fname]},
        {tbl: 'default_users', keywords: ({lname, fname}) => [lname, fname]},
        {tbl: 'plugin_sheq_assist_job_positions', keywords: ({name}) => [name]},
        {tbl: 'plugin_sheq_assist_departments', keywords: ({name}) => [name]},
        {tbl: 'plugin_sheq_assist_clients', keywords: ({name}) => [name]},
        {tbl: 'plugin_sheq_assist_projects', keywords: ({name}) => [name]},
        {tbl: 'plugin_sheq_assist_sites', keywords: ({name}) => [name]}
    ].forEach(async ({tbl, keywords: fn}) => {
        var q = this.getDB().collection(tbl);
        const querySnapshot = await q.get();
        querySnapshot.forEach(async (doc) => {
            const keywords = this.generateKeywords(fn(doc.data()));
            const updated = await doc.ref.update({keywords});//Promise < void >
            console.log('transferred', tbl, doc.id)
        });
    });
}