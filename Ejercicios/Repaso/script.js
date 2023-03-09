const API_KEY = "da12212ead1beccb613b39afd1a62880";
const TRENDING_MOVIES_URL = "trending/movie/week";
const API_BASE_URL = `https://api.themoviedb.org/3/${TRENDING_MOVIES_URL}?api_key=${API_KEY}`;
var Peliculas = [];

window.onload = Empezar;

function Empezar(){

    document.getElementById("Carga").addEventListener("click", CargarBD);
    document.getElementById("Carga_Fetch").addEventListener("click", Cargarfetch)
    document.getElementById("Guardar").addEventListener("click", Guardar_Fav)
    document.getElementById("Guardar_Fetch").addEventListener("click", Guardar_Fav_Fetch)
    document.getElementById("Obtener").addEventListener("click", Cargar_Fav)
    document.getElementById("Limpiar").addEventListener("click", Limpiar)

    
}

function CargarBD(){
    console.log("Cargar BD")

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {

        if (xhr.readyState === 4 && xhr.status === 200) {

            let Json = JSON.parse(xhr.responseText)

            let Datos = Json.results
            

            CrearTabla(Datos)

        }

    }

    xhr.open("GET", API_BASE_URL);
    xhr.send();

};

function Cargarfetch(){

    fetch(API_BASE_URL)
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((Datos) => {
      CrearTabla(Datos.results);
    })
    .catch((err) => {
      console.log(err);
    });

}

function CrearTabla(Datos){

    console.log("crear tabla")

    let Div = document.getElementById("div");
    Div.innerHTML = "";
    
    let tabla = document.createElement("table")
    tabla.id="tabla";

    tabla.setAttribute("style","border: 1px solid black;")

    let tr = document.createElement("tr")

    let titulos = [
        "Id",
        "Original_title",
        "Overview",
        "original_language",
        "release_date",
        "vote_average",
        "poster_path",
        "Favorito"
      ];

      for (let i = 0; i < titulos.length; i++) {
        let td = document.createElement("td");
        td.textContent = titulos[i];
        td.setAttribute("style", "border: 1px solid black");
        tr.appendChild(td);
      }
      tabla.appendChild(tr)

      console.log(Datos.length)

      for (let i = 0; i < Datos.length; i++) {
        let pelicula = Datos[i];
    
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let td4 = document.createElement("td");
        let td5 = document.createElement("td");
        let td6 = document.createElement("td");
        let td7 = document.createElement("td");
        let td8 = document.createElement("td");

        td1.textContent = pelicula.id;
        td2.textContent = pelicula.original_title
        td3.textContent = pelicula.overview
        td4.textContent = pelicula.original_language
        td5.textContent = pelicula.release_date
        td6.textContent = pelicula.vote_average

        let tdimg = document.createElement("img");
        tdimg.setAttribute(
          "src",
          "https://image.tmdb.org/t/p/w500/" + pelicula.poster_path
        );
        td7.appendChild(tdimg);

        let tdinput = document.createElement("input");
        tdinput.type = "checkbox";
        tdinput.id = i + 1;
        td8.appendChild(tdinput);

        td1.setAttribute("style", "border: 1px solid black");
        td2.setAttribute("style", "border: 1px solid black");
        td3.setAttribute("style", "border: 1px solid black");
        td4.setAttribute("style", "border: 1px solid black");
        td5.setAttribute("style", "border: 1px solid black");
        td6.setAttribute("style", "border: 1px solid black");
        td7.setAttribute("style", "border: 1px solid black");
        td8.setAttribute("style", "border: 1px solid black");

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
        tr.appendChild(td8);

        tabla.appendChild(tr);
      }

      Div.appendChild(tabla)
}

function Guardar_Fav(){
    console.log("Guardar_Fav")

    let subida = Comprobar_Checks();
    console.log(subida)
    console.log("subida")

    xhr = new XMLHttpRequest();
    xhr.open("POST", "save_movies.php");
    xhr.setRequestHeader("Content-type", "application/json");
    let peliculas_json = JSON.stringify(subida);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("onreadystatechange")
      } else {
        //console.log('Error')
      }
  };
  xhr.send(peliculas_json);

}

function Guardar_Fav_Fetch(){
  console.log("Guardar fav fetch")
  let subida = Comprobar_Checks();

  fetch("save_movies.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subida),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })

}

function Comprobar_Checks(){
  console.log("Comprobar Checks")

  let enviar = [];

  let tabla = document.getElementById("tabla")

  for(let i = 1; i<tabla.children.length; i++){

    let check = tabla.children[i].lastChild.firstChild.checked;

    
    if(check){
      
      let objeto = tabla.children[i];

      let Objeto_subir = {
        id: objeto.children[0].textContent,
        original_title: objeto.children[1].textContent,
        overview: objeto.children[2].textContent,
        original_language: objeto.children[3].textContent,
        release_date: objeto.children[4].textContent,
        vote_average: objeto.children[5].textContent,
        poster_path: objeto.children[6].firstChild.src
      }
      console.log(Objeto_subir)
      enviar.push(Objeto_subir)
    }

  }
  console.log(enviar)
  return enviar;
}

function Cargar_Fav(){
    console.log("Cargar Fav")

    fetch("get_favs.php")
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((Peliculas) => {
        console.log(Peliculas)
        CrearTabla_BD(Peliculas);
      })
      .catch((err) => {
        console.log(err);
      });
}

function CrearTabla_BD(Datos){


  console.log("crear tabla desde bd")

  let Div = document.getElementById("div");
  Div.innerHTML = "";
  
  let tabla = document.createElement("table")
  tabla.id="tabla";

  tabla.setAttribute("style","border: 1px solid black;")

  let tr = document.createElement("tr")

  let titulos = [
      "Id",
      "Original_title",
      "Overview",
      "original_language",
      "release_date",
      "vote_average",
      "poster_path",
      "Favorito"
    ];

    for (let i = 0; i < titulos.length; i++) {
      let td = document.createElement("td");
      td.textContent = titulos[i];
      td.setAttribute("style", "border: 1px solid black");
      tr.appendChild(td);
    }
    tabla.appendChild(tr)

    console.log(Datos.length)

    for (let i = 0; i < Datos.length; i++) {
      let pelicula = Datos[i];
  
      let tr = document.createElement("tr");
      let td1 = document.createElement("td");
      let td2 = document.createElement("td");
      let td3 = document.createElement("td");
      let td4 = document.createElement("td");
      let td5 = document.createElement("td");
      let td6 = document.createElement("td");
      let td7 = document.createElement("td");
      let td8 = document.createElement("td");

      td1.textContent = pelicula.id;
      td2.textContent = pelicula.original_title
      td3.textContent = pelicula.overview
      td4.textContent = pelicula.original_language
      td5.textContent = pelicula.release_date
      td6.textContent = pelicula.vote_average

      let tdimg = document.createElement("img");
      tdimg.setAttribute(
        "src",
        "https://image.tmdb.org/t/p/w500/" + pelicula.poster_path
      );
      td7.appendChild(tdimg);

      let tdinput = document.createElement("input");
      tdinput.type = "checkbox";
      tdinput.id = i + 1;
      td8.appendChild(tdinput);

      td1.setAttribute("style", "border: 1px solid black");
      td2.setAttribute("style", "border: 1px solid black");
      td3.setAttribute("style", "border: 1px solid black");
      td4.setAttribute("style", "border: 1px solid black");
      td5.setAttribute("style", "border: 1px solid black");
      td6.setAttribute("style", "border: 1px solid black");
      td7.setAttribute("style", "border: 1px solid black");
      td8.setAttribute("style", "border: 1px solid black");

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);
      tr.appendChild(td7);
      tr.appendChild(td8);

      tabla.appendChild(tr);
    }

    Div.appendChild(tabla)
}

function Limpiar(){
    console.log("Limpiar")

    document.getElementById("div").innerHTML = "";
}

