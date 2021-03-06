/**
 * Web request handler to validate sessions and load users profiles.
 *
 * @namespace Fl32_Ap_User_Plugin_Web_Handler_Session
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Ap_User_Plugin_Web_Handler_Session';

// MODULE'S CLASSES
/**
 * Factory to setup execution context and to create handler.
 *
 * @implements TeqFw_Web_Back_Api_Request_IHandler.Factory
 * @memberOf Fl32_Ap_User_Plugin_Web_Handler_Session
 */
export default class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Ap_User_Back_Defaults} */
        const DEF = spec['Fl32_Ap_User_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Db_Back_RDb_Connect} */
        const rdb = spec['TeqFw_Db_Back_RDb_Connect$'];
        /** @type {Fl32_Ap_User_Back_Model_Cache_Session} */
        const cache = spec['Fl32_Ap_User_Back_Model_Cache_Session$'];
        /** @type {Function|TeqFw_Web_Back_Util.cookieClear} */
        const cookieClear = spec['TeqFw_Web_Back_Util#cookieClear'];
        /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Session} */
        const ESession = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Session#'];
        /** @type {Function|Fl32_Ap_User_Back_Process_User_Load.process} */
        const procLoad = spec['Fl32_Ap_User_Back_Process_User_Load$'];
        /** @type {TeqFw_Web_Back_Model_Address} */
        const mAddr = spec['TeqFw_Web_Back_Model_Address$'];

        // DEFINE INSTANCE METHODS

        this.create = async function () {
            // DEFINE INNER FUNCTIONS
            /**
             * Action to process web request.
             *
             * @param {TeqFw_Web_Back_Api_Request_IContext} context
             * @returns {Promise<void>}
             * @memberOf Fl32_Ap_User_Plugin_Web_Handler_Session
             */
            async function handle(context) {

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
                 * @param {TeqFw_Web_Back_Api_Request_IContext} context
                 * @returns {Promise<void>}
                 */
                async function loadUserData(sessId, context) {
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
                                const shared = context.getHandlersShare();
                                shared[DEF.HTTP_SHARE_CTX_USER] = user;
                                shared[DEF.HTTP_SHARE_CTX_SESSION_ID] = sessId;
                                cache.set(sessId, user);
                                // clean up other sessions for the user
                                await cleanUpSessions(trx, userId, sessId);
                            }
                        } else {
                            // do nothing

//                             // clear session id from cookies
//                             const path = context.getPath();
//                             const addr = mAddr.parsePath(path);
//                             const door = addr.door ?? '';
//                             const name = DEF.DATA_SESS_COOKIE_NAME;
//                             const cookie = cookieClear({name, door});
//                             context.setResponseHeader(H2.HTTP2_HEADER_SET_COOKIE, cookie);
//                             context.setResponseHeader(DEF.MOD_WEB.HTTP_HEADER_STATUS, H2.HTTP_STATUS_UNAUTHORIZED.toString());
//                             const body = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <title>Please, clean up session cookie and sign in.</title>
//     <meta http-equiv="refresh" content="3; URL=/${door}"/>
// </head>
// </html>
// `;
//                             context.setResponseBody(body);
//                             context.setResponseHeader(H2.HTTP2_HEADER_CONTENT_TYPE, 'text/html');
//                             context.markRequestProcessed();
//                             cache.delete(sessId);
                        }
                        await trx.commit();
                    } catch (e) {
                        await trx.rollback();
                        throw e;
                    }
                }

                // MAIN FUNCTIONALITY
                /** @type {TeqFw_Web_Back_Api_Request_IContext} */
                const ctx = context; // IDEA is failed with context help (suggestions on Ctrl+Space)
                if (!ctx.isRequestProcessed()) {
                    /** @type {Object<String, String>} */
                    const headers = ctx.getRequestHeaders();
                    try {
                        // process request, compose response and write it to the 'stream'
                        const sessId = extractSessionId(headers);
                        if (sessId) {
                            const shared = ctx.getHandlersShare();
                            const userCached = cache.get(sessId);
                            if (userCached) {
                                shared[DEF.HTTP_SHARE_CTX_USER] = userCached;
                                shared[DEF.HTTP_SHARE_CTX_SESSION_ID] = sessId;
                            } else {
                                await loadUserData(sessId, context);
                            }
                        }
                    } catch (e) {
                        // clear session id from cookies
                        const path = context.getPath();
                        const addr = mAddr.parsePath(path);
                        const door = addr.door ?? '';
                        const name = DEF.DATA_SESS_COOKIE_NAME;
                        const cookie = cookieClear({name, door});
                        context.setResponseHeader(H2.HTTP2_HEADER_SET_COOKIE, cookie);
                        context.setResponseHeader(DEF.MOD_WEB.HTTP_HEADER_STATUS, H2.HTTP_STATUS_UNAUTHORIZED.toString());
                        const body = `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Please, clean up session cookie and sign in.</title>
    <meta http-equiv="refresh" content="3; URL=/${door}"/>
</head>
</html>
`;
                        context.setResponseBody(body);
                        context.setResponseHeader(H2.HTTP2_HEADER_CONTENT_TYPE, 'text/html');
                        context.markRequestProcessed();
                    }
                }
            }

            // MAIN FUNCTIONALITY
            logger.info(`Handler '${NS}' is initialized.`);

            // COMPOSE RESULT
            Object.defineProperty(handle, 'name', {value: `${NS}.${handle.name}`});
            return handle;
        }
    }
}
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});


