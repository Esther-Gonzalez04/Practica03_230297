const express=require('express');
const session=require('express-session');

const  app = express();

// Cofiguración  de la sesión 
app.use(session({
    secret: 'mi-clave-secreta', // Secreto para firmar la cookie de sesión 
    resave: false,              //No resguardar la sesión si no ha sido modificada 
    saveUninitialized: true,    //Guarda la sesión aunque no haya sido inicializada 
    cookie: {secure: false}     // Usar secure: true solo si suas HTTPS
}));

// Middleware para moestrar detalles de la sesión 

app.use((req, res, next) =>{
    if (req.session){
        if(!req.session.createdAt){
            req.session.createdAt= new Date(); // Asignamos la fecha de creación de la sesión 
        }
        req.session.lastAccess= new Date(); //Asignamos la última vez que se accedió a la sesión 
    }
    next();
});


// Ruta para moestar  la información de la sesión 
app.get('/session', (req,res)=>{
    if(req.session){
        const sessionId =req.session.id;
        const createAt =req.session.createAt;
        const lastAccess=req.session.lastAccess;
        const sessionDuration = (new Date() - createdAt) /1000; //Duracion de la sesion en segundos 

        res.send(`
        <1>Detalles de la sesión </h1>
        <p><strong> ID de sesion: <strong> ${sessionId}</p>`
        

        )
    }
})
