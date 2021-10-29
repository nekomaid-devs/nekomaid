import * as mysql_add from "./mysql_add";
import edit from "./mysql_edit";
import fetch from "./mysql_fetch";
import * as mysql_remove from "./mysql_remove";

class MySQL {

    sql_connection: any;
    mysql_add: any;
    edit: any;
    fetch: any;
    mysql_remove: any;

    constructor(sql_connection: any) {
        this.sql_connection = sql_connection;

        this.mysql_add = mysql_add;
        this.edit = edit;
        this.fetch = fetch;
        this.mysql_remove = mysql_remove;
    }
}

export default MySQL;
