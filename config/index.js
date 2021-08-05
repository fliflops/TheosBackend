module.exports = {
    dbCredentials:{
        username:'sa',
        password:'R@mc02019!',
        database:'metisDB',
        host:'13.250.206.211',
        dialect:'mssql',
        dialectOptions:{
            options: { "requestTimeout": 300000 }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
}
