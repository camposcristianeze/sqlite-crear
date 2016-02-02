var express = require('express');
var router = express();
var i = 0;
var hasta2="";
var fs = require('fs');
var database;
var nombre2 = "";
var c=0;
var pjson = require('../package.json');
var sqlite3 = require('sqlite3').verbose();
var max = 0;
var obtenerFecha = require('./utiles/fecha.js');
var obtenerEmpleados = require('./utiles/consultas.js');
router.get('/', function (req, res) {
	var user=req.user.username
	var ruta = "./database/" + user + "/personal.db";
	if (ruta==="./database/null/personal.db"){
		res.redirect('/');
	}else{
res.render(__dirname + '/../views/exportaremp',{fecha: obtenerFecha()});
	};
});
router.post('/', function (req, res) {
	obtenerEmpleados(function(database){
		max=(database.length);	
		var desde = req.body.desde;
		var hasta = req.body.hasta;
		if (desde>hasta){
			nombre2="Fecha inicial no puede ser mayor que fecha final";
		};	
		function obtenerSuma(){
			var dates=new Date(hasta);
			return dates.getFullYear() + "-" + agregarCero((dates.getMonth() + 1)) + "-" + agregarCero((dates.getDate() +1));		
		};
		if (hasta>=desde && req.body.formato==="txt"){
			 hasta2=obtenerSuma(hasta);
			c=0;
			var user=localStorage.getItem('user');
			var ruta2="./database/"+user+"/database.txt";
	 for (var x = 0; x < max; x++){
		 if(database[x].idusuario>=desde && hasta2>=database[x].idusuario){
		 c=c+1;	 
	fs.appendFile(ruta2,database[x]._id+","+database[x].idusuario+","+database[x].nombre+","+database[x].apellido+","+database[x].cedula+","+database[x].fechanac+","+database[x].empresa+","+database[x].dpto+","+database[x].acceso+","+database[x].huella+'\r\n', function (err) {
    if (err) {
    c=0;
    console.log('error');
        }});	 
		 }};  
		 nombre2=c+" Dato(s) exportados en .Txt";
		 x = 0;
		 };
			 if(hasta>=desde && req.body.formato==="Db"){ 
			  c=0;
			  hasta2=obtenerSuma(hasta);
			  var user=localStorage.getItem('user');
			  var ruta3="./database/"+user+"/exportados.db";
			  var exporta = new sqlite3.Database(ruta3);
			   exporta.serialize(function () {
			   exporta.run('drop table if exists personal');
			   exporta.run('create table if not exists personal (_id INTEGER PRIMARY KEY AUTOINCREMENT, idusuario TEXT , nombre TEXT , apellido TEXT , cedula TEXT , fechanac TEXT , empresa TEXT , dpto TEXT , acceso TEXT , huella TEXT )');
			   var insertar = exporta.prepare("INSERT INTO personal VALUES (?,?,?,?,?,?,?,?,?,?)");
			   for (var x = 0; x < max; x++){
		    if(database[x].idusuario>=desde && hasta2>=database[x].idusuario){
		     c=c+1;
			insertar.run(database[x]._id,database[x].idusuario,database[x].nombre, database[x].apellido, database[x].cedula, database[x].fechanac, database[x].empresa, database[x].dpto,database[x].acceso,database[x].huella);
		 };    
			   };
			   insertar.finalize();
			    nombre2=c+" Dato(s) exportados en .Db"; 			   
			    });
			 };
	res.render(__dirname + '/../views/listaemp', {vector:database,max:max,nombre2:nombre2,version: pjson.version});
nombre2="";	
});
});

 function agregarCero(date) {
        if (date < 10) {
            return ("0" + date);
        } else {
            return date;
        };
    }; 
	
module.exports = router;