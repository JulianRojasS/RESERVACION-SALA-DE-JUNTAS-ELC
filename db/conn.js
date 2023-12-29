import * as mysql from 'mysql2'

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "SJ"
})

con.connect()

export default con;