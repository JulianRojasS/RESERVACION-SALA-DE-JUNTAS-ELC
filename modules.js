import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import * as fs from "fs"
import { router } from "./routes/routes.js"
import { exec } from "child_process"

/// **LEER README.txt***

/// SERVIDOR
const app = express()
const __filename = fileURLToPath(import.meta.url)
export const dirname = path.dirname(__filename)
/// PUERTO QUE MANEJA EL SERVIDOR DE MANERA LOCAL
const port = 80

/// TIPO DE EXTENSIÓN DE ARCHIVO PARA MOTOR DE VISTA
/// SE REMPLAZA HTML POR EJS PARA MANEJAR LOS PARAMETROS PASADOS EN 'routes.js'
app.set("view engine", "ejs")
app.set("views", path.join(dirname,"views"))
app.set("trust proxy", true)

/// SE DEFINE EL USO DE ROUTER
app.use("/", router)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '10.0.23.51');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
/// SE DEFINE EL USO DE ARCHIVOS ESTATICOS (CSS, IMAGENES, ETC)
app.use(express.static(path.join(dirname, "views", "public")))

/// SE CARGA EL SERVIDOR
const server = app.listen(port, "10.0.23.51", () => {
    console.log(`Server run in port ${port}`)
    /// SE ESCRIBE UN MANSAJE EN 'log.txt'
    write_log("El servidor se inicio - " + new Date() + "\n")
})


/// SI SE BORRAN LOS REGISTROS EN 'hoja.csv'
/// SOLO PEGAR 'tittle()' AL FINAL DEL ARCHIVO Y VOLVER A EJECUTAR EL SERVIDOR, LUEGO DE ESO CERRAR EL SERVIDOR Y BORRAR 'tittle()'
const tittle = () => {
    fs.appendFile("hoja.csv", "Solicitante, Area, Sala, Fecha, Hora inicio, Hora fin\n", (err) => {
        if (err) {
            console.log(err)
        } 
        console.log("El titulo se genero correctamente")
    })
}

export const write_log = (msj) => {
    fs.appendFileSync('log.txt' ,msj ,(err) => {
        if(err) {
            console.log(err)
        }
    })
}
