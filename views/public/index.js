var lista = document.getElementById("datos").getAttribute("data-array")
var list_by_json = JSON.parse(lista)
var peticiones = []
var tbody = document.getElementById("content")

sessionStorage.removeItem("data")

list_by_json.forEach(element => {
    peticiones.push(element)
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
        if (a.Solicitante > b.Solicitante) {
            return 1;
        } else if (a.Solicitante < b.Solicitante) {
            return -1;
        } else {
            return 0;
        }
    })
    tbody.innerHTML = ""
    push_data(peticiones)
})
sort_by_area.addEventListener("click", (e) => {
    peticiones.sort((a, b) => {
        if (a.Area > b.Area) {
            return 1;
        } else if (a.Area < b.Area) {
            return -1;
        } else {
            return 0;
        }
    })
    tbody.innerHTML = ""
    push_data(peticiones)
})
sort_by_sala.addEventListener("click", (e) => {
    peticiones.sort((a, b) => {
        if (a.Sala > b.Sala) {
            return 1;
        } else if (a.Sala < b.Sala) {
            return -1;
        } else {
            return 0;
        }
    })
    
    tbody.innerHTML = ""
    push_data(peticiones)
})
sort_by_fecha.addEventListener("click", (e) => {
    peticiones.sort((a, b) => {
        if (a.Fecha >  b.Fecha) {
            return 1;
        } else if (a.Fecha < b.Fecha) {
            return -1;
        } else {
            return 0;
        }
    })
    
    tbody.innerHTML = ""
    push_data(peticiones)
})
sort_by_hora_in.addEventListener("click", (e) => {
    peticiones.sort((a, b) => {
        if (a.HoraInicio > b.HoraInicio) {
            return 1;
        } else if (a.HoraInicio < b.HoraInicio) {
            return -1;
        } else {
            return 0;
        }
    })
    
    tbody.innerHTML = ""
    push_data(peticiones)
})

sort_by_hora_fin.addEventListener("click", (e) => {
    peticiones.sort((a, b) => {
        if (a.HoraFin > b.HoraFin) {
            return 1;
        } else if (a.HoraFin < b.HoraFin) {
            return -1;
        } else {
            return 0;
        }
    })
    
    tbody.innerHTML = ""
    push_data(peticiones)
})

function push_data(peticiones) {
    for(let i = peticiones.length; i > 0; i--) {
        var solicitud = peticiones[i-1]
        tbody.innerHTML += `<tr><td>${solicitud.Solicitante}</td><td>${solicitud.Area}</td><td>${solicitud.Sala}</td><td>${solicitud.Fecha}</td><td>${solicitud.HoraInicio}</td><td>${solicitud.HoraFin}</td></tr>`
    }
}
