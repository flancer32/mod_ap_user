/**
 *   One-time sign-in codes with limited lifetime.
 */
class Fl32_Ap_User_Back_Store_RDb_Schema_Signin {
    code;
    date_expired;
    user_ref;
}

// table name and columns names (entity and attributes) to use in queries to RDb
Fl32_Ap_User_Back_Store_RDb_Schema_Signin.A_CODE = 'code';
Fl32_Ap_User_Back_Store_RDb_Schema_Signin.A_DATE_EXPIRED = 'date_expired';
Fl32_Ap_User_Back_Store_RDb_Schema_Signin.A_USER_REF = 'user_ref';
Fl32_Ap_User_Back_Store_RDb_Schema_Signin.ENTITY = 'user_signin';

// freeze class to deny attributes changes
Object.freeze(Fl32_Ap_User_Back_Store_RDb_Schema_Signin);

// MODULE'S EXPORT
export default Fl32_Ap_User_Back_Store_RDb_Schema_Signin;
