/**
 * Frontend gate to service to send one-time sign-in code to user email.
 *
 * @namespace Fl32_Ap_User_Front_Gate_SignIn_Code_Send
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Front_Gate_SignIn_Code_Send';

/**
 * Factory to create frontend gate.
 * @return function(Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send.Request): boolean
 */
function Factory(spec) {
    // EXTRACT DEPS
    /** @type {Fl32_Ap_User_Back_Defaults} */
    const DEF = spec['Fl32_Ap_User_Back_Defaults$']; // instance singleton
    /** @type {TeqFw_Http2_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Http2_Front_Gate_Connect$']; // instance singleton
    /** @type {typeof Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send.Response} */
    const Response = spec['Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send#Response']; // class

    /**
     * @param {Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send.Request} data
     * @returns {Promise<Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send.Response|boolean>}
     * @memberOf Fl32_Ap_User_Front_Gate_SignIn_Code_Send
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_signIn_code_send);
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
