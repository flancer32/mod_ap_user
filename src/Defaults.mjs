/**
 * Plugin level constants (hardcoded configuration).
 */
class Fl32_Ap_User_Defaults {
    BACK_REALM = 'user';  // realm for API services ('/api/user/...') and CLI commands ('user-...')

    // DI container labels for objects used by this plugin
    DI_SESSION = 'userSession';

    HTTP_SHARED_CTX_USER = 'user.data';

    // DEF-objects of the dependencies.
    /** @type {TeqFw_Core_App_Defaults} */
    MOD_CORE;

    // TODO: move it to plugin config
    REALM_DEF_ROUTE__signIn_codeCheck = '/signIn/codeCheck/:code';

    // SERVICES ROUTES
    SERV_session_current = '/session/current';
    SERV_signIn_code_send = '/signIn/code/send';

    constructor(spec) {
        this.MOD_CORE = spec['TeqFw_Core_App_Defaults$']; // instance singleton
        Object.freeze(this);
    }
}

// MODULE'S EXPORT
export default Fl32_Ap_User_Defaults;
