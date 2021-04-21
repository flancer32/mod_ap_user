/**
 * Plugin level constants (hardcoded configuration).
 */
class Fl32_Ap_User_Defaults {
    BACK_REALM = 'user';  // realm for API services ('/api/user/...') and CLI commands ('user-...')

    DATA_SESS_COOKIE_LIFETIME = 31536000000;  // 3600 * 24 * 365 * 1000
    DATA_SESS_COOKIE_NAME = 'TEQ_SESSION_ID';
    DATA_SESS_ID_BYTES = 20;  // Number of bytes for generated session ID.

    // DI container labels for objects used by this plugin
    DI_SESSION = 'userSession';

    // HTTP_SHARED_CTX_SESSION_ID = 'user.sessionId';
    HTTP_SHARED_CTX_USER = 'user.data';

    // DEF-objects of the dependencies.
    /** @type {TeqFw_Core_App_Defaults} */
    MOD_CORE;

    // TODO: move it to plugin config
    REALM_DEF_ROUTE__signIn_codeCheck = '/signIn/codeCheck/:code';

    // SERVICES ROUTES
    SERV_session_current = '/session/current';
    SERV_signIn_code_check = '/signIn/code/check';
    SERV_signIn_code_send = '/signIn/code/send';

    constructor(spec) {
        this.MOD_CORE = spec['TeqFw_Core_App_Defaults$']; // instance singleton
        Object.freeze(this);
    }
}

// MODULE'S EXPORT
export default Fl32_Ap_User_Defaults;
