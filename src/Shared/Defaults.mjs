/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class Fl32_Ap_User_Shared_Defaults {

    NAME = '@flancer32/mod_ap_user';

    DOOR_DEF_ROUTE_SIGNIN_CODE_CHECK = '/signIn/codeCheck/:code';

    // WEB SERVICES ROUTES
    WEB_SESSION_CURRENT = '/session/current';
    WEB_SIGNIN_CODE_CHECK = '/signIn/code/check';
    WEB_SIGNIN_CODE_SEND = '/signIn/code/send';
    WEB_SIGNUP_CODE_CHECK = '/signUp/code/check';
    WEB_SIGNUP_CODE_CREATE = '/signUp/code/create';

    constructor() {
        Object.freeze(this);
    }
}
