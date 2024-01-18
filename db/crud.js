import con from "./conn.js";

/// CREATE

export function Insertar (reserb) {
    con.query("INSERT INTO reservaciones (Solicitante, Area, Sala, Fecha, HoraInicio, HoraFin) VALUES (?,?,?,?,?,?)", [reserb.Solicitante, reserb.Area, reserb.Sala, reserb.Fecha, reserb.HoraInicio, reserb.HoraFin], (err) => {
        if (err) console.log(err)
    })
}


/// READ

export async function Leer () {
    const reservaciones = new Promise ((resolve, reject) => {
        con.query("SELECT * FROM reservaciones", (err, res) => {
            if (err) reject(err)
            for (let i = 0; i < res.length; i++) {
                var fechas = new Date(res[i].Fecha)
                var newFecha = ""
                if (parseInt(fechas.getDate()) <= 9 && parseInt(fechas.getMonth()+1) <=9) {
                  newFecha = `${fechas.getFullYear()}-0${fechas.getMonth()+1}-0${fechas.getDate()}`
                } else if (parseInt(fechas.getMonth()+1) <= 9) {
                  newFecha = `${fechas.getFullYear()}-0${fechas.getMonth()+1}-${fechas.getDate()}`
                } else if (parseInt(fechas.getDate())<= 9){
                  newFecha = `${fechas.getFullYear()}-${fechas.getMonth()+1}-0${fechas.getDate()}`
                } else {
                  newFecha = `${fechas.getFullYear()}-${fechas.getMonth()+1}-${fechas.getDate()}`
                }
                res[i].Fecha = newFecha
            }

            resolve(res)
        })
    })

    return await reservaciones
}
