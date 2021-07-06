/**
 * Plugin level constants (hardcoded configuration).
 */
export default class Fl32_Ap_User_Back_Defaults {
    BACK_REALM = 'user';  // realm for API services ('/api/user/...') and CLI commands ('user-...')

    DATA_SESS_COOKIE_LIFETIME = 31536000000;  // 3600 * 24 * 365 * 1000
    DATA_SESS_COOKIE_NAME = 'TEQ_SESSION_ID';
    DATA_SESS_ID_BYTES = 20;  // Number of bytes for generated session ID.
    DATA_SIGN_CODE_LENGTH = 16; // default length for sign-up & sign-in codes
    DATA_SIGN_CODE_LIFETIME_MIN = 5; // default lifetime in minutes for sign-up & sign-in codes

    // DI container labels for objects used by this plugin
    DI_SESSION = 'userSession';

    HTTP_SHARE_CTX_SESSION_ID = null;
    HTTP_SHARE_CTX_USER = null;

    // DEF-objects of the dependencies.
    /** @type {TeqFw_Core_Back_Defaults} */
    MOD_CORE;

    MOD = {
        /** @type {TeqFw_Web_Back_Defaults} */
        WEB: null, // bind in constructor
    };

    // TODO: move it to plugin config
    REALM_DEF_ROUTE_signIn_codeCheck = '/signIn/codeCheck/:code';

    /** @type {Fl32_Ap_User_Shared_Defaults} */
    SHARED = null;

    constructor(spec) {
        this.MOD_CORE = spec['TeqFw_Core_Back_Defaults$'];
        // init props after dependencies was injected
        this.MOD.WEB = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {Fl32_Ap_User_Shared_Defaults} */
        this.SHARED = spec['Fl32_Ap_User_Shared_Defaults$'];
        this.HTTP_SHARE_CTX_SESSION_ID = `${this.SHARED.NAME}/sessionId`;  // Attribute of the HTTP request to share session ID.
        this.HTTP_SHARE_CTX_USER = `${this.SHARED.NAME}/data`; // Attribute of the HTTP request to share authenticated user data.

        Object.freeze(this);
    }
}
