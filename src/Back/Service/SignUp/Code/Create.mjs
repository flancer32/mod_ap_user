/**
 * Create sign-up code to add new user.
 *
 * @namespace Fl32_Ap_User_Back_Service_SignUp_Code_Create
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Service_SignUp_Code_Create';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Ap_User_Back_Service_SignUp_Code_Create {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Ap_User_Back_Defaults} */
        const DEF = spec['Fl32_Ap_User_Back_Defaults$'];
        /** @type {TeqFw_Core_Back_RDb_Connector} */
        const rdb = spec['TeqFw_Core_Back_RDb_Connector$'];
        /** @type {Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create.Factory} */
        const route = spec['Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create#Factory$'];
        /** @type {Function|Fl32_Ap_User_Back_Process_SignUp_Code_Create.process} */
        const procCreate = spec['Fl32_Ap_User_Back_Process_SignUp_Code_Create$'];

        // DEFINE INSTANCE METHODS

        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_Service_IContext} context
             * @return Promise<void>
             */
            async function service(context) {
                // MAIN FUNCTIONALITY
                /** @type {Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create.Request} */
                const req = context.getInData();
                /** @type {Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create.Response} */
                const res = context.getOutData();
                const shared = context.getHandlersShare();
                //
                const trx = await rdb.startTransaction();
                try {
                    /** @type {Fl32_Ap_User_Shared_Service_Data_User} */
                    const user = shared[DEF.HTTP_SHARE_CTX_USER];
                    if (user) {
                        const userId = user.id;
                        const onetime = Boolean(req.onetime);
                        const dateExpired = req.dateExpired;
                        res.code = await procCreate({trx, userId, onetime, dateExpired});
                    } else {
                        context.setOutHeader(DEF.MOD_WEB.HTTP_HEADER_STATUS, H2.HTTP_STATUS_UNAUTHORIZED);
                    }
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
