class ServerStructureManager {
    constructor(_global_context, _sql_connection) {
        this.global_context = _global_context;
        this.sql_connection = _sql_connection;
        
        this.server_add = require('./server_add');
        this.server_edit = require('./server_edit');
        this.server_fetch = require('./server_fetch');
        this.server_remove = require('./server_remove');

        this.version = "2021.5.2";
        this.lastCommit = "Tue, 25 May 2021 14:59:23 GMT";
    }
}

module.exports = ServerStructureManager;