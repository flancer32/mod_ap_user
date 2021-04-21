/**
 * User data in Service API.
 */
class Fl32_Ap_User_Shared_Service_Data_User {
    /** @type {Date} */
    dateCreated
    /** @type {Date} */
    dateLoggedIn
    /**
     * Identity email or emails.
     * @type {String[]}
     */
    emails
    /**
     * Internal id. Can be omitted for new users (not saved yet).
     * @type {Number}
     */
    id
    /** @type {String} */
    name
    /**
     * Internal id for parent user. Can be omitted for new users (not saved yet).
     * @type {Number}
     */
    parentId
    /** Name of the parent user. Can be omitted for new users (not saved yet).
     * @type {String}
     */
    parentName;
    /**
     * Identity phone number or numbers.
     * @type {String|String[]}
     */
    phones
}

// attributes names to use in queries to RDb
Fl32_Ap_User_Shared_Service_Data_User.A_DATE_CREATED = 'dateCreated';
Fl32_Ap_User_Shared_Service_Data_User.A_DATE_LOGGED_IN = 'dateLoggedIn';
Fl32_Ap_User_Shared_Service_Data_User.A_EMAILS = 'emails';
Fl32_Ap_User_Shared_Service_Data_User.A_ID = 'id';
Fl32_Ap_User_Shared_Service_Data_User.A_NAME = 'name';
Fl32_Ap_User_Shared_Service_Data_User.A_PARENT_ID = 'parentId';
Fl32_Ap_User_Shared_Service_Data_User.A_PARENT_NAME = 'parentName';
Fl32_Ap_User_Shared_Service_Data_User.A_PHONES = 'phones';

// freeze class to deny attributes changes
Object.freeze(Fl32_Ap_User_Shared_Service_Data_User);

// MODULE'S EXPORT
export default Fl32_Ap_User_Shared_Service_Data_User;
