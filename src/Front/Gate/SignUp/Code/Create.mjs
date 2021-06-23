/**
 * Frontend gate to service to create sign-up code for users invitation.
 *
 * @namespace Fl32_Ap_User_Front_Gate_SignUp_Code_Create
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Front_Gate_SignUp_Code_Create';

/**
 * Factory to create frontend gate.
 * @return function(Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create.Request): boolean
 * @memberOf Fl32_Ap_User_Front_Gate_SignUp_Code_Create
 */
function Factory(spec) {
    // EXTRACT DEPS
    /** @type {Fl32_Ap_User_Defaults} */
    const DEF = spec['Fl32_Ap_User_Defaults$']; // instance singleton
    /** @type {TeqFw_Http2_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Http2_Front_Gate_Connect$']; // instance singleton
    /** @type {typeof Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create.Response} */
    const Response = spec['Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create#Response']; // class

    // DEFINE INNER FUNCTIONS
    /**
     * @param {Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create.Request} data
     * @returns {Promise<Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create.Response|boolean>}
     * @memberOf Fl32_Ap_User_Front_Gate_SignUp_Code_Create
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_signUp_code_create);
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
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});

// MODULE'S EXPORT
export default Factory;
