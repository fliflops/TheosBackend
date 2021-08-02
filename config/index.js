module.exports = {

    //ShopifyDB Credentials
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
    },

    //SCMDB Credentials
    scmdbCredentials:{
        username:'sa',
        password:'R@mc02019!',
        database:'scmdb',
        host:'13.250.206.211',
        dialect:'mssql'
    },

	//SFTP Credentials
	sftpCredentials:{
		host:'ec2-18-138-191-166.ap-southeast-1.compute.amazonaws.com',
		username:'LogSFTP',
		password:'WM$ft317'
	}
}
