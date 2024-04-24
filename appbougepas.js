// On sélectionne l'élément HTML avec l'ID "gameBoard" et on le stocke dans la constante "world"
const world = document.querySelector('#gameBoard');
// On obtient le contexte de dessin 2D de l'élément "world" et on le stocke dans la constante "c"
const c = world.getContext('2d');
// On définit la largeur du canvas "world" en fonction de sa largeur actuelle dans le navigateur
world.width = world.clientWidth;
// On définit la hauteur du canvas "world" en fonction de sa hauteur actuelle dans le navigateur
world.height = world.clientHeight;
// On initialise le score du jeu à 0 et on le stocke dans la variable "score" (l'utilisation de "let" serait plus appropriée ici)
var score = 0;

let isPaused = false;
let isPlay = false;


//TODO TIME 

//let startTime = Date.now();
// Tableau pour stocker les missiles du joueur
let missiles ;
// Tableau pour stocker les missiles des aliens
let alienMissiles;
//Tableau pour stocker les grilles d'aliens
let grids;
//Objet représentant le joueur
let player; 
// Tableau pour stocker les particules d'effets visuels
let particules;
// Nombre de vies du joueur
let lifes = 3;
// On initialise le nombre d'images par seconde (FPS) à 0 et on le stocke dans la variable "frames"
let frames=0;
// On crée un objet "keys" pour stocker l'état des touches du clavier (pressées ou non)
const keys = {
    // La propriété "ArrowLeft" indique si la flèche gauche est pressée (false par défaut)
    ArrowLeft:{pressed:false},
    // La propriété "ArrowRight" indique si la flèche droite est pressée (false par défaut)
    ArrowRight:{pressed:false},
    //La propriété "fired" indique si une action de tir a été déclenchée (false par défaut)
    fired:{ pressed:false} ,
    //p:{ pressed:false}
}

/* TODO PAUSE
let gameState = {
    playerPosition: player.position,
    enemyPositions: grids.map(grid => grid.invaders.map(invader => invader.position)),
    missilePositions: missiles.map(missile => missile.position),
    score: 0, // Assuming you have a score variable
  };

*/   
class Player{
     // Définition de la vitesse du joueur
    constructor(){
        this.velocity={
            // Vitesse de déplacement sur l'axe des X
            x:0,
            // Vitesse de déplacement sur l'axe des Y
            y:0 
        }
        // Chargement de l'image du vaisseau
        const image= new Image();
        image.src = './space.png';
        image.onload =()=>{
            // Affectation de l'image et de ses dimensions au joueur
            this.image = image;
            // Largeur du vaisseau
            this.width=48; 
            // Hauteur du vaisseau
            this.height=48; 
            // Définition de la position initiale du joueur
            this.position={
                // Position sur l'axe des x
                x:world.width/2 - this.width/2,
                // Position sur l'axe des y
                y:world.height - this.height -10 // Position sur l'axe des Y
            }
           
        }
    }

    // Fonction pour dessiner le Player
    draw(){
        c.drawImage(this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    // Fonction pour tirer un missile
    shoot(){
        missiles.push(new Missile({
            position:{
                // Position X du missile au centre du joueur
                x:this.position.x + this.width/2,
                // Position Y du missile alignée avec le joueur
                y:this.position.y
            },
            
        }));
    }
  
   // Méthode pour mettre à jour le joueur
   update(){
        // S'assurer que l'image est chargée avant de dessiner
        if(this.image){
            if(keys.ArrowLeft.pressed && this.position.x >=0){
            // Déplacement vers la gauche
            this.velocity.x = -5;
        }
        else if(keys.ArrowRight.pressed && this.position.x <= world.width - this.width){
            // Déplacement vers la droite
            this.velocity.x = 5;
        }
        // Pas de pression sur les touches, vitesse horizontale nulle
        else{this.velocity.x =0;}
        // Pas de pression sur les touches, vitesse horizontale nulle
        this.position.x += this.velocity.x;
        // Dessiner le joueur à sa nouvelle position
        this.draw();
        }
    }
}

class Alien{ 
    // Constructeur de la classe Alien
    constructor({position}){
        // Vitesse initiale de l'alien
        this.velocity={x:0, y:0 }
         // Angle initial de rotation
         this.angle = 0;
         // Rayon du cercle sur lequel les aliens se déplacent
         this.radius = 100;
        // Chargement de l'image de l'alien
        const image= new Image();
        image.src = './ghost.png';
        image.onload =()=>{
            this.image = image;
            // Largeur de l'alien
            this.width=32;
            // Hauteur de l'alien
            this.height=32  ;
            // Position initiale de l'alien
            this.position= {
                x:position.x,
                y:position.y
            }
        }
        
    }
    // Fonction pour dessiner l'alien
    draw(){
        if(this.image){
        c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height,);       
        }
    }

    update() {
        if (this.image) {
            // Mettre à jour l'angle de rotation
           // Redessiner l'alien à sa nouvelle position
            this.draw();
        }
    }
    // Méthode pour tirer un missile depuis l'alien
    shoot(alienMissiles){
        if(this.position){
            // Ajouter un nouvel objet AlienMissile
            alienMissiles.push(new alienMissile({
                position:{
                    // Position X du missile alignée avec l'alien
                    x:this.position.x,
                    // Position Y du missile en bas de l'alien
                    y:this.position.y
                },
                velocity:{
                    // Vitesse horizontale nulle
                    x:0,
                    // Vitesse verticale descendante
                    y:3
                }
            }))
        }
    }
}

class Missile{
    // Constructeur de la classe Missile
    constructor({position}){
        // Position initiale du missile
        this.position = position;
        // Vitesse du missile (déplacement vertical vers le haut)
        this.velocity ={x:0,y:-5} ;
        // Largeur du missile
        this.width = 3;
        // Hauteur du missile
        this.height =10;
    }
     // Fonction pour dessiner le missile
    draw(){
        // Enregistrer l'état actuel du contexte de dessin
        c.save();
        // Couleur du missile (rouge)
        c.fillStyle='red';
        // Dessiner le rectangle du missile
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
        // Effectuer le remplissage du rectangle en rouge
       c.fill()
       // Restaurer l'état précédent du contexte de dessin
    c.restore()
    }

    // Fonction pour mettre à jour le missile
    update(){
        // Mise à jour de la position verticale du missile (déplacement vers le haut)
        this.position.y += this.velocity.y;
        // Redessiner le missile à sa nouvelle position
        this.draw();
    }
} 
class Grid{
    // Constructeur de la classe Grid
    constructor(){
        // Position initiale de la grille d'aliens
        this.position={ x:0,y:0}
        // Vitesse de déplacement de la grille
        this.velocity={x:1,y:0}
        // Tableau pour stocker les aliens de la grille
        this.invaders = [ ]
        // Calculer le nombre de rangées et de colonnes d'aliens en fonction de la taille du canvas
        
        // Nombre de rangée
        let rows = Math.floor((world.height/34)*(1/5));
        // Nombre de colonnes
        const colums = Math.floor((world.width/34)*(2/5));
        //Hauteur totale de la grille
        this.height=rows*34;
        //Largeur totale de la grille 
        this.width = colums *34;

        // Remplir la grille d'aliens en utilisant des boucles imbriquées
        for (let x=0;x<colums;x++){
			for(let y =0;y<rows;y++){
                this.invaders.push(new Alien({
                    position:{
                        // Position horizontale de l'alien (basée sur la colonne)
                        x:x * 34,
                        // Position verticale de l'alien (basée sur la rangée)
                        y:y *34
                    }
                }))
            }
        }
    }

    // Fonction pour mettre à jour la grille
    update(){
        // Déplacer la grille horizontalement
        this.position.x += this.velocity.x;
        // Déplacer la grille verticalement (initialisé à 0)
        this.position.y += this.velocity.y;
        // Réinitialiser la vitesse verticale à 0 après un changement de direction
        this.velocity.y =0;
        
        // Inverser la direction horizontale si la grille atteint un bord du canvas
        if(this.position.x + this.width  >= world.width || this.position.x == 0){
            // Inverser la direction horizontale
            this.velocity.x = -this.velocity.x;
            // Déplacer la grille d'une rangée vers le bas
            this.velocity.y = 34;
        }
        
        
    }
}

class Particule{
    // Constructeur de la classe Particule
    constructor({position,velocity,radius,color}){
        // Position initiale de la particule
        this.position = position
        // Vitesse de la particule
        this.velocity = velocity
        // Rayon de la particule
        this.radius = radius
        // Couleur de la particule
        this.color = color
        // Opacité de la particule (transparence initiale)
        this.opacity = 1
    }
    // Méthode pour dessiner la particule
    draw(){
        // Enregistrer l'état actuel du contexte de dessin
        c.save();
        // Définir l'opacité de la particule
        c.globalAlpha = this.opacity; 
        // Débuter un nouveau tracé                       
        c.beginPath();
        // Définir la couleur de remplissage
        c.fillStyle=this.color;
         // Dessiner un cercle
        c.arc(this.position.x,this.position.y, this.radius,0,Math.PI *2)
        // Remplir le cercle avec la couleur définie
        c.fill()
        // Fermer le tracé
        c.closePath()
        // Restaurer l'état précédent du contexte de dessin
        c.restore();
    }

    // Fonction pour mettre à jour la particule
    update(){
            // Mettre à jour la position de la particule en fonction de sa vitesse

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Diminuer l'opacité de la particule
        if(this.opacity > 0){
            // Réduire l'opacité de 1%
            this.opacity -=0.01;
        }
        // Dessiner la particule à sa nouvelle position et opacité
        this.draw()
    }
 }

class alienMissile{
    // Constructeur de la classe AlienMissile
    constructor({position,velocity}){
        // Position initiale du missile alien
        this.position = position;
        // Vitesse du missile alien
        this.velocity = velocity;
        // Largeur/Hauteur du missile alien
        this.width = 3;
        this.height =10;
    }
    draw(){
        // Enregistrer l'état actuel du contexte de dessin
        c.save();
        // Couleur du missile (jaune)
        c.fillStyle='yellow';
         // Dessiner le rectangle du missile
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
        // Effectuer le remplissage du rectangle en jaune
        c.fill()
        // Restaurer l'état précédent du contexte de dessin
        c.restore()
    }

    // Fonction pour mettre à jour le missile alien
    update(){
        // Redessiner le missile à sa nouvelle position
        this.draw()
        // Mettre à jour la position horizontale
        this.position.x += this.velocity.x;
        // Mettre à jour la position verticale
        this.position.y += this.velocity.y;
    }
}

function drawScore() {
    c.font = "16px Arial";
    c.fillStyle = "white";
    c.fillText(`Score: ${score}`, 10, 20)
    }

function drawLifes() {
    c.font = "16px Arial";
    c.fillStyle = "white";
    c.fillText("Lives: "+lifes, world.width-65, 20);
    }

// Fonction pour détecter la collision entre l'alien et le joueur
const checkCollision = (alien, player) => {
    // Vérifiez si les coordonnées de l'alien et du joueur se chevauchent
    if (alien.position.x < player.position.x + player.width &&
        alien.position.x + alien.width > player.position.x &&
        alien.position.y < player.position.y + player.height &&
        alien.position.y + alien.height > player.position.y) {
        // Collision détectée, déclencher le game over
        gameOver();
    }
};
//TODO TIME
/*function drawTime() {
    var elapsedTime = Date.now() - startTime;
    var seconds = Math.floor(elapsedTime / 1000);
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Time: " + minutes + ":" + seconds, world.width - 275, 20);
    }*/

    
// Fonction d'initialisation du jeu
const init = () => {
    // Initialisation des variables
    // Initialiser le tableau de missiles du joueur vide
    missiles =[] ;
    // Initialiser le tableau de missiles des aliens vide
    alienMissiles= []; 
    // Initialiser le tableau de grilles avec une seule grille
    grids  = [new Grid()];
    // Créer un nouvel objet joueur
    player= new Player(); 
    // Initialiser le tableau de particules vide
    particules=[];
    // Définir le nombre de vies du joueur à 3
    lifes =3;

    
    //startTime = 0 ;

    //Touche non pressée
    keys.ArrowLeft.pressed = false;
    keys.ArrowRight.pressed = false;
    keys.fired.pressed = false;
    //keys.p.pressed = false;

}

// Appel de la fonction d'initialisation
init();
   

// Fonction d'animation principale du jeu
const animationLoop = () => {
    // Effacer le canevas avant chaque frame
    if (!isPaused) {
        c.clearRect(0, 0, world.width, world.height);
        player.update();
        requestAnimationFrame(animationLoop);
    }
    
    
    // Gérer les missiles du joueur
    missiles.forEach((missile,index) =>{
            // Si le missile est sorti de l'écran (en haut)
        if(missile.position.y + missile.height <=0) { 
            // Supprimer le missile après un délai de 0ms (immédiatement)
            setTimeout(() =>{
                missiles.splice(index,1)} 
				,0)}
                // Sinon, mettre à jour la position du missile
        else{
            missile.update();
        }
    }) 

    // Gérer les grilles d'aliens
    grids.forEach((grid,indexGrid) =>{
        // Mettre à jour la position et la direction de la grille
        grid.update();

        // Toutes les 50 frames
        if(frames %50 ===0 && grid.invaders.length >0){
            // Un alien tire un missile
            grid.invaders[Math.floor(Math.random()*(grid.invaders.length))].shoot(alienMissiles)
        }
         // Gérer chaque alien de la grille
        grid.invaders.forEach((invader,indexI)=>{
            // Mettre à jour la position de l'alien en fonction de la vitesse de la grille
            invader.update({velocity:grid.velocity});
            // Gérer les collisions entre les missiles du joueur et les aliens
            missiles.forEach((missile,indexM)=>{
                // Si le missile et l'alien se touchent
                if(missile.position.y  <=  invader.position.y + invader.height &&
                   missile.position.y  >=  invader.position.y  &&
                   missile.position.x + missile.width >= invader.position.x &&
                   missile.position.x - missile.width <= invader.position.x + invader.width){
                    // Créer des particules d'explosion
                    for (let i = 0; i < 12; i++) {
                        // Boucle pour créer 12 particules (Loop to create 12 particles)
                        particules.push(
                            new Particule({
                                // Propriétés de la particule (Particle properties)
                                position: {
                                    x: invader.position.x + invader.width / 2,
                                    y: invader.position.y + invader.height / 2,
                                },// Position initiale au centre de l'alien (Initial position at the center of the alien)
                                velocity: {
                                    x: (Math.random() - 0.5) * 2,
                                    y: (Math.random() - 0.5) * 2,
                                },
                                // Vitesse aléatoire pour simuler une explosion (Random velocity to simulate an explosion)
                                radius: Math.random() * 5 + 1,
                                // Taille aléatoire entre 1 et 6 (Random size between 1 and 6)
                                color: "red",// Couleur rouge pour l'explosion (Red color for the explosion)
                            })
                        )
                    }
                    score += 10 ;
                // Supprimer le missile et l'alien après un délai de 0ms (immédiatement)
                setTimeout(()=>{
                    grid.invaders.splice(indexI,1);
                    missiles.splice(indexM,1)
                    // Si tous les aliens de la grille sont détruits
                    if(grid.invaders.length === 0 && grids.length ==1 ){
                        // Supprimer la grille et en créer une nouvelle
                        grids.splice(indexGrid,1);
                        grids.push(new Grid());
                    }
                },0)
                }
            })
        })
      
    })

    // Gérer les missiles des aliens
    alienMissiles.forEach((alienMissile,index) =>{
        // Si le missile est sorti de l'écran (en bas)
        if(alienMissile.position.y + alienMissile.height >=world.height){ 
                // Supprimer le missile après un délai de 0ms (immédiatement)
                setTimeout(() =>{
                alienMissiles.splice(index,1)} ,0);
                    
            }
        else{
            // Sinon, mettre à jour la position du missile
            alienMissile.update();
        }
        // Gérer les collisions entre les missiles des aliens et le joueur
        if(alienMissile.position.y + alienMissile.height >= player.position.y  && 
             // Vérifier la collision entre le missile alien et le joueur (Check collision between alien missile and player)
             alienMissile.position.y  <= player.position.y +player.height  && 
             alienMissile.position.x  >= player.position.x  && 
             alienMissile.position.x + alienMissile.width <= player.position.x + player.width){
             // Collision détectée 
             // Supprimer le missile alien
             alienMissiles.splice(index,1);
                // Créer des particules d'explosion
                for(let i=0; i <22;i++){
                    particules.push(new Particule({
                        position:{
                            // Position initiale au centre du joueur
                            x:player.position.x + player.width/2,
                            y:player.position.y + player.height/2
                        },
                        // Vitesse aléatoire pour simuler une explosion
                        velocity:{x:(Math.random()-0.5)*2,y:(Math.random()-0.5)*2},
                        // Taille aléatoire entre 1 et 6 (Random size between 1 and 6)
                        radius:Math.random()*5,
                        // Couleur blanche pour l'explosion du joueur (White color for player's explosion)
                        color:'white'
                    }))
                }
                // Appeler la fonction pour gérer la perte de vie (Call function to handle losing a life)
                lostLife();
                 
            }
        }) 

        /* */

        // Gérer les particules (Handle particles)
        particules.forEach((particule, index) => {
            // Vérifier si la particule est transparente (Check if particle is transparent)
            if (particule.opacity <= 0) {
            particules.splice(index, 1); // Supprimer la particule (Remove particle)
            } else {
            particule.update(); // Mettre à jour la particule (Update particle)
            }
        }
    )

    
    
    //score caracteristique
    drawScore();
    drawLifes();
    //drawTime();


 // Incrémenter le compteur de frames
 frames++;
}
// Incrémenter le compteur de frames
animationLoop();

//Fonction pour gerer le Game Over
 const gameOver = () => {

    isPaused = true
    // Affiche un Game Over
    document.querySelector(".GameOver").style.display = "block";  
    // Reset le Game Over
    init();
  };

// Fonction pour gérer la perte de vie du joueur
const lostLife = () => {
    // Décrémenter le nombre de vies
    lifes--;
     // Si le joueur n'a plus de vie
  if (lifes <= 0) {
    // Afficher un message "Game Over"
    //alert("Game Over");

    //document.location.reload();
    gameOver();
    //clearInterval (Interval);

    // Réinitialiser le jeu
    init();
  }
}

// Ecouteur d'événement pour la touche pressée
addEventListener("keydown", (event) => {
    // Déterminer l'action en fonction de la touche pressée
    switch (event.key) {
      case "ArrowLeft":
        // Définir la touche gauche comme pressée
        keys.ArrowLeft.pressed = true;
        break;
      case "ArrowRight":
        // Définir la touche droite comme pressée
        keys.ArrowRight.pressed = true;
        break;
    }
})   
 
// Ecouteur d'événement pour la touche relâchée
addEventListener("keyup", (event) => {
    // Déterminer l'action en fonction de la touche relâchée
    switch (event.key) {
      case "ArrowLeft":
        // Définir la touche gauche comme relâchée
        keys.ArrowLeft.pressed = false;
        break;
      case "ArrowRight":
        // Définir la touche droite comme relâchée
        keys.ArrowRight.pressed = false;
        break;
      case " ":
        // Tirer un missile si la touche espace est pressée
        player.shoot();
        break;
    }
})
/*document.onkeypress = (e) = > {
    if(e.code == "Space") alert("pause")
   };
*/

/*addEventListener('keydown', (event) => {
  if (event.key === 'p') {
    isPaused = !isPaused;

    if(isPaused == true) {
        isPaused=true;
    }
    if(isPaused == false) {
        isPaused=false;
    }

  }
});*/

  addEventListener("keydown", (event) => {
    // Déterminer l'action en fonction de la touche relâchée
    switch (event.key) {
      case "p":
        // Définir la touche gauche comme relâchée
        isPaused= true;
        break;
    }
})
  addEventListener("keyup", (event) => {
    // Déterminer l'action en fonction de la touche relâchée
    switch (event.key) {
      case "p":
        // Définir la touche gauche comme relâchée
        isPaused = !isPaused;
        break;
    }
})
       
/*TODO PAUSE
addEventListener('keydown', (event) => {
    if (event.key === 'P') {
      if (!isPaused) {
        // Save game state
        gameState.playerPosition = player.position;
        gameState.enemyPositions = grids.map(grid => grid.invaders.map(invader => invader.position));
        gameState.missilePositions = missiles.map(missile => missile.position);
        gameState.score = score; // Assuming you have a score variable
        isPaused = true;
      } else {
        // Restore game state
        player.position = gameState.playerPosition;
        grids = grids.map(grid => {
          grid.invaders = grid.invaders.map(invader => {
            invader.position = gameState.enemyPositions[grid.invaders.indexOf(invader)];
            return invader;
          });
          return grid;
        });
        missiles = gameState.missilePositions.map(position => new Missile(position));
        score = gameState.score; // Assuming you have a score variable
        isPaused = false;
      }
    }
  });*/
  
 /* if (InputDeviceInfo.getkeydown('p'))
  {
    isPaused = !isPaused;

    if(isPaused == true) {
        isPaused=true;
    }
    if(isPaused == false) {
        isPaused=false;
    }
}*/


/*// Gérer la collision entre l'alien et le joueur
if (invader.position.y + invader.height >= player.position.y &&
    invader.position.y <= player.position.y + player.height &&
    invader.position.x >= player.position.x &&
    invader.position.x <= player.
)
gameOver();*/