// URL del EndPoint de los integrantes - API
const API_URL = "https://retoolapi.dev/Iyex1b/data";
 
// Elementos del DOM
const modal = document.getElementById("mdAgregar");
const modalEditar = document.getElementById("mdEditar");
const btnAgregar = document.getElementById("BtnAgregar");
const btnCerrar = document.getElementById("btnCerrar");
const btnCerrarEditar = document.getElementById("btnCerrarEditar");
 
// Obtener integrantes al cargar la página
document.addEventListener('DOMContentLoaded', ObtenerDestinos);
 
// Función para obtener integrantes
async function ObtenerDestinos() {
    try {
        const respuesta = await fetch(API_URL);
        const data = await respuesta.json();
        MostrarDatos(data);
    } catch (error) {
        console.error("Error al obtener los destinos:", error);
        alert("Error al cargar los datos. Por favor recarga la página.");
    }
}
 
// Mostrar datos en la tabla
function MostrarDatos(datos) {
    const tabla = document.querySelector("#tabla tbody");
    tabla.innerHTML = "";
 
    datos.forEach(Destino => {
        tabla.innerHTML += `
        <tr>
            <td>${Destino.id}</td>
            <td>${Destino.Nombre}</td>
            <td>${Destino.Lugar}</td>
            <td>${Destino.Tipo}</td>
            <td>${Destino.Descripcion}</td>
            <td>
                    <button class="button button-edit" onclick="AbrirModalEditar('${Destino.id}', '${Destino.Nombre}', '${Destino.Lugar}', '${Destino.Tipo}', '${Destino.Descripcion}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="button button-delete" onclick="EliminarDestino(${Destino.id})">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </div>
            </td>
        </tr>
        `;
    });
}
 
// Eventos para el modal de agregar
btnAgregar.addEventListener("click", () => {
    modal.showModal();
});
 
btnCerrar.addEventListener("click", (e) => {
    e.preventDefault();
    modal.close();
});
 
// Eventos para el modal de editar
btnCerrarEditar.addEventListener("click", (e) => {
    e.preventDefault();
    modalEditar.close();
});
 
 
 
// Abrir modal de edición
function AbrirModalEditar(id, Nombre, Lugar, Tipo, Descripcion) {
    document.getElementById("txtIdEditar").value = id;
    document.getElementById("txtNombreEditar").value = Nombre;
    document.getElementById("txtLugarEditar").value = Lugar;
    document.getElementById("txtTipoEditar").value = Tipo;
    document.getElementById("txtDescripcionEditar").value = Descripcion;
    modalEditar.showModal();
}
 
//Agregar nuevio integrante desde el formulario
document.getElementById("frmAgregar").addEventListener("submit",async e =>{
    e.preventDefault(); // e Representa a submit. Evita que el formulario se envie solo.
 
    //Capturar los valores del formulario
    const Nombre = document.getElementById("txtNombre").value.trim();
    const Lugar = document.getElementById("txtLugar").value.trim();
    const Tipo = document.getElementById("txtTipo").value.trim();
    const Descripcion = document.getElementById("txtDescripcion").value.trim();
 
 
 
    //Validadcion basica
 
    if(!Nombre || !Lugar || !Tipo || !Descripcion){
        alert("Ingresar los valores correctamente");
        return; //Para evitar que el codigo se siga ejecutando
    }
 
    //Llamar a la API para enviar el registro
    const respuesta = await fetch(API_URL, {
        method: "POST", //Tipo de solicitud
        headers: {'Content-Type':'application/json'}, //Tipo de datos enviados
        body: JSON.stringify({Nombre,Lugar,Tipo,Descripcion})//Datos enviados
    });
 
    //Verificacion si la API rsponde que los datos fueron enviados correctamente
    if(respuesta.ok){
        alert("El registro fue agregado correctamente");
 
        //Limpiar el formulario
        document.getElementById("frmAgregar").reset();
 
        //Cerrar el modal (dialog)
        modal.close();
 
        //Recargar la tabla
        ObtenerDestinos();
    }else{
        //En caso de que la API no devuelva un codigo diferente a 200-299
        alert("El registro no pudo ser agregado");
    }
});
 
 
// Formulario para editar
document.getElementById("frmEditar").addEventListener("submit", async e => {
    e.preventDefault();
 
    const id = document.getElementById("txtIdEditar").value;
    const Nombre = document.getElementById("txtNombreEditar").value.trim();
    const Lugar = document.getElementById("txtLugarEditar").value.trim();
    const Tipo = document.getElementById("txtTipoEditar").value.trim();
    const Descripcion = document.getElementById("txtDescripcionEditar").value.trim();
 
    if (!id || !Nombre || !Lugar || !Tipo || !Descripcion ) {
        alert("Por favor complete todos los campos obligatorios");
        return;
    }
 
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({Nombre, Lugar, Tipo, Descripcion})
        });
 
        if (respuesta.ok) {
            alert("Registro actualizado correctamente");
            modalEditar.close();
            ObtenerDestinos();
        } else {
            throw new Error("Error en la respuesta del servidor");
        }
    } catch (error) {
        console.error("Error al actualizar:", error);
        alert("Error al actualizar el registro");
    }
});
 
// Eliminar integrante
async function EliminarDestino(id) {
    const confirmacion = confirm("¿Está seguro que desea eliminar este registro?");
 
    if (confirmacion) {
        try {
            const respuesta = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });
 
            if (respuesta.ok) {
                alert("Registro eliminado correctamente");
                ObtenerDestinos();
            } else {
                throw new Error("Error en la respuesta del servidor");
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("Error al eliminar el registro");
        }
    }
}
 