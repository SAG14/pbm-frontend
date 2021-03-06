// Server Configuration file

module.exports = {

    // Change variable for DEV/PROD
    isDev: true,
    
    db: 'mongodb://username:password@url:port/db',
    db_dev: 'mongodb://admin:pbmtest@ds031581.mlab.com:31581/pbm-demo',
    
    // Location of frontend website
    frontend_path:'http://hs-minimag.azurewebsites.net/',
    frontend_path_dev:'http://localhost:3000',

    // Email variables
    emailService: 'gmail',
    emailUsername: 'pbm.project.vfy@gmail.com',
    emailPassword: 'pbm4900test',

};