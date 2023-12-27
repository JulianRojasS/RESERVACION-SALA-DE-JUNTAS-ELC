import express from "express";
import bodyParser from "body-parser";
import * as fs from "fs";
import { write_log } from "../modules.js";
import {Insertar, Leer} from "../db/crud.js";

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

///RUTA PARA CERRA SERVIDOR
router.get('/detener',async (req, res) => {
  await write_log("El servidor se cerro - " + new Date() + "\n")
  await server.close( async () => {
	await process.exit(0)
  })
 });

/// LISTADO DE RESERVACIONES
router.get("/reservation", async (req, res) => {
    try {
      const peticiones = JSON.stringify(await Leer())
      res.render("reservation", { data: peticiones});
    } catch (ex) {
      console.log(ex)
    }
});

/// METODO HTTP PARA ENVIO DE DATOS
router.post("/sendinfo", (req, res) => {
  /// ESTAS VARIABLES SE INICIALIZAN EN BLANCO PARA LUEGO ASIGNARLES UN VALOR ***NO BORRAR***
  var dia_Act = ""
  var hora_Act = ""
  /// SE RECOLECTAN LOS DATOS POR MEDIO DEL ARGUMENTO 'res' DE LA SOLICITUD DEL METODO 'POST'
  /// Y SE AGREGAN A UN OBJETO JSON
  const json = {
      Solicitante: req.body.nombre,
      Sala: req.body.sala,
      Area: req.body.area,
      Fecha: req.body.fecha,
      HoraInicio: req.body.hora_inicio,
      HoraFin: req.body.hora_fin
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
  if (json.Fecha < dia_Act) {
    res.render('index', {res: 'La fecha indicada no es valida', json: json})
  } else if (json.Fecha == dia_Act) {
    if (json.HoraFin > json.HoraInicio) {
      if (json.HoraInicio >= '07:00' && json.HoraFin <= '16:00') {
        if (json.HoraInicio >= hora_Act) {
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
    if (json.HoraFin > json.HoraInicio) {
      if (json.HoraInicio >= '07:00' && json.HoraFin <= '16:00') {
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
const calculo_horas = async (json, res, req) => {
    try {
        const solicitudes = await Leer()

        /// ESTA LISTA ES DE LAS SOLICITUDES POR CADA DIA
        var solicitudes_dia = []
             
        for (var i = 0; i < solicitudes.length; i++){
          if (solicitudes[i].Fecha == json.Fecha && solicitudes[i].Sala == json.Sala) {
            /// SE INGRESAN LAS SOLICITUDES QUE CORRESPONDAN CON EL DIA SOLICITADO
            solicitudes_dia.push(solicitudes[i])
          }
        }

        if (solicitudes_dia.length == 0) {
          console.log("por que la lista de solicitudes es de 0")
          /// SI NO HAY NINGUNA RESERVACIÓN EN ESA FECHA SE AGREGA DIRECTAMENTE LA RESERVACION
          try {
            Insertar(json)
            /// SE GENERA UN REGISTRO EN EL 'log.txt'
            write_log(`El usuario ${req.ip} creo una reservación - ${new Date()} \n`)
            /// Y SE REDIRECCIONA AL USUARIO A LA TABLA DE RESERVACIONES
            res.render('index', {res: 'Se agrego su reservación correctamente', json: {}}, (err) => {
              if (err) {
                console.log(err)
              }
              res.redirect('reservation')
            })
          } catch (ex) {
            console.log(ex)
          }
        
        } else {
          var i = 0
          for (var s = 0; s < solicitudes_dia.length; s++) {
            const tiempo_inicio_solicitud = solicitudes_dia[s].HoraInicio
            const tiempo_fin_solicitud = solicitudes_dia[s].HoraFin
            /// SI HAY MAS RESERVACIONES EN ESE DIA SE HACE UNA VALIDACIÓN DE DISPONIBILIDAD EN LOS TIEMPOS
            if (json.HoraInicio >= tiempo_inicio_solicitud && json.HoraInicio <= tiempo_fin_solicitud || json.HoraFin >= tiempo_inicio_solicitud && json.HoraFin <= tiempo_fin_solicitud) {
              i--
            } else {
              i++
            }
          }
        
          if (i == solicitudes_dia.length) {
            try {
              Insertar(json)
              /// SE GENERA UN REGISTRO EN EL 'log.txt'
              write_log(`El usuario ${req.ip} creo una reservación - ${new Date()} \n`)
              /// Y SE REDIRECCIONA AL USUARIO A LA TABLA DE RESERVACIONES
              res.render('index', {res: 'Se agrego su reservación correctamente', json: {}}, (err) => {
                if (err) {
                  console.log(err)
                }
                res.redirect('reservation')
              })
            } catch (ex) {
              console.log(ex)
            }
          } else {
            /// SI NO HAY, SE GENERA EL MENSAJE DE ERROR POR FALTA DE DISPONIBILIDAD
            res.render('index', {res: `El rango de tiempo ${json.HoraInicio}:${json.HoraFin} ya esta reservador por ${solicitudes_dia[0].Solicitante}`, json: json})
          }
        }

    } catch (ex) {
      console.log(ex)
    }
        
}
