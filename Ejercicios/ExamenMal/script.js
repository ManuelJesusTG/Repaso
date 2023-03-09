const API_KEY = "da12212ead1beccb613b39afd1a62880";
const TRENDING_MOVIES_URL = "trending/movie/week";
const API_BASE_URL = `https://api.themoviedb.org/3/${TRENDING_MOVIES_URL}?api_key=${API_KEY}`;

var pelicula;

window.onload = () =>
{

    document.getElementById("Get_movie").addEventListener("click",Generar_movie())

    document.getElementById("Subir_BD").addEventListener("click",Subir_BD())


}

function Generar_movie(){

    console.log("Generar pelicula")

    var xhr = new XMLHttpRequest;

    xhr.onreadystatechange = () => {
        console.log("onreadystatechange")
    
    if(xhr.readyState === 4 && xhr.status === 200) {
        pelicula = JSON.parse(xhr.responseText)
        console.log(pelicula)
        console.log(xhr.responseText)
        crear_pelicula(pelicula)
    }
}

    xhr.open("GET", API_BASE_URL);
    xhr.send()
}

function crear_pelicula(pelicula){

    console.log("Creacion tabla")

    const div = document.getElementById("div")

    const tabla = document.createElement("table")
    const img = document.createElement("img")
    img.src = ` https://image.tmdb.org/t/p/w500/${pelicula.poster_path}`
    const list = document.createElement("ul")

    const id = document.createElement("li")
    id.innerHTML = `ID: ${pelicula.id}`

    const titulo = document.createElement("li")
    titulo.innerHTML += `titulo: ${pelicula.title}`
    list.appendChild(titulo)
    const overview = document.createElement("li")
    overview.innerHTML += `overview: ${pelicula.overview}`
    list.appendChild(overview)
    const original_lng = document.createElement("li")
    original_lng.innerHTML += `Lenguaje original: ${pelicula.original_language}`
    list.appendChild(original_lng)
    const fav = document.createElement("img")
    fav.src = "heart_border.png"
    
    tabla.appendChild(img)
    tabla.appendChild(list)
    tabla.appendChild(fav)

    div.appendChild(tabla)

}


function Subir_BD(){

    console.log("Favoritos")

    fetch(API_BASE_URL, {
        method: "POST",
        body: JSON.stringify(pelicula),
        })
        .then((response) => {
            if (response.ok) {
            return response.json();
            }
        })
        .then((pelicula) => {
            console.log(pelicula);
        })
        .catch((err) => console.log(err));
    }

    function Limpiar_fichas(){

        document.getElementById("div").innerHTML=""
    
    }