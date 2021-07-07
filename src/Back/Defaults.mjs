/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Fl32_Ap_User_Back_Defaults {

    DATA_SESS_COOKIE_LIFETIME = 31536000000;  // 3600 * 24 * 365 * 1000
    DATA_SESS_COOKIE_NAME = 'TEQ_SESSION_ID';
    DATA_SESS_ID_BYTES = 20;  // Number of bytes for generated session ID.
    DATA_SIGN_CODE_LENGTH = 16; // default length for sign-up & sign-in codes
    DATA_SIGN_CODE_LIFETIME_MIN = 5; // default lifetime in minutes for sign-up & sign-in codes

    HTTP_SHARE_CTX_SESSION_ID = null;
    HTTP_SHARE_CTX_USER = null;

    // DEF-objects of the dependencies.
    /** @type {TeqFw_Core_Back_Defaults} */
    MOD_CORE;
    /** @type {TeqFw_Web_Back_Defaults} */
    MOD_WEB;

    // TODO: move it to plugin config
    DOOR_DEF_ROUTE_SIGNIN_CODE_CHECK = '/signIn/codeCheck/:code';

    /** @type {Fl32_Ap_User_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        this.MOD_CORE = spec['TeqFw_Core_Back_Defaults$'];
        this.MOD_WEB = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {Fl32_Ap_User_Shared_Defaults} */
        this.SHARED = spec['Fl32_Ap_User_Shared_Defaults$'];
        this.HTTP_SHARE_CTX_SESSION_ID = `${this.SHARED.NAME}/sessionId`;  // Attribute of the HTTP request to share session ID.
        this.HTTP_SHARE_CTX_USER = `${this.SHARED.NAME}/data`; // Attribute of the HTTP request to share authenticated user data.

        Object.freeze(this);
    }
}
