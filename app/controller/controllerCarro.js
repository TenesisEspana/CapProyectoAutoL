window.addEventListener("load", loadData);
HOST = window.location.host;

function loadData(){

    $.get("http://"+HOST+"/consesionarios/ventas", (data, status) => {
        //console.log(data);
        caragarDataAutosget(data);
    });
}

function filtroAutosGet(value,busq){

    switch (value ? value : ""){
        case "Anio_Modelo":
            $.get("http://"+HOST+"/consesionarios/ventas?$orderby=anio_Modelo", callBack);
            break;
        case "Busqueda":
            $.get("http://"+HOST+"/consesionarios/ventas?$search="+busq.trim(), callBack);
            break;
        default:
            $.get("http://"+HOST+"/consesionarios/ventas", callBack);
            break;
    }

}

function callBack (data, status) {
    caragarDataAutosget(data);
}

function setSelection(aux,inten){
    switch (inten) {
        case "Edit" :
            document.getElementById("tileModal").innerHTML = "Editar Auto";
            document.getElementById("btnTitleModal").innerHTML = "Editar Auto";
            $.get("http://"+HOST+"/consesionarios/ventas/"+aux.trim(), (data, status) => {
                setDataModal(data);
            });
            break;
        default :
            //Crear
            document.getElementById("tileModal").innerHTML = "Crear Registro Compra";
            document.getElementById("btnTitleModal").innerHTML = "Crear";
            document.getElementById("btnTitleModal").onclick = crearRegistro;
            break;
    }
}

function setDataModal (data) {
    var idAutoInput = document.getElementById("id_auto");
    var nombreInput = document.getElementById("nombre");
    var apellidoInput = document.getElementById("apellido");
    var colorInput = document.getElementById("color");
    var anioInput = document.getElementById("anio_Modelo");
    var serialInput = document.getElementById("serial");
    var precioInput = document.getElementById("precio");

    idAutoInput.value = data.ID;
    nombreInput.value = data.nombre;
    apellidoInput.value = data.apellido;
    colorInput.value = data.color;
    anioInput.value = data.anio_Modelo;
    serialInput.value = data.serial;
    precioInput.value = data.precio;

}

function editarAuto() {
    var idAutoInput = document.getElementById("id_auto").value;
    var nombreInput = document.getElementById("nombre").value;
    var apellidoInput = document.getElementById("apellido").value;
    var colorInput = document.getElementById("color").value;
    var anioInput = document.getElementById("anio_Modelo").value;
    var serialInput = document.getElementById("serial").value;
    var precioInput = document.getElementById("precio").value;
    var obj = {
        "ID" : idAutoInput,
        "anio_Modelo" : parseInt(anioInput),
        "apellido" : apellidoInput,
        "color" : colorInput,
        "nombre" : nombreInput,
        "precio" : parseInt(precioInput),
        "serial" : serialInput
    }

    RequestJSON("PUT",obj, function(res){
        //console.log("Success 2: ", res);
        loadData();
        document.getElementById("cerrarModal").click();
    });

    //putJSON();
    
}

function crearRegistro() {

    var nombreInput = document.getElementById("nombre").value;
    var apellidoInput = document.getElementById("apellido").value;
    var colorInput = document.getElementById("color").value;
    var anioInput = document.getElementById("anio_Modelo").value;
    var serialInput = document.getElementById("serial").value;
    var precioInput = document.getElementById("precio").value;
    var obj = {
        "anio_Modelo" : parseInt(anioInput),
        "apellido" : apellidoInput,
        "color" : colorInput,
        "nombre" : nombreInput,
        "precio" : parseInt(precioInput),
        "serial" : serialInput
    }

    RequestJSON("POST",obj, function(res){
        console.log("Success 2: ", res);
        loadData();
        document.getElementById("cerrarModal").click();
    });

    //putJSON();
    
}

function deleteConfirm(id, method, nombre, apellido) {
    
    msg = "Estas seguro que quieres eliminar el registro de: " + nombre + " " + apellido;
    if (confirm(msg) == true){
        RequestJSON(method, {"ID":id}, function (res) {
            alert("Registro eliminado con exito");
            loadData();
        })
    }

}

async function RequestJSON(method, data, callBack) {
    var endPoint = "";
    switch (method) {
        case "PUT":
            endPoint = "http://" + HOST + "/consesionarios/ventas/" + data.ID.trim();
            break;
        case "DELETE":
            endPoint = "http://" + HOST + "/consesionarios/ventas/" + data.ID.trim();
            break;
        default:
            endPoint = "http://"+HOST+"/consesionarios/ventas";
            break;
    }

    try{
        const response = await fetch(endPoint, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        //console.log("Success: ", result);
        callBack();
    } catch (error) {
        console.log("Error: ", error);
        callBack({"Error: ":"Falla de servicio"});
    }
}

function caragarDataAutosget(data){

    var item = '<tr>' +
                    '<td>{{Nombre}}</td>' +
                    '<td>{{Apellido}}</td>' +
                    '<td>{{Color}}</td>' +
                    '<td>{{Anio_Modelo}}</td>' +
                    '<td>{{Serial}}</td>' +
                    '<td>{{Precio}}</td>' +
                    '<td>' +
                        '<a href="#" class="edit" title="Edit" data-toggle="modal" data-target="#editAutos" onclick="setSelection(\' {{ID}} \',\'Edit\')"><i class="material-icons">&#xE254;</i></a>' +
                        '<a href="#" class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons" onclick="deleteConfirm(\' {{ID}} \',\'DELETE\',\'{{Nombre}}\',\'{{Apellido}}\')">&#xE872;</i></a>' +
                    '</td>' +
                '</tr>';
    var objArray=[];
    data.value.forEach(element => {
        let aux = item;
        aux = aux.replaceAll("{{ID}}", element.ID);
        aux = aux.replaceAll("{{Nombre}}", element.nombre);
        aux = aux.replaceAll("{{Apellido}}", element.apellido);
        aux = aux.replace("{{Color}}", element.color);
        aux = aux.replace("{{Anio_Modelo}}", element.anio_Modelo);
        aux = aux.replace("{{Serial}}", element.serial);
        aux = aux.replace("{{Precio}}", element.precio);
        objArray.push(aux);
    });
    document.getElementById("dataCarro").innerHTML = objArray.join("");

}