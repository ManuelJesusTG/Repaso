let xhr;
let resultados = document.getElementById("resultados");
let estado;
window.onload = Sonoros;

function Sonoros() {
  document.getElementById("clean").addEventListener("click", BDclean);
  document.getElementById("charge").addEventListener("click", BDcharge);
  document.getElementById("save").addEventListener("click", BDsave);
  document.getElementById("rescue").addEventListener("click", BDrescue);
}

function BDclean() {
    console.log("Entrando en BDclean");
    let mensaje;

    if(estado == 1){
        mensaje = 'Datos limpiados con exito.';
        document.getElementById("tablita").innerHTML = "";
        estado = 0;
    }else if(estado == 2){
        mensaje = 'Datos limpiados con exito.';
        document.getElementById("padre").innerHTML = "";
        estado = 0; 
    } else{
        mensaje = 'No había datos que limpiar.';
    }
  resultados.innerHTML = mensaje;
}

function BDsave() {
  console.log("Entrando en BDsave");

  let personajes = recorrerTabla();

  xhr = new XMLHttpRequest();
  xhr.open("POST", "save_marvel_characters.php");
  xhr.setRequestHeader("Content-type", "application/json");
  let personajes_json = JSON.stringify(personajes);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      resultados.innerHTML = xhr.responseText;
    } else {
      //console.log('Error del servidor.')
    }
  };
  xhr.send(personajes_json);
}

function BDrescue() {
estado = 2;
  console.log("Entrando en BDrescue");
  fetch("get_marvel_characters.php")
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((personajes) => {
      resultados.innerHTML = "Datos con fetch cargados";
      Pintar_Tabla_DesdeBD(personajes);
    })
    .catch((err) => {
      resultados.innerHTML = err;
      console.log(err);
    });
}

function BDcharge() {
    estado = 1;
  console.log("Entrando en BDcharge");
  fetch("marvel.json")
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((personajes) => {
      resultados.innerHTML = "Datos con fetch cargados";
      Pintar_Tabla_EnBD(personajes.data.results);
    })
    .catch((err) => {
      resultados.innerHTML = err;
      console.log(err);
    });
}

//Esta función pinta la tabla con los datos recogidos desde la url o documento.
function Pintar_Tabla_EnBD(Personajes) {
  let div_tabla = document.getElementById("div_tabla");
  div_tabla.innerHTML = "";

  let tabla = document.createElement("table");
  tabla.id = "tablita";
  tabla.setAttribute(
    "style",
    "border: 2px solid black; border-collapse: collapse; text-align: center; margin:auto"
  );
  let tr = document.createElement("tr");

  // Generamos los títulos de la cabecera
  let rotulos = [
    "Nombre del personaje",
    "Imagen del personaje",
    "Modified",
    "Apariciones",
    "Identificador",
    "Guardar",
  ];

  for (let i = 0; i < rotulos.length; i++) {
    let celda = document.createElement("td");
    celda.textContent = rotulos[i];
    celda.setAttribute("style", "border: 1px solid black");
    tr.appendChild(celda);
  }
  tabla.appendChild(tr);

  for (let i = 0; i < Personajes.length; i++) {
    let personaje = Personajes[i];

    let tr = document.createElement("tr");
    let celda = document.createElement("td");
    let celda2 = document.createElement("td");
    let celda3 = document.createElement("td");
    let celda4 = document.createElement("td");
    let celda5 = document.createElement("td");
    let celda6 = document.createElement("td");

    celda.textContent = personaje.name;
    celda3.textContent = personaje.modified;
    let apariciones = [];

    for (let i = 0; i < personaje.comics.items.length; i++) {
      apariciones.push(personaje.comics.items[i].name);
    }
    celda4.textContent = apariciones;
    celda5.textContent = personaje.id;

    let celda2inner = document.createElement("img");
    celda2inner.setAttribute(
      "src",
      personaje.thumbnail.path + "." + personaje.thumbnail.extension
    );
    celda2.appendChild(celda2inner);

    let celda6inner = document.createElement("input");
    celda6inner.type = "checkbox";
    celda6inner.id = i + 1;
    celda6.appendChild(celda6inner);

    celda.setAttribute("style", "border: 1px solid black");
    celda2.setAttribute("style", "border: 1px solid black");
    celda3.setAttribute("style", "border: 1px solid black");
    celda4.setAttribute("style", "border: 1px solid black");
    celda5.setAttribute("style", "border: 1px solid black");
    celda6.setAttribute("style", "border: 1px solid black");

    tr.appendChild(celda);
    tr.appendChild(celda2);
    tr.appendChild(celda3);
    tr.appendChild(celda4);
    tr.appendChild(celda5);
    tr.appendChild(celda6);

    tabla.appendChild(tr);
  }
  div_tabla.appendChild(tabla);
}

//Esta función pinta cartas con los datos recogidos desde la base de datos.
function Pintar_Tabla_DesdeBD(Personajes) {
  let div_tabla = document.getElementById("div_tabla");
  div_tabla.innerHTML = "";

  let padre = document.createElement("div");
  padre.id = 'padre';

  for (let i = 0; i < Personajes.length; i++) {
    let personaje = Personajes[i];
    let tabla = document.createElement("div");
    tabla.className = 'card';
    tabla.setAttribute(
      "style",
      "width: 18rem"
    );

    let celda2inner = document.createElement("img");
    celda2inner.setAttribute("src", personaje.path);
    celda2inner.className = 'card-imp-top';
    tabla.appendChild(celda2inner);

    let datos = document.createElement("div");
    datos.className = 'card-text';

    let celda = document.createElement("p");
    celda.textContent = Personajes[i].id
    datos.appendChild(celda);
    let espacio1 = document.createElement('br');
    datos.appendChild(espacio1);

    let celda2 = document.createElement("p");
    celda2.textContent = Personajes[i].name
    datos.appendChild(celda2);
    let espacio2 = document.createElement('br');
    datos.appendChild(espacio2);

    let celda3 = document.createElement("p");
    celda3.textContent = Personajes[i].modified
    datos.appendChild(celda3);
    let espacio3 = document.createElement('br');
    datos.appendChild(espacio3);

    tabla.appendChild(datos);
    padre.appendChild(tabla);
  }
  div_tabla.appendChild(padre);
}

//Recorremos la tabla para verificar qué personajes se han marcado y que nos devuelva un array con estos.
function recorrerTabla() {
  let Tabla = document.getElementById("tablita");

  if (Tabla != null) {
    let enviados = [];

    if (
      Tabla.children[0].children.length == 6
    ) {
      for (let i = 1; i < Tabla.children.length; i++) {
        let prueba = Tabla.children[i].lastChild.firstChild.checked;

        if (prueba) {
          let objeto = Tabla.children[i];
          let objeto_final = {
            id: objeto.children[4].textContent,
            name: objeto.children[0].textContent,
            modified: objeto.children[2].textContent,
            path: objeto.children[1].firstChild.src,
          };
          enviados.push(objeto_final);
        }
      }

      if (enviados.length > 0) {
        return enviados;
      } else {
        console.log("¡Debes elegir al menos un personaje si quieres guardar!");
      }
    } else {
      console.log("Estás visualizando los personajes ya registrados");
      resultados.innerHTML = "Estás visualizando los personajes ya registrados";
    }
  } else {
    console.log("¡Debes generar una tabla y seleccionar personajes primero!");
  }
}
