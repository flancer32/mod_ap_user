/**
 * HTTP2 requests handler to extract user session data.
 *
 * @namespace Fl32_Ap_User_Plugin_Http2_Handler_Session
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Ap_User_Plugin_Http2_Handler_Session';

// MODULE'S CLASSES

// MODULE'S FUNCTIONS
/**
 * Factory to create HTTP2 requests handler to extract user session data.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @return {function}
 * @memberOf Fl32_Ap_User_Plugin_Http2_Handler_Session
 */
async function Factory(spec) {
    // EXTRACT DEPS
    /** @type {Fl32_Ap_User_Defaults} */
    const DEF = spec['Fl32_Ap_User_Defaults$']; // instance singleton
    /** @type {TeqFw_Core_Back_RDb_Connector} */
    const rdb = spec['TeqFw_Core_Back_RDb_Connector$']; // instance singleton
    /** @type {Fl32_Ap_User_Back_Model_Cache_Session} */
    const cache = spec['Fl32_Ap_User_Back_Model_Cache_Session$']; // instance singleton
    /** @type {Function|TeqFw_Http2_Back_Util.cookieClear} */
    const cookieClear = spec['TeqFw_Http2_Back_Util#cookieClear']; // function singleton
    /** @type {TeqFw_Http2_Back_Model_Realm_Registry} */
    const regRealms = spec['TeqFw_Http2_Back_Model_Realm_Registry$']; // instance singleton
    /** @type {typeof TeqFw_Http2_Back_Server_Stream_Report} */
    const Report = spec['TeqFw_Http2_Back_Server_Stream#Report'];   // class
    /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Session} */
    const ESession = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Session#'];   // class
    /** @type {Function|Fl32_Ap_User_Back_Process_User_Load.process} */
    const procLoad = spec['Fl32_Ap_User_Back_Process_User_Load$']; // function singleton

    // PARSE INPUT & DEFINE WORKING VARS

    // DEFINE INNER FUNCTIONS
    /**
     *
     * @param {TeqFw_Http2_Back_Server_Stream_Context} context
     * @returns {Promise<TeqFw_Http2_Back_Server_Stream_Report>}
     * @memberOf Fl32_Ap_User_Plugin_Http2_Handler_Session
     */
    async function handleHttp2Request(context) {
        // DEFINE INNER FUNCTIONS
        /**
         * Extract session ID from cookies or HTTP headers.
         * @param {Object<String, String>} headers
         * @returns {String|null}
         */
        function extractSessionId(headers) {
            let cookieId, bearerId;
            if (headers[H2.HTTP2_HEADER_COOKIE]) {
                const cookies = headers[H2.HTTP2_HEADER_COOKIE];
                const name = DEF.DATA_SESS_COOKIE_NAME;
                const value = cookies.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
                if (value.length) {
                    // there is session cookie in HTTP request
                    cookieId = value;
                }
            } else if (headers[H2.HTTP2_HEADER_AUTHORIZATION]) {
                const value = headers[H2.HTTP2_HEADER_AUTHORIZATION];
                bearerId = value.replace('Bearer ', '').trim();
            }
            // prefer to use ID from bearer then from cookie
            return bearerId || cookieId || null;
        }

        /**
         * Load user data using session ID and place it to the report's additional shared objects.
         * Compose "Clear cookie" HTTP header for wrong session ID.
         *
         * @param {String} sessId
         * @param {String} path current URL to extract realm to clean cookie
         * @param {TeqFw_Http2_Back_Server_Stream_Report} report
         * @returns {Promise<void>}
         */
        async function loadUserData(sessId, path, report) {
            // DEFINE INNER FUNCTIONS

            async function cleanUpSessions(trx, userId, sessId) {
                return await trx.from(ESession.ENTITY)
                    .where(ESession.A_USER_REF, '=', userId)
                    .where(ESession.A_SESSION_ID, '<>', sessId)
                    .del();
            }

            async function getSessionById(trx, sessId) {
                let result = null;
                const query = trx.from(ESession.ENTITY);
                query.select([ESession.A_DATE_CREATED, ESession.A_SESSION_ID, ESession.A_USER_REF]);
                query.where(ESession.A_SESSION_ID, sessId);
                const rows = await query;
                if (rows.length) {
                    result = rows[0];
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            const trx = await rdb.startTransaction();

            try {
                const sess = await getSessionById(trx, sessId);
                if (sess) {
                    const userId = sess[ESession.A_USER_REF];
                    const dateInit = sess[ESession.A_DATE_CREATED];
                    if (userId) {
                        /** @type {Fl32_Ap_User_Shared_Service_Data_User} */
                        const user = await procLoad({trx, userId});
                        user.dateLoggedIn = dateInit;
                        // get parent data
                        if (user.parentId !== user.id) {
                            const parent = await procLoad({trx, userId: user.parentId});
                            user.parentName = parent.name;
                        } else {
                            user.parentName = user.name;
                        }
                        // place user data into request shared context
                        report.sharedAdditional[DEF.HTTP_SHARED_CTX_USER] = user;
                        // report.sharedAdditional[DEF.HTTP_SHARED_CTX_SESSION_ID] = sessId;
                        cache.set(sessId, user);
                        // clean up other sessions for the user
                        await cleanUpSessions(trx, userId, sessId);
                    }
                } else {
                    // clear session id from cookies
                    const addr = regRealms.parseAddress(path);
                    const realm = addr.realm ?? '';
                    result.headers[H2.HTTP2_HEADER_SET_COOKIE] = cookieClear({name: DEF.DATA_SESS_COOKIE_NAME, realm});
                    // result.headers[H2.HTTP2_HEADER_STATUS] = H2.HTTP_STATUS_UNAUTHORIZED;
//                     result.output = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <title>Please, sign in.</title>
//     <meta http-equiv="refresh" content="0; URL=/"/>
// </head>
// </html>
// `;
//                     result.complete = true;
                    cache.delete(sessId);
                }
                await trx.commit();
            } catch (e) {
                await trx.rollback();
                throw e;
            }
        }

        // MAIN FUNCTIONALITY
        const result = new Report();
        /** @type {Object<String, String>} */
        const headers = context.headers;
        try {
            // process request, compose response and write it to the 'stream'
            const sessId = extractSessionId(headers);
            if (sessId) {
                const userCached = cache.get(sessId);
                if (userCached) {
                    result.sharedAdditional[DEF.HTTP_SHARED_CTX_USER] = userCached;
                    // result.sharedAdditional[DEF.HTTP_SHARED_CTX_SESSION_ID] = sessId;
                } else {
                    await loadUserData(sessId, headers[H2.HTTP2_HEADER_PATH], result);
                }
            }
        } catch (e) {
            const addr = regRealms.parseAddress(headers[H2.HTTP2_HEADER_PATH]);
            const realm = addr.realm ?? '';
            result.headers[H2.HTTP2_HEADER_STATUS] = H2.HTTP_STATUS_UNAUTHORIZED;
            result.output = `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Please, sign in.</title>
    <meta http-equiv="refresh" content="2; URL=/${realm}"/>
</head>
<body>Error: ${e.message}</body>
</html>                  
`;
            result.complete = true;
        }
        return result;
    }

    // MAIN FUNCTIONALITY

    // COMPOSE RESULT
    Object.defineProperty(handleHttp2Request, 'name', {value: `${NS}.${handleHttp2Request.name}`});
    return handleHttp2Request;
}

// MODULE'S FUNCTIONALITY

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export default Factory;
