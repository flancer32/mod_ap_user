/**
 * Cache for user data with sessionId as a keys.
 * This class is wrapper for the Map with JSDoc hints.
 * We can use simple Map instance as named singleton in this case (w/o JSDoc hints, of cause).
 *
 * @namespace Fl32_Ap_User_Back_Model_Cache_Session
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Model_Cache_Session';

class Fl32_Ap_User_Back_Model_Cache_Session extends Map {
    /**
     * @param {String} sessId
     * @returns {Fl32_Ap_User_Shared_Service_Data_User|null}
     */
    get(sessId) {
        return super.get(sessId) ?? null;
    };

    /**
     * @param {String} sessId
     * @param {Fl32_Ap_User_Shared_Service_Data_User} user
     */
    set(sessId, user) {
        super.set(sessId, user);
    };
}

function Factory(spec) {
    return new Fl32_Ap_User_Back_Model_Cache_Session();
}

export {
    Factory as default
}
