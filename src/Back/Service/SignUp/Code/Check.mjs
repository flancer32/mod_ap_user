/**
 * Check sign-up code and create new user. Initiate new user session if succeed.
 * Session ID is returned in response and as a cookie.
 *
 * @namespace Fl32_Ap_User_Back_Service_SignUp_Code_Check
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Service_SignUp_Code_Check';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Ap_User_Back_Service_SignUp_Code_Check {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Back_RDb_Connector} */
        const rdb = spec['TeqFw_Core_Back_RDb_Connector$'];
        /** @type {Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check.Factory} */
        const route = spec['Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check#Factory$'];
        /** @type {Function|Fl32_Ap_User_Back_Process_SignUp_Code_CleanUp.process} */
        const procCleanUpExpired = spec['Fl32_Ap_User_Back_Process_SignUp_Code_CleanUp$'];
        /** @type {Function|Fl32_Ap_User_Back_Process_SignUp_Code_Remove.process} */
        const procRemove = spec['Fl32_Ap_User_Back_Process_SignUp_Code_Remove$'];
        /** @type {Function|Fl32_Ap_User_Back_Process_User_Create.process} */
        const procUserCreate = spec['Fl32_Ap_User_Back_Process_User_Create$'];
        /** @type {Function|Fl32_Ap_User_Back_Process_Session_Create.process} */
        const procSessCreate = spec['Fl32_Ap_User_Back_Process_Session_Create$'];
        /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Signup} */
        const ESignUp = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Signup#'];

        // DEFINE INSTANCE METHODS

        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_Service_IContext} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS

                /**
                 * @param trx
                 * @param {String} code
                 * @returns {Promise<null|Number>}
                 */
                async function getParentIdByCode(trx, code) {
                    const query = trx.from(ESignUp.ENTITY);
                    query.select([ESignUp.A_USER_REF]);
                    query.where({[ESignUp.A_CODE]: code});
                    /** @type {Array} */
                    const rs = await query;
                    if (rs.length === 1) {
                        const [first] = rs;
                        return first[ESignUp.A_USER_REF];
                    } else {
                        return null;
                    }
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check.Request} */
                const req = context.getInData();
                /** @type {Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check.Response} */
                const res = context.getOutData();
                //
                const trx = await rdb.startTransaction();
                try {
                    const code = req.code;
                    const realm = req.door;
                    await procCleanUpExpired({trx});
                    const parentId = await getParentIdByCode(trx, code);
                    if (parentId !== null) {
                        await procRemove({trx, code});
                        const {userId} = await procUserCreate({trx, parentId});
                        const {sessionId, cookie} = await procSessCreate({trx, userId, realm});
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
