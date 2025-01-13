const express = require('express')
const session = require('express-session')
const app = express();

// Cofiguración  de la sesión 

app.use(session({
    secret: 'mi-clave-secreta',  // Secreto para firmar la cookie de sesión 
    resave: false, //No resguardar la sesión si no ha sido modificada 
    saveUninitialized: true, //Guarda la sesión aunque no haya sido inicializada 
    cookie: {secure: false}   // Usar secure: true solo si suas HTTPS
}));

// Middleware para mostrar detalles de la sesión
app.use((req, res, next) => {
    if(req.session) {
        if (!req.session.createAt) {
            // Guardamos la fecha como string ISO
            req.session.createAt = new Date().toISOString();
        }
        // Guardamos la última fecha de acceso
        req.session.lastAccess = new Date().toISOString();
    }
    next();
});

// Ruta para mostrar la información de la sesión
app.get('/session', (req, res) => {
    if(req.session) {
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
    req.session.destroy((err) => {
        if(err) {
            return res.send('Error al cerrar la sesión.');
        }
        res.send('<h1>Sesión cerrada exitosamente.</h1>')
    })
})

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
})