
class Cntr extends ACntr {
    constructor(Functions) {
        super(Functions, "plugin_sheq_assist/09_HIRA_And_Opportunities/task-base/", "plugin_sheq_assist_09_risk_assessment_task_base");
    }

    async createPDF(ctx, id) {
        return await this.whenLoggedIn(ctx).then(async loggedUser => {
            const {
                user, user: {data: {client: my_client, project: my_project, site: my_site}},
                company: {id: company_id},
                client_id, project_id, site_id
            } = loggedUser;

            const list = await this.list(ctx, {
                company_id,
                client_id: my_client && my_client.id || client_id,
                project_id: my_project && my_project.id || project_id,
                site_id: my_site && my_site.id || site_id
            });

            return await this.onCreatePDFImpl(path.join(__dirname + "/report-ra-taskbased.ejs"), {
                list
            }, "landscape");
        });
    }
}

exports.run = (Functions) => {
    new Cntr(Functions);
};