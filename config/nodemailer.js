const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // `true` for port 465, `false` for all other ports
    auth: {
        user: "projetcsofkt@gmail.com",
        pass: "zrwn lady blvq hrqe",
    },
});


let renderTemplate= function(data, relativePath){
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){console.log('error in rendering template for mail template', err); return;}
            mailHTML=template;
        }
    );

    return mailHTML;
}

module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}