/**
 * Frontend gate to 'Session / Current' service.
 *
 * @namespace Fl32_Ap_User_Front_Gate_Session_Current
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Front_Gate_Session_Current';

/**
 * Factory to create frontend gate.
 * @return function(Fl32_Ap_User_Shared_Service_Route_Session_Current.Request): boolean
 */
function Factory(spec) {
    /** @type {Fl32_Ap_User_Defaults} */
    const DEF = spec['Fl32_Ap_User_Defaults$'];    // instance singleton
    /** @type {TeqFw_Http2_Front_Gate_Connect} */
    const backConnect = spec['TeqFw_Http2_Front_Gate_Connect$']; // instance singleton
    /** @type {typeof Fl32_Ap_User_Shared_Service_Route_Session_Current.Response} */
    const Response = spec['Fl32_Ap_User_Shared_Service_Route_Session_Current#Response']; // class constructor

    /**
     * @param {Fl32_Ap_User_Shared_Service_Route_Session_Current.Request} data
     * @returns {Promise<Fl32_Ap_User_Shared_Service_Route_Session_Current.Response|boolean>}
     * @memberOf Fl32_Ap_User_Front_Gate_Session_Current
     */
    async function gate(data) {
        let result = false;
        const res = await backConnect.send(data, DEF.BACK_REALM, DEF.SERV_session_current);
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
