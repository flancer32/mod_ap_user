/**
 *  Users sessions registry.
 */
class Fl32_Ap_User_Back_Store_RDb_Schema_Session {
    date_created;
    session_id;
    user_ref;
}

// table name and columns names (entity and attributes) to use in queries to RDb
Fl32_Ap_User_Back_Store_RDb_Schema_Session.A_DATE_CREATED = 'date_created';
Fl32_Ap_User_Back_Store_RDb_Schema_Session.A_SESSION_ID = 'session_id';
Fl32_Ap_User_Back_Store_RDb_Schema_Session.A_USER_REF = 'user_ref';
Fl32_Ap_User_Back_Store_RDb_Schema_Session.ENTITY = 'user_session';

// freeze class to deny attributes changes
Object.freeze(Fl32_Ap_User_Back_Store_RDb_Schema_Session);

// MODULE'S EXPORT
export default Fl32_Ap_User_Back_Store_RDb_Schema_Session;
