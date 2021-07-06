/**
 * Frontend gate to service to check sign-up code and to initiate new session.
 *
 * @namespace Fl32_Ap_User_Front_Gate_SignUp_Code_Check
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Front_Gate_SignUp_Code_Check';

/**
 * Factory to create frontend gate.
 * @return function(Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check.Request): boolean
 */
function Factory(spec) {
    // EXTRACT DEPS
    /** @type {Fl32_Ap_User_Back_Defaults} */
    const DEF = spec['Fl32_Ap_User_Back_Defaults$']; // instance singleton
    /** @type {TeqFw_Http2_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Http2_Front_Gate_Connect$']; // instance singleton
    /** @type {typeof Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check.Response} */
    const Response = spec['Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check#Response']; // class

    /**
     * @param {Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check.Request} data
     * @returns {Promise<Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check.Response|boolean>}
     * @memberOf Fl32_Ap_User_Front_Gate_SignUp_Code_Check
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_signUp_code_check);
        if (res) {
            result = Object.assign(new Response(), res);
        }
        return result;
    }

    // COMPOSE RESULT
    Object.defineProperty(gate, 'name', {value: `${NS}.${gate.name}`});
    return gate;
}

// MODULE'S FUNCTIONALITY
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});

// MODULE'S EXPORT
export default Factory;
