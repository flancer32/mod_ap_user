/**
 *  Main registry for user entities.
 */
class Fl32_Ap_User_Back_Store_RDb_Schema_User {
    date_created;
    id;
    is_admin;
    name;
}

// table name and columns names (entity and attributes) to use in queries to RDb
Fl32_Ap_User_Back_Store_RDb_Schema_User.A_DATE_CREATED = 'date_created';
Fl32_Ap_User_Back_Store_RDb_Schema_User.A_ID = 'id';
Fl32_Ap_User_Back_Store_RDb_Schema_User.A_IS_ADMIN = 'is_admin';
Fl32_Ap_User_Back_Store_RDb_Schema_User.A_NAME = 'name';
Fl32_Ap_User_Back_Store_RDb_Schema_User.ENTITY = 'user';

// freeze class to deny attributes changes
Object.freeze(Fl32_Ap_User_Back_Store_RDb_Schema_User);

// MODULE'S EXPORT
export default Fl32_Ap_User_Back_Store_RDb_Schema_User;
