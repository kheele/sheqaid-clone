
function getExternalLinkData() {
    const {href, domain} = window.location;
    const parts = href.replace(domain + '/', '').split('?');
    const path = parts[0];
    const paths = path.split('/');
    const ids = parts[1];

    let plugin = paths[0];
    let module = paths[1];
    const id = ids.replace('id=', '');

    const plugins = {
        cm: {
            key: 'plugin_claim_management',
            modules: {
                mcsp: '03_Claim_Management_For_ServiceProviders'
            }
        },
        e: {
            key: 'plugin_extra',
            modules: {
            }
        },
        g: {
            key: 'plugin_general',
            modules: {
            }
        },
        hm: {
            key: 'plugin_hr_management',
            modules: {
            }
        },
        sa: {
            key: 'plugin_sheq_assist',
            modules: {
            }
        }
    };
    const {key, modules = {}} = plugins[plugin];
    plugin = key;
    module = modules[module];

    return {id, plugin, module};
}

export {getExternalLinkData};
