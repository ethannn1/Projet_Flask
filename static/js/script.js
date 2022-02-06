// Initialisation de la canvas
const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")
canvas.width  = window.innerWidth
canvas.height = window.innerHeight*0.7
let rect = canvas.getBoundingClientRect();
let start = true 

function randint(max) {
    /* Permet de tirer un nombre aléatoire entre 0 et max */
    return Math.floor(Math.random() * max);
}

function endgame(){
    /* 
    Réinitialise la canvas et crée un texte de fin et un formulaire
    pour envoyer notre score
    */

    // Réinitialise la canvas
    context.fillStyle = "#f0f0f0"
    context.fillRect(0,0,canvas.width,canvas.height)

    // Crée le texte de fin
    let fin = document.createElement("a")
    fin.setAttribute("id","fin")
    fin.innerHTML = "Partie terminée !"
    document.getElementsByTagName("body")[0].appendChild(fin)

    // Crée le formulaire
    let form = document.createElement("form")
    form.setAttribute("id","envoie_score")
    form.setAttribute("method", "post")

    let username = document.createElement("input") // Champs de texte pour l'username
    username.setAttribute("placeholder", "Nom d'utilisateur")
    username.setAttribute("name","username")
    username.setAttribute("maxlength", 15)
    username.setAttribute("id","input_username")

    let submit = document.createElement("button") // Bouton pour envoyer le score
    submit.setAttribute("type", "submit")
    submit.setAttribute("name", "score")
    submit.setAttribute("value", score)
    submit.setAttribute("id","bouton_score")
    submit.innerHTML = "Envoyer le score"

    form.append(username)
    form.append(submit)
    document.getElementsByTagName("body")[0].appendChild(form)
}



function game(){

    if(start){ // Condition qui est validée qu'une fois, permet d'initialiser les variables globales.
        touched = true
        score = -1
        start_time = Date.now()
        start = false
        document.getElementById("commencer").remove()
    }

    time_remaining = 15 - Math.floor((Date.now() - start_time)/1000) //Calcul du temps restant
    // On met le score et le temps restant dans la page HTML
    document.getElementById("score").innerHTML = "Score: "+ score
    document.getElementById("temps_restant").innerHTML = "Temps restant: "+ time_remaining+" secondes."

    // fin de jeu si il n'y a plus le temps
    if (time_remaining<=0){
        endgame()
        return score
    }

    // On remet un carre si l'ancien a été touché 
    if (touched) {
        score++
        context.fillStyle = "#f0f0f0"
        context.fillRect(0, 0, canvas.width, canvas.height)
        coord_x = randint(canvas.width-50)
        coord_y = randint(canvas.height-50)
        context.fillStyle = "#cf1111"
        context.fillRect(coord_x,coord_y,50,50)
        touched = false
    }

    // Fonction que se déclanche quand on clique avec la souris sur la canvas.
    function mouse_clicked(evt){ 
        x = evt.clientX
        y = evt.clientY - rect.top

        if(coord_x<=x && x<=coord_x+50 && coord_y<=y && y<=coord_y+50){
            touched = true
        }
        else{
            has_missed = true
        }
    }
    // La fonction mouse_clicked() est appelée lorsqu'on clique sur la souris
    document.addEventListener('click',mouse_clicked)

    // On rappelle la fonction game() pour que le jeu continue
    window.requestAnimationFrame(game)
}
