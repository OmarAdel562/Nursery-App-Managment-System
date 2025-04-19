import nodemailer from 'nodemailer'

export const sendEmail=async({ to, subject ,html}) =>{
    const transporter=nodemailer.createTransport({
        service:"gmail",
        tls: {
            rejectUnauthorized: false,
        },
        auth:{
            user:"adel35409@gmail.com",
            pass:"mnuymhzqrkoagoir"
        } 
    })
    await transporter.sendMail({
        to,
        from:"'<nursery-app>adel35409@gmail.com", 
        subject,
        html
    })
}