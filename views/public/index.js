var lista = document.getElementById("datos").getAttribute("data-array")
var new_list = lista.replaceAll("},{", "}|{")
var list_by_json = new_list.split("|")
var peticiones = []
var tbody = document.getElementById("content")

sessionStorage.removeItem("data")

list_by_json.forEach(element => {
    peticiones.push(JSON.parse(element))
});


push_data(peticiones)

const sort_by_name = document.getElementById("nombre")
const sort_by_area = document.getElementById("area") 
const sort_by_sala = document.getElementById("sala") 
const sort_by_fecha = document.getElementById("fecha") 
const sort_by_hora_in = document.getElementById("hora_inicio")
const sort_by_hora_fin = document.getElementById("hora_fin")

sort_by_name.addEventListener("click", (e) => {
    peticiones.sort((a, b) => {
        if (a.solicitante > b.solicitante) {
            return 1;
        } else if (a.solicitante < b.solicitante) {
            return -1;
        } else {
            return 0;
        }
    })
    tbody.innerHTML = ""
    push_data(peticiones)
    console.log(peticiones)
})
sort_by_area.addEventListener("click", (e) => {
    peticiones.sort((a, b) => {
        if (a.area > b.area) {
            return 1;
        } else if (a.area < b.area) {
            return -1;
        } else {
            return 0;
        }
    })
    tbody.innerHTML = ""
    push_data(peticiones)
    console.log(peticiones)
})
sort_by_sala.addEventListener("click", (e) => {
    peticiones.sort((a, b) => {
        if (a.sala > b.sala) {
            return 1;
        } else if (a.sala < b.sala) {
            return -1;
        } else {
            return 0;
        }
    })
    
    tbody.innerHTML = ""
    push_data(peticiones)
    console.log(peticiones)
})
sort_by_fecha.addEventListener("click", (e) => {
    peticiones.sort((a, b) => {
        if (a.fecha > b.fecha) {
            return 1;
        } else if (a.fecha < b.fecha) {
            return -1;
        } else {
            return 0;
        }
    })
    
    tbody.innerHTML = ""
    push_data(peticiones)
    console.log(peticiones)
})
sort_by_hora_in.addEventListener("click", (e) => {
    peticiones.sort((a, b) => {
        if (a.hora_inicio > b.hora_inicio) {
            return 1;
        } else if (a.hora_inicio < b.hora_inicio) {
            return -1;
        } else {
            return 0;
        }
    })
    
    tbody.innerHTML = ""
    push_data(peticiones)
    console.log(peticiones)
})
sort_by_hora_fin.addEventListener("click", (e) => {
    peticiones.sort((a, b) => {
        if (a.hora_fin > b.hora_fin) {
            return 1;
        } else if (a.hora_fin < b.hora_fin) {
            return -1;
        } else {
            return 0;
        }
    })
    
    tbody.innerHTML = ""
    push_data(peticiones)
    console.log(peticiones)
})

function push_data(peticiones) {
    for(let i = peticiones.length; i > 0; i--) {
        var solicitud = peticiones[i-1]
        tbody.innerHTML += `<tr><td>${solicitud.solicitante}</td><td>${solicitud.sala}</td><td>${solicitud.area}</td><td>${solicitud.fecha}</td><td>${solicitud.hora_inicio}</td><td>${solicitud.hora_fin}</td></tr>`
    }
}