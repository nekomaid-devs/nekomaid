class ServerStructureManager {
    constructor(_bot, _sql, _conn) {
        this.sql = _sql
        this.sqlConn = _conn;
        this.bot = _bot;
        
        this.server_add = require('./server_add');
        this.server_edit = require('./server_edit');
        this.server_fetch = require('./server_fetch');
        this.server_remove = require('./server_remove');

        this.version = "2021.5.2";
        this.lastCommit = "Tue, 25 May 2021 14:59:23 GMT";
    }
}

module.exports = ServerStructureManager;