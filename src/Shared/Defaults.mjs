/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class Fl32_Ap_User_Shared_Defaults {
    NAME = '@flancer32/mod_ap_user';

    // MOD = {
    //     /** @type {TeqFw_Web_Shared_Defaults} */
    //     WEB: null
    // }

    // SERVICES ROUTES
    SERV_session_current = '/session/current';
    SERV_signIn_code_check = '/signIn/code/check';
    SERV_signIn_code_send = '/signIn/code/send';
    SERV_signUp_code_check = '/signUp/code/check';
    SERV_signUp_code_create = '/signUp/code/create';

    constructor(spec) {
        // EXTRACT DEPS
        // /** @type {TeqFw_Web_Shared_Defaults} */
        // this.MOD.WEB = spec['TeqFw_Web_Shared_Defaults$'];

        // MAIN FUNCTIONALITY
        Object.freeze(this);
    }
}
