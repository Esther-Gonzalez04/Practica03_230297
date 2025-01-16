const express = require('express')
const session = require('express-session')
const app = express();
const moment =require ('moment-timezone')

// Cofiguración  de la sesión 

app.use(session({
    secret: 'p3-EGP#girlmorgan-sesionespersistentes',  // Secreto para firmar la cookie de sesión 
    resave: false, //No resguardar la sesión si no ha sido modificada 
    saveUninitialized: true, //Guarda la sesión aunque no haya sido inicializada 
    cookie: {secure: false, maxAge: 24 * 60 * 60 * 100}   // 24 horas
}));

// Middleware para mostrar detalles de la sesión
/*app.use((req, res, next) => {
    if(req.session) {
        if (!req.session.createAt) {
            // Guardamos la fecha como string ISO
            req.session.createAt = new Date().toISOString();
        }
        // Guardamos la última fecha de acceso
        req.session.lastAccess = new Date().toISOString();
    }
    next();
});*/

//Ruta para inicializar la sesión 
app.get('/login/', (req, res)=>{
    if(!req.session.createdAt){
        req.session.createdAt=new Date();
        req.session.lastAccess= new Date();
        res.send('La sesion ha sido iniciada');
    } else{
        res.send('Ya existe una sesión');
    }
});

//ruta para actualizar la fecha de la última consulta 

app.get('/update', (req, res) =>{
    if(req.session.createAt){
        req.session.lastAcess = new Date();
        res.send('La fecha de último acceso ha sido actualizada')
    }else{
        res.send('No hay una sesión activa');
    }
})

//ruta para obtener el estado de la sesión 

app.get('/status', (req, res) =>{
    if(req.session.createAt){
        const now = new Date();
        const started= new Date(req.session.createAt);
        const lastUpdate= new Date(req.session.lastAcess);

        //Calcula la antiguedad de la sesión
        const sessionAgeMs= now- started;
        const hours= Math.floor(sessionAgeMs/ (1000*60*60))
        const minutes = Math.floor((sessionAgeMs % (1000*60*60))/(1000*60));
        const seconds= Math.floor((sessionAgeMs % (1000*60))/1000)

        const createdAt_CDMX = moment(started).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss')
        const lastAcces_CDMX = moment(lastUpdate).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss')
        

        res.json({
            message: 'Estado de la sesión',
            sessionId: req.sessionID,
            inicio: createdAt_CDMX,
            ultimoAcceso: lastAcces_CDMX,
            antiguedad: `${hours} horas, ${minutes} minutos y ${seconds} segundos`
            
        });

    }else{
        res.send('No hay sesión activa');
    }
});

// Ruta para mostrar la información de la sesión
app.get('/session', (req, res) => {
    if(req.session && req.session.isLoggedIn) {
        const sessionId = req.session.id;
        // Convertimos las fechas string a objetos Date
        const createAt = new Date(req.session.createAt);
        const lastAccess = new Date(req.session.lastAccess);
        // Calculamos la duración
        const sessionDuration = Math.floor((new Date() - createAt) / 1000);
        
        res.send(`
            <h1>Detalles de la sesión</h1>
            <p><strong>ID de la sesión:</strong> ${sessionId}</p>
            <p><strong>Fecha de creación de la sesión:</strong> ${createAt.toISOString()}</p>
            <p><strong>Último acceso:</strong> ${lastAccess.toISOString()}</p>
            <p><strong>Duración de la sesión (en segundos):</strong> ${sessionDuration}</p>
        `);
    } else {
        res.send('<h1>No hay sesión activa.</h1>');
    }
});

app.get('/logout', (req, res)=> {
    if(req.session.createdAt){
        req.session.destroy((err)=>{
            if(err){
                return res.status(500).send('Error al cerrar la sesión');
            }
            res.send('Sesión cerradacorrectamente.');
        });
        
    }else{
        res.send('No hay una sesión activapara cerrar');
    }
});

//Ruta para iniciar sesión
app.get('/login/:usuario/:contrasenia', (req, res) => {
    const usuario = req.params.usuario;
    const contrasenia = req.params.contrasenia;
    if (!req.session.isLoggedIn) {
        req.session.usuario = usuario;
        req.session.contrasenia = contrasenia;
        req.session.isLoggedIn = true;
        req.session.createAt = new Date().toISOString();
        res.send(`
            <h1>Bienvenido ${usuario}</h1>
            <p>Has iniciado sesión.</p>
            `);
    }
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
})