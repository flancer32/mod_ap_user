/**
 * Create new user session.
 *
 * @namespace Fl32_Ap_User_Back_Process_Session_Create
 */
// MODULE'S IMPORT
import $crypto from 'crypto';

// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Process_Session_Create';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @constructs Fl32_Ap_User_Back_Process_Session_Create.process
 * @memberOf Fl32_Ap_User_Back_Process_Session_Create
 */
function Factory(spec) {
    // EXTRACT DEPS
    /** @type {Fl32_Ap_User_Defaults} */
    const DEF = spec['Fl32_Ap_User_Defaults$']; // instance singleton
    /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Session} */
    const ESession = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Session#']; // class

    /**
     * Create new user session.
     *
     * @param trx
     * @param {String} userId
     * @returns {Promise<{output: {sessId: string}, error: {}}>}
     * @memberOf Fl32_Ap_User_Back_Process_Session_Create
     */
    async function process({trx, userId}) {
        // DEFINE INNER FUNCTIONS
        async function getSessionById(trx, sessId) {
            const query = trx.from(ESession.ENTITY);
            query.select([ESession.A_USER_REF]);
            query.where(ESession.A_SESSION_ID, sessId);
            const rs = await query;
            return rs[0] !== undefined;
        }

        async function createSession(trx, userId, sessId) {
            await trx(ESession.ENTITY).insert({
                [ESession.A_USER_REF]: userId,
                [ESession.A_SESSION_ID]: sessId,
            });
        }

        // MAIN FUNCTIONALITY
        // register user
        let sessionId = $crypto.randomBytes(DEF.DATA_SESS_ID_BYTES).toString('hex');
        let found = true;
        do {
            found = await getSessionById(trx, sessionId);
        } while (found);
        await createSession(trx, userId, sessionId);

        // COMPOSE RESULT
        return {output: {sessId: sessionId}, error: {}};
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
