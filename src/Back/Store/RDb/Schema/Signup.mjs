/**
 *  Sign-up codes with limited lifetime.
 */
class Fl32_Ap_User_Back_Store_RDb_Schema_Signup {
    /** @type {String} */
    code;
    /** @type {Date} */
    date_expired;
    /** @type {Boolean} */
    onetime;
    /** @type {Number} */
    user_ref;
}

// table name and columns names (entity and attributes) to use in queries to RDb
Fl32_Ap_User_Back_Store_RDb_Schema_Signup.A_CODE = 'code';
Fl32_Ap_User_Back_Store_RDb_Schema_Signup.A_DATE_EXPIRED = 'date_expired';
Fl32_Ap_User_Back_Store_RDb_Schema_Signup.A_ONETIME = 'onetime';
Fl32_Ap_User_Back_Store_RDb_Schema_Signup.A_USER_REF = 'user_ref';
Fl32_Ap_User_Back_Store_RDb_Schema_Signup.ENTITY = 'user_signup';

// freeze class to deny attributes changes
Object.freeze(Fl32_Ap_User_Back_Store_RDb_Schema_Signup);

// MODULE'S EXPORT
export default Fl32_Ap_User_Back_Store_RDb_Schema_Signup;
