/**
 * Plugin level constants (hardcoded configuration).
 */
class Fl32_Ap_User_Defaults {
    BACK_REALM = 'user';  // realm for API services ('/api/user/...') and CLI commands ('user-...')

    // DI container labels for objects used by this plugin
    DI_SESSION = 'userSession';

    // DEF-objects of the dependencies.
    /** @type {TeqFw_Core_App_Defaults} */
    MOD_CORE;

    // SERVICES ROUTES
    SERV_GROUP_LIST = '/group/list'; // service at '/api/plugin/group/list' route

    constructor(spec) {
        this.MOD_CORE = spec['TeqFw_Core_App_Defaults$']; // instance singleton
        Object.freeze(this);
    }
}

// MODULE'S EXPORT
export default Fl32_Ap_User_Defaults;
