/**
 * User DTO in Service API.
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Shared_Service_Data_User';

// MODULE'S CLASSES
class Fl32_Ap_User_Shared_Service_Data_User {
    /** @type {Date} */
    dateCreated
    /** @type {Date} */
    dateLoggedIn
    /**
     * Identity email or emails.
     * @type {string[]}
     */
    emails
    /**
     * Internal id. Can be omitted for new users (not saved yet).
     * @type {number}
     */
    id
    /** @type {boolean} */
    isAdmin
    /** @type {string} */
    name
    /**
     * Internal id for parent user. Can be omitted for new users (not saved yet).
     * @type {number}
     */
    parentId
    /** Name of the parent user. Can be omitted for new users (not saved yet).
     * @type {string}
     */
    parentName;
    /**
     * Identity phone number or numbers.
     * @type {string|string[]}
     */
    phones
}

// attributes names to use as aliases in queries to RDb
Fl32_Ap_User_Shared_Service_Data_User.DATE_CREATED = 'dateCreated';
Fl32_Ap_User_Shared_Service_Data_User.DATE_LOGGED_IN = 'dateLoggedIn';
Fl32_Ap_User_Shared_Service_Data_User.EMAILS = 'emails';
Fl32_Ap_User_Shared_Service_Data_User.ID = 'id';
Fl32_Ap_User_Shared_Service_Data_User.IS_ADMIN = 'isAdmin';
Fl32_Ap_User_Shared_Service_Data_User.NAME = 'name';
Fl32_Ap_User_Shared_Service_Data_User.PARENT_ID = 'parentId';
Fl32_Ap_User_Shared_Service_Data_User.PARENT_NAME = 'parentName';
Fl32_Ap_User_Shared_Service_Data_User.PHONES = 'phones';

/**
 * Factory to create new DTO instances.
 * @memberOf Fl32_Ap_User_Shared_Service_Data_User
 */
class Factory {
    constructor() {
        /**
         * @param {Fl32_Ap_User_Shared_Service_Data_User|null} data
         * @return {Fl32_Ap_User_Shared_Service_Data_User}
         */
        this.create = function (data = null) {
            const res = new Fl32_Ap_User_Shared_Service_Data_User();
            res.dateCreated = data?.dateCreated
                ? (data.dateCreated instanceof Date) ? data.dateCreated : new Date(data?.dateCreated)
                : null;
            res.dateLoggedIn = data?.dateLoggedIn
                ? (data.dateLoggedIn instanceof Date) ? data.dateLoggedIn : new Date(data?.dateLoggedIn)
                : null;
            res.emails = Array.isArray(data?.emails) ? data.emails : [];
            res.id = data?.id;
            res.isAdmin = data?.isAdmin ?? false;
            res.name = data?.name;
            res.parentId = data?.parentId;
            res.parentName = data?.parentName;
            res.phones = Array.isArray(data?.phones) ? data.phones : [];
            return res;
        }
    }
}

// freeze class to deny attributes changes then export class
Object.freeze(Fl32_Ap_User_Shared_Service_Data_User);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export {
    Fl32_Ap_User_Shared_Service_Data_User as default,
    Factory
} ;
