const sqlite3 = require('sqlite3');

class sqlServer {
    constructor() {
        this.db = null
        this.Connect()
    }
    // 初始化数据库
    Connect() {
        let _self = this
        return new Promise((res) => {
            _self.db = new sqlite3.Database('rc.db', e => {
                res(e)
            })
        })
    }
    /**
     * 创建表
     * @param {string} sql spl语句
     * @returns 
     */
    Creat(sql = 'CREATE TABLE user (id INTEGER PRIMARY KEY,user_name VARCHAR (30) NOT NULL,age TINYINT (3) NOT NULL DEFAULT 0)') {
        if (!this.db) return 'error'
        return new Promise((res) => {
            this.db.run(sql, res)
        })
    }
    /**
     * 添加一个条数据
     * @param {string} spl spl语句
     * @returns 
     */
    Add(sql = 'INSERT INTO user (user_name, age) VALUES (?, ?)', VALUES = ['marke', 28]) {
        if (!this.db) return 'error'
        return new Promise(res => {
            this.db.run(sql, VALUES, res)
        })
    }

    /**
     * 修改数据
     * @param {tring} sql spl语句
     * @returns 
     */
    Edit(sql = 'UPDATE user SET user_name = $newName WHERE user_name = $userName') {
        if (!this.db) return 'error'
        return new Promise(res => {
            this.db.run(sql, res)
        })
    }

    /**
     * 查询数据
     * @param {string} sql spl语句
     * @returns 
     */
    Query(sql = 'SELECT id, user_name, age FROM user') {
        if (!this.db) return 'error'
        return new Promise(res => {
            this.db.run(sql, res)
        })
    }

    /**
     * 删除数据
     * @param {string} sql spl语句
     * @returns 
     */
    Del(sql = 'delete from user where username=buding') {
        if (!this.db) return 'error'
        return new Promise(res => {
            this.db.run(sql, res)
        })
    }
}
module.exports = new sqlServer()