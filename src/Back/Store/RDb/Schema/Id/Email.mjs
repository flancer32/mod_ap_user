/**
 *  Email based identifiers.
 */
class Fl32_Ap_User_Back_Store_RDb_Schema_Id_Email {
    email;
    user_ref;
}

Fl32_Ap_User_Back_Store_RDb_Schema_Id_Email.A_EMAIL = 'email';
Fl32_Ap_User_Back_Store_RDb_Schema_Id_Email.A_USER_REF = 'user_ref';
Fl32_Ap_User_Back_Store_RDb_Schema_Id_Email.ENTITY = 'user_id_email';


// freeze class to deny attributes changes
Object.freeze(Fl32_Ap_User_Back_Store_RDb_Schema_Id_Email);

// MODULE'S EXPORT
export default Fl32_Ap_User_Back_Store_RDb_Schema_Id_Email;
