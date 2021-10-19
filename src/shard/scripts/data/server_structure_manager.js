class ServerStructureManager {
    constructor(_sql_connection) {
        this.sql_connection = _sql_connection;

        this.server_add = require("./server_add");
        this.server_edit = require("./server_edit");
        this.server_fetch = require("./server_fetch");
        this.server_remove = require("./server_remove");
    }
}

module.exports = ServerStructureManager;
