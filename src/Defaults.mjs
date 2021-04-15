/**
 * Plugin level constants (hardcoded configuration).
 */
class Vendor_Plugin_Defaults {
    BACK_REALM = 'plugin';  // realm for API services ('/api/plugin/...') and CLI commands ('plugin-...')

    // DI container labels for objects used by this plugin
    DI_OBJ = 'pluginObject';

    // DEF-objects of the dependencies.
    /** @type {TeqFw_Core_App_Defaults} */
    MOD_CORE;

    // FRONTEND REALMS & ROUTES
    REALM_PUB = 'pub';
    REALM_PUB_ROUTE_HOME = '/';
    REALM_SIGN = 'sign';
    REALM_SIGN_ROUTE_HOME = '/';

    // SERVICES ROUTES
    SERV_GROUP_LIST = '/group/list'; // service at '/api/plugin/group/list' route

    constructor(spec) {
        this.MOD_CORE = spec['TeqFw_Core_App_Defaults$']; // instance singleton
        Object.freeze(this);
    }
}

// MODULE'S EXPORT
export default Vendor_Plugin_Defaults;
