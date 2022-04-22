
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT
const path = require('path');
const hbs = require('hbs');
const mysql = require('mysql2');
const { createConnection } = require('net');
//creamos la conexion

const conexion =mysql.createConnection({
    host: "us-cdbr-east-05.cleardb.net",
    user: "b2058b83e945bc",
    password: "91d7ce3f",
    database: "heroku_e9c24ed0d92fc0a"
});
//conectamos a la DB
conexion.connect((error)=>{
    if(error) throw error;
    console.log("conexion a la data base exitosa")
});


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/assets", express.static(__dirname + "/public"));

//Configuramos el Motor de Plantillas
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.set('public', path.join(__dirname, 'public'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));



app.get('/', (req, res) =>{
    res.render('index', {titulo: 'Bienvenidos a la App'})
});

app.post('/formulario', (req, res) =>{

    /*  res.json({
        Dato: 'Recibido'
    }); */

    //Desestructuración de las variables
    const { nombre, precio, descripcion, foto_url } = req.body;
        
    if(nombre == "" || precio == ""){
        
        let validacion = 'Faltan datos para guardar el Producto';
        
        res.render('administracion', {
            titulo: 'Formulario para Completar',
            validacion
        });

    }else{

        console.log(nombre);
        console.log(precio);
        console.log(descripcion);

        //insertar datos a la DB
        let data= {
            producto_nombre:nombre,
            producto_precio:precio,
            producto_descripcion:descripcion,
            producto_foto_url:foto_url
        }

        let sql = 'Insert into productoss set ?';
        conexion.query(sql,data,(error, results)=>{
            if(error) throw error;
            res.redirect('/administracion');
        })
    }
});

app.get('/productos', (req, res) =>{

    let sql = 'Select * from productoss';
    conexion.query(sql,(error,results)=>{
        if(error) throw error;
        res.render('productos', {
            titulo: 'Productos',
            results:results,
        });
    });


    
    
});
app.post('/delete', (req,res)=>{
    let sql = "DELETE FROM productoss WHERE id_producto="+req.body.id_producto;
    conexion.query(sql,(error,results)=>{
        if(error) throw error;
        res.redirect('/administracion');
    });

});

app.post('/update',(req,res)=>{
    let sql= "UPDATE productoss SET producto_nombre='"+req.body.producto_nombre+
    "', producto_precio='"+ req.body.producto_precio+"', producto_foto_url='"+ req.body.producto_foto_url+"' WHERE id_producto="+ req.body.id_producto;
    conexion.query(sql,(error,results)=>{
        if(error) throw error;
        res.redirect('/administracion');
    });


});



app.get('/contacto', (req, res) =>{
    res.render('contacto', {titulo: 'Escríbenos'})
});
app.get('/login', (req, res) =>{
    res.render('login')
});
app.post('/login', (req, res) =>{

    //Desestructuración de las variables
    const { usuario, contraseña} = req.body;
        
    if(usuario == "usuario" & contraseña == "contraseña"){
        
    res.redirect('/administracion');
    }
});


app.post('/contacto', (req, res) =>{

    //Desestructuración de las variables
    const { nombre, email, telefono } = req.body;
        
    if(nombre == "" || email == ""||telefono==""){
        
        let validacion = 'Faltan tus datos';
        
        res.render('contacto', {
            titulo: 'Escríbenos',
            validacion
        });

    }else{

        console.log(nombre);
        console.log(email);
        console.log(telefono);
        let data= {
            nombre:nombre,
            email:email,
            telefono:telefono
        }

        let sql = 'Insert into contactos set ?';
        conexion.query(sql,data,(error, results)=>{
            if(error) throw error;
            res.redirect('/');
        })
    }
});

app.get('/administracion', (req, res) =>{
    let sql = 'Select * from productoss';
    conexion.query(sql,(error,results)=>{
        if(error) throw error;
        res.render('administracion', {
            titulo: 'Bienvenido Administrador',
            results:results,
        });
    });
});

app.listen(PORT, () =>{
    console.log(`Servidor está trabajando en el Puerto ${PORT}`);
});

app.on('error', (err) =>{
    console.log(`Error en la ejecución del Servidor ${PORT}`);
})




