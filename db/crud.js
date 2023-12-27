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
                var newFecha = res[i].Fecha
                res[i].Fecha = `${new Date(newFecha).getFullYear()}-${new Date(newFecha).getMonth()+1}-${new Date(newFecha).getDate()}`
            }

            resolve(res)
        })
    })

    return await reservaciones
}