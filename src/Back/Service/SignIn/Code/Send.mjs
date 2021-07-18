/**
 * Send one-time sign-in code to user email.
 *
 * @namespace Fl32_Ap_User_Back_Service_SignIn_Code_Send
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Service_SignIn_Code_Send';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Ap_User_Back_Service_SignIn_Code_Send {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Back_RDb_Connector} */
        const rdb = spec['TeqFw_Core_Back_RDb_Connector$'];
        /** @type {Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send.Factory} */
        const route = spec['Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send#Factory$'];
        /** @type {Function|Fl32_Ap_User_Back_Process_SignIn_Code_CleanUp.process} */
        const procCleanUp = spec['Fl32_Ap_User_Back_Process_SignIn_Code_CleanUp$'];
        /** @type {Function|Fl32_Ap_User_Back_Process_SignIn_Code_Create.process} */
        const procCreate = spec['Fl32_Ap_User_Back_Process_SignIn_Code_Create$'];
        /** @type {Function|Fl32_Ap_User_Back_Process_SignIn_Code_Email.process} */
        const procEmail = spec['Fl32_Ap_User_Back_Process_SignIn_Code_Email$'];

        // DEFINE INSTANCE METHODS

        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_Service_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                // MAIN FUNCTIONALITY
                /** @type {Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send.Request} */
                const req = context.getInData();
                /** @type {Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send.Response} */
                const res = context.getOutData();
                // const shared = context.getHandlersShare();
                //
                const trx = await rdb.startTransaction();
                try {
                    const email = req.email;
                    const door = req.door;
                    await procCleanUp({trx});
                    const code = await procCreate({trx, email});
                    if (code !== null) res.isSent = await procEmail({to: email, realm: door, code});
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }
    }
}
