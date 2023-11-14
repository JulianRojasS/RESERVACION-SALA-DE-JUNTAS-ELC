import express from "express";
import bodyParser from "body-parser";
import * as fs from "fs";
import { write_log } from "../modules.js";

/// CREACIÓN DEL ROUTER QUE ES EL QUE MANEJA TODAS LAS DIRECCIONES DE LA PAGINA
export const router = express.Router();
/// SE USA PARA PODER RESIVIR VALORES POR ARGUMENTO 'res'
router.use(bodyParser.urlencoded({ extended: true }));
const ruta_completa = "hoja.csv"
var data = {res: "", json: {}}

/// PAGINA PRINCIPAL
router.get("/", (req, res) => {
  write_log(`El usuario ${req.ip} ingreso - ${new Date()} \n`)
  res.render("index", data);
});

/// LISTADO DE RESERVACIONES
router.get("/reservation", (req, res) => {
  fs.readFile(ruta_completa, "utf-8", (err, data) => {
    /// LISTA PARA RECOLECTAR LAS RESERVACIONES DE 'hoja.csv'
    var peticiones = [];
    if (err) {
      console.log(err);
    }
    /// SE SEPARAN POR SALTO DE LINEA
    const lista = data.split("\n");
    /// SE RECORRE LA LISTA PARA OBTENER CADA VALOR Y AGREGARLO EN UN OBJETO JSON
    for (var i = 1; i < lista.length; i++) {
      const e = lista[i].split(",");
      const reserb = {
        solicitante: e[0],
        sala: e[1],
        area: e[2],
        fecha: e[3],
        hora_inicio: e[4],
        hora_fin: e[5],
      };
      /// SE AGERGAN AL LISTADO QUE SE  INICIALIZO ANTES
      peticiones.push(JSON.stringify(reserb));
    }
    /// SE RETORNA EL LISTADO CON LOS JSON
    res.render("reservation", { data: peticiones});
  });
});

/// METODO HTTP PARA ENVIO DE DATOS
router.post("/sendinfo", (req, res) => {
  /// ESTAS VARIABLES SE INICIALIZAN EN BLANCO PARA LUEGO ASIGNARLES UN VALOR ***NO BORRAR***
  var dia_Act = ""
  var hora_Act = ""
  /// SE RECOLECTAN LOS DATOS POR MEDIO DEL ARGUMENTO 'res' DE LA SOLICITUD DEL METODO 'POST'
  /// Y SE AGREGAN A UN OBJETO JSON
  const json = {
      nombre: req.body.nombre,
      sala: req.body.sala,
      area: req.body.area,
      fecha: req.body.fecha,
      hora_inicio: req.body.hora_inicio,
      hora_fin: req.body.hora_fin
  }

  /// ESTE ES PARA AGREGAR '0' A LAS FECHAS QUE ARROJA EL FORMULARIO
  if (parseInt(new Date().getDate()) <= 9) {
    dia_Act = `${new Date().getFullYear()}-${new Date().getMonth()+1}-0${new Date().getDate()}`.toString()
  } else if (parseInt(new Date().getMonth()+1) <= 9) {
    dia_Act = `${new Date().getFullYear()}-0${new Date().getMonth()+1}-${new Date().getDate()}`.toString()
  } else if (parseInt(new Date().getDate()) <= 9 && parseInt(new Date().getMonth()+1) <= 9) {
    dia_Act = `${new Date().getFullYear()}-0${new Date().getMonth()+1}-0${new Date().getDate()}`.toString()
  } else {
    dia_Act = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`.toString()
  }

  /// ESTE ES PARA AGREGAR '0' A LAS HORAS QUE ARROJA EL FORMULARIO
  if (parseInt(new Date().getHours()) <= 9) {
    hora_Act = `0${new Date().getHours()}:${new Date().getMinutes()}`
  } else if (parseInt(new Date().getMinutes()) <= 9) {
    hora_Act = `${new Date().getHours()}:0${new Date().getMinutes()}`
  } else if (parseInt(new Date().getHours()) <= 9 && parseInt(new Date().getMinutes()) <= 9) {
    hora_Act = `0${new Date().getHours()}:0${new Date().getMinutes()}`
  } else {
    hora_Act = `${new Date().getHours()}:${new Date().getMinutes()}`
  }

  /// VALIDACIÓN PARA LA DISPONIBILIDAD DE LA SALA DE JUNTAS EN TIEMPO Y EN RESERVA
  /// LOS RES.RENDER SON MENSAJES DE ERROR DE MALA SELECCION DE TIEMPOS QUE SE ENVIAN AL USUARIO FINAL
  if (json.fecha < dia_Act) {
    res.render('index', {res: 'La fecha indicada no es valida', json: json})
  } else if (json.fecha == dia_Act) {
    if (json.hora_fin > json.hora_inicio) {
      if (json.hora_inicio >= '07:00' && json.hora_fin <= '16:00') {
        if (json.hora_inicio >= hora_Act) {
          calculo_horas(json, res, req)
        } else {
          res.render('index', {res: `Elije una hora despues de ${hora_Act}`, json: json})
        }
      } else {
        res.render('index', {res: 'Elije una hora entre las 07:00 am a 04:00 pm', json: json})
      }
    } else {
      res.render('index', {res: 'Los tiempos ingresados no son correctos', json: json})
    }
  } else {
    if (json.hora_fin > json.hora_inicio) {
      if (json.hora_inicio >= '07:00' && json.hora_fin <= '16:00') {
        calculo_horas(json, res, req)
      } else {
        res.render('index', {res: "Elige una hora entre las 07:00 am a 04:00 pm", json: json})
      }
    } else {
      res.render('index', {res: "Los tiempos ingresados nos son correctos", json: json})
    }
  }
});

/// ESTA FUNCION ES LA QUE AGREGA LA RESERVACIÓN AL ARCHIVO 'hoja.csv'
const calculo_horas = (json, res, req) => {
  fs.readFile('hoja.csv', 'utf-8', (err, data) => {
    if (err) {
      console.log(err)
    }

    /// SE RECOLECTAN TODAS LAS RESERVACIONES Y SE SEPARAN POR SALTO DE LINEA
    var solicitudes = data.split('\n')
    /// ESTA LISTA ES DE LAS SOLICITUDES POR CADA DIA
    var solicitudes_dia = []

    for (var i = 1; i<solicitudes.length; i++){
      var solicitud = solicitudes[i].split(",")
      if (solicitud[3] == json.fecha && solicitud[2] == json.sala) {
        /// SE INGRESAN LAS SOLICITUDES QUE CORRESPONDAN CON EL DIA SOLICITADO
        solicitudes_dia.push(solicitud)
      }
    }

    if (solicitudes_dia.length == 0) {
      /// SI NO HAY NINGUNA RESERVACIÓN EN ESA FECHA SE AGREGA DIRECTAMENTE LA RESERVACION
      fs.appendFile(ruta_completa, `\n${json.nombre},${json.area},${json.sala},${json.fecha},${json.hora_inicio},${json.hora_fin}`, (err) => {
        if(err) {
          console.log(err)
        }
        /// SE GENERA UN REGISTRO EN EL 'log.txt'
        write_log(`El usuario ${req.ip} creo una reservación - ${new Date()} \n`)
        /// Y SE REDIRECCIONA AL USUARIO A LA TABLA DE RESERVACIONES
        res.render('index', {res: 'Se agrego su reservación correctamente', json: {}}, (err) => {
          if (err) {
            console.log(err)
          }
          res.redirect('reservation')
        })
      })
    } else {
      var i = 0
      for (var s = 0; s<solicitudes_dia.length; s++) {
        const tiempo_inicio_solicitud = solicitudes_dia[s][4]
        const tiempo_fin_solicitud = solicitudes_dia[s][5]
        /// SI HAY MAS RESERVACIONES EN ESE DIA SE HACE UNA VALIDACIÓN DE DISPONIBILIDAD EN LOS TIEMPOS
        if (json.hora_inicio >= tiempo_inicio_solicitud && json.hora_inicio <= tiempo_fin_solicitud || json.hora_fin >= tiempo_inicio_solicitud && json.hora_fin <= tiempo_fin_solicitud) {
          i--
        } else {
          i++
        }
      }

      if (i == solicitudes_dia.length) {
        fs.appendFile(ruta_completa, `\n${json.nombre},${json.area},${json.sala},${json.fecha},${json.hora_inicio},${json.hora_fin}`, (err) => {
          if(err) {
            console.log(err)
          }
          /// SI HAY DISPONIBILIDAD SE AGREGA AL ARCHIVO 'hoja.csv'
          write_log(`El usuario ${req.ip} creo una reservación - ${new Date()} \n`)
          res.render('index', {res: 'Se agrego su reservación correctamente', json: {}}, (err) => {
            if (err) {
              console.log(err)
            }
            res.redirect('reservation')
          })
        })
      } else {
        /// SI NO HAY, SE GENERA EL MENSAJE DE ERROR POR FALTA DE DISPONIBILIDAD
        res.render('index', {res: `El rango de tiempo ${json.hora_inicio}:${json.hora_fin} ya esta reservador por ${solicitudes_dia[0][0]}`, json: json})
      }
    }
     
  })
}