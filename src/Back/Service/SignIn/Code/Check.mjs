/**
 * Check one-time sign-in code and initiate new session.
 * Session ID is returned in response and as a cookie.
 *
 * @namespace Fl32_Ap_User_Back_Service_SignIn_Code_Check
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Service_SignIn_Code_Check';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Ap_User_Back_Service_SignIn_Code_Check {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Db_Back_RDb_Connect} */
        const rdb = spec['TeqFw_Db_Back_RDb_Connect$'];
        /** @type {Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Check.Factory} */
        const route = spec['Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Check#Factory$'];
        /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Signin} */
        const ESignIn = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Signin#'];
        /** @type {Function|Fl32_Ap_User_Back_Process_SignIn_Code_CleanUp.process} */
        const procCleanUp = spec['Fl32_Ap_User_Back_Process_SignIn_Code_CleanUp$'];
        /** @type {Function|Fl32_Ap_User_Back_Process_Session_Create.process} */
        const procCreate = spec['Fl32_Ap_User_Back_Process_Session_Create$'];
        /** @type {Function|Fl32_Ap_User_Back_Process_SignIn_Code_Remove.process} */
        const procRemove = spec['Fl32_Ap_User_Back_Process_SignIn_Code_Remove$'];

        // DEFINE INSTANCE METHODS

        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_Service_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS
                /**
                 * @param trx
                 * @param {String} code
                 * @returns {Promise<null|Number>}
                 */
                async function getUserIdByCode(trx, code) {
                    const query = trx.from(ESignIn.ENTITY);
                    query.select([ESignIn.A_USER_REF]);
                    query.where({[ESignIn.A_CODE]: code});
                    /** @type {Array} */
                    const rs = await query;
                    if (rs.length === 1) {
                        const [first] = rs;
                        return first[ESignIn.A_USER_REF];
                    } else {
                        return null;
                    }
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Check.Request} */
                const req = context.getInData();
                /** @type {Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Check.Response} */
                const res = context.getOutData();
                // const shared = context.getHandlersShare();
                //
                const trx = await rdb.startTransaction();
                try {
                    const code = req.code;
                    const realm = req.door;
                    await procCleanUp({trx}); // clean up expired codes before checking
                    const userId = await getUserIdByCode(trx, code);
                    if (userId !== null) {
                        await procRemove({trx, code});
                        const {sessionId, cookie} = await procCreate({trx, userId, realm});
                        context.setOutHeader(H2.HTTP2_HEADER_SET_COOKIE, cookie);
                        res.sessionId = sessionId;
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
