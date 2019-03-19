/* Projet 1 : Projet Princesse

=================================================================================================

Étudiant 1 : Joey Van Melle
Matricule 1 : 20145502

Étudiant 2 : Moustapha Dienta
Matricule 2 : 20114124

=================================================================================================



 TABLE DES MATIÈRES==============================================================================
Partie 1 : Grilles
 	1.1. Construction de la grille multidimensionnelle
	1.2. Construction de la grille visible par le joueur (grille Codeboot)
	1.3. Ajout des murs

Partie 2 : Création et positionnement des personnages
	2.1. Trouver une case disponible
	2.2. Trouver toutes les cases disponibles
	2.3. Ajout des personnages

Partie 3 : Algorithme du chemin le plus court
	3.1. Les tableaux de mémoire
	3.2. Les fonctions de vérification
	3.3. La fonction de l'algorithme

Partie 4 : Programme

=================================================================================================
*/



/*===============================================================================================
PARTIE 1 : GRILLES
===============================================================================================*/

//1.1. Construction de la grille multidimensionnelle

var createGrid = function(l,h){
	var t = [];
	for(var y = 0; y< h; y++) {
		var row = [];
		for (var x = 0; x < l; x++){
			row[x] = "-";
		}
		t[y]= row;
	};
	return(t);
};



//1.2. Construction de la grille visible par le joueur (grille Codeboot)

var COLORS = {
  FREE_SLOT:  { r: 255, g: 255, b: 255 }, // White
  WALL:       { r: 133, g: 113, b:  94 }, // Brown
  PRINCESS:   { r: 197, g:  83, b: 218 }, // Purple
  KNIGHT:     { r: 213, g:  12, b:  12 }, // Red
  BLUE_PATH:  { r: 118, g: 183, b: 246 }, // Blue
  GREEN_PATH: { r:  42, g: 255, b:  28 }, // Green
};


var drawGrid = function(grid) {
	var l = grid[0].length;
	var h = grid.length;
	setScreenMode(grid[0].length, grid.length);

	for (var y = 0; y<h; y++) {
		for (var x = 0; x < l; x++){
		setPixel(x, y, COLORS.FREE_SLOT);
		};
	};
};



//1.3. Ajout des murs

var addRandomWalls = function(grid,d) {
	var l = grid[0].length;
	var h = grid.length;
	for (var y = 0; y<h; y++) {
		for (var x = 0; x < l; x++){
			var r = Math.random();
			if (d >= r && d != 0){
				setPixel(x, y, COLORS.WALL);
				grid[y][x] = "m";
			};
		};
	};
};




/*===============================================================================================
PARTIE 2 : Création et positionnement des personnages
===============================================================================================*/

//2.1. Trouver une case disponible


var findFreeSlot = function(grid) {
	var l = grid[0].length;
	var h = grid.length;
	var freeSlot = null;
	FindOneFreeSlot: for (var y = 0; y<h; y++) {
		for (var x = 0; x < l; x++){
			if (grid[y][x]=="-"){
				freeSlot= [x,y];
				break FindOneFreeSlot;
			};
		};
	};
	return(freeSlot);
};



//2.2. Trouver toutes les cases disponibles

var findEveryFreeSlots = function(grid) {
	var l = grid[0].length;
	var h = grid.length;
	var everyFreeSlots = [];
	var exist = findFreeSlot(grid);
	if (typeof(exist)!= "object"){
		everyFreeSlots = null;
	} else {
		for (var y = 0; y<h; y++) {
			for (var x = 0; x < l; x++){
				if (grid[y][x]=="-"){
					everyFreeSlots.push([x, y]);
				};
			};
		};	
	};
	return(everyFreeSlots);
};



//2.3. Ajout des personnages
var addKnight = function(grid){
	var possibilities = findEveryFreeSlots(grid);
	if (typeof(possibilities) != "object") {
		alert("RESTART PROGRAM");
	} else {
		var random = parseInt(Math.random()*(possibilities.length));
		var positionX = possibilities[random][0];
		var positionY = possibilities[random][1]
		setPixel(positionX, positionY, COLORS.KNIGHT);
				grid[positionY][positionX] = "c";

	};
};

var addPrincess = function(grid){
	var possibilities = findEveryFreeSlots(grid);
	if (typeof(possibilities) != "object") {
		alert("RESTART PROGRAM");
	} else {
		var random = parseInt(Math.random()*(possibilities.length));
		var positionX = possibilities[random][0];
		var positionY = possibilities[random][1]
		setPixel(positionX, positionY, COLORS.PRINCESS);
				grid[positionY][positionX] = "p";

	};
};

var addCharacters = function(grid){
	addKnight(grid);
	addPrincess(grid);
};




/*===============================================================================================
PARTIE 3 : Algorithme du chemin le plus court
===============================================================================================*/

//.3.1. Les tableaux de mémoires.

/* Les tableaux check, previousCheck et nextCheck sont des tableaux qui serviront de mémoire pour l'algorithme
du chemin le plus cour. Le tableau check contient toutes les coordonnées qui sont analysées par la fonction search (voir plus bas).
Ce tableau débutera toujours par la position de la princesse. Le tableau previousCheck contient toutes les coordonnées qui on déjà
étées analysées. Finalement, le tableau nextCheck représente toutes les coordonnées qui seront analysées lors du prochain tour de la
boucle qui se trouve dans la fonction findSOlution (voir plus bas).*/
check = [];
previousCheck = [];
nextCheck = [];

//3.2. Les fonctions de vérifications

/*La fonction includesForObjects retourne true si un array (inputArray) inclue un objet de longueur de 2 (isIncluded).
Sinon, elle retourne false.*/

var includesForObjects = function(inputArray, isIncluded) {
	for (var i = 0; i <inputArray.length; i++) {
		if(inputArray[i][0] == isIncluded[0] && inputArray[i][1] == isIncluded[1]){
			return(true);
		};
	};
	return(false);
};


//La fonction findPrincessPosition trouve la position de la princesse, vide le tableau check et y insère la position de la princesse.

var findPrincessPosition = function(inputGrid) {
	var l = inputGrid[0].length;
	var h = inputGrid.length;
	stop: for (var y = 0; y<h; y++) {
		for (var x = 0; x < l; x++){
			if (inputGrid[y][x]=="p"){
				check = [[x,y]];
				break stop;
			};
		};
	};
};


/*La fonction checkFunction vérifie si une coordonnée est la position du chevalier ou fait partie du chemin de plus court.
si ce n'est pas le cas, la coordonnée est ajoutée dans le tableau nextCheck.*/

var checkFunction = function(inputGrid, inputCoordinate){
    if (((inputGrid[inputCoordinate[1]][inputCoordinate[0]] == "c") 
        || (inputGrid[inputCoordinate[1]][inputCoordinate[0]] == "w")) 
        && (includesForObjects(previousCheck, inputCoordinate) == false)) {
            return(true);
    } else if ((inputGrid[inputCoordinate[1]][inputCoordinate[0]] == "-") 
        && ((includesForObjects(previousCheck, inputCoordinate) == false) 
        && (includesForObjects(nextCheck, inputCoordinate) == false))) {
            nextCheck.push([inputCoordinate[0], inputCoordinate[1]]);
    };
};


/* Les  fontions checkBottom, checkRight, checkTop et checkLeft appliquent la fonction checkFunction à toutes les coordonnées
appartenant à un tableau (inputArray)*/

var checkBottom = function(inputGrid, inputArray){
	for (var i = 0; i < inputArray.length; i++){
		if(inputArray[i][1]+1  < inputGrid.length){
			checkFunction(inputGrid, [inputArray[i][0], (inputArray[i][1])+1]);
			if (checkFunction(inputGrid, [inputArray[i][0], (inputArray[i][1])+1]) == true){
                inputGrid[inputArray[i][1]][inputArray[i][0]] = "w";
        		setPixel(inputArray[i][0], inputArray[i][1], COLORS.GREEN_PATH);
				return(true);
			};
        };
    };          
};

var checkRight = function(inputGrid, inputArray){
	for (var i = 0; i < inputArray.length; i++) {
	    if(inputArray[i][0]+1 < inputGrid[0].length) {
			checkFunction(inputGrid, [(inputArray[i][0])+1, inputArray[i][1]]);
		 	if (checkFunction(inputGrid, [inputArray[i][0]+1, (inputArray[i][1])]) == true) {
                inputGrid[inputArray[i][1]][inputArray[i][0]] = "w";
    			setPixel(inputArray[i][0], inputArray[i][1], COLORS.GREEN_PATH);
				return(true);
            };
	 	};
 	};
};

var checkTop = function(inputGrid, inputArray){
	for (var i = 0; i < inputArray.length; i++){
		if(inputArray[i][1]-1  >= 0){
			checkFunction(inputGrid, [inputArray[i][0], (inputArray[i][1])-1]);
			if (checkFunction(inputGrid, [inputArray[i][0], (inputArray[i][1])-1]) == true){
                inputGrid[inputArray[i][1]][inputArray[i][0]] = "w";
        		setPixel(inputArray[i][0], inputArray[i][1], COLORS.GREEN_PATH);
				return(true);
			};
		};
	}; 
};

var checkLeft = function(inputGrid, inputArray){
	for (var i = 0; i < inputArray.length; i++){
		if(inputArray[i][0]-1 >= 0){
			checkFunction(inputGrid, [(inputArray[i][0])-1, inputArray[i][1]]);
			if (checkFunction(inputGrid, [inputArray[i][0]-1, (inputArray[i][1])]) == true){
                inputGrid[inputArray[i][1]][inputArray[i][0]] = "w";
        		setPixel(inputArray[i][0], inputArray[i][1], COLORS.GREEN_PATH);
				return(true);
			};
		};
	};
};

/* La fonction search applique les 4 fonctions précédentes à un tableau (check). Lorsque la vérification est terminée, 
toutes les coordonées vérifiées sont envoyées dans le tableau previousCheck et de nouvelles coordonnées sont sélectionnées pour 
la prochaine vérification. */

var search = function(inputGrid, inputArray){
    search : {
        checkTop(inputGrid, inputArray);
        if (checkTop(inputGrid, inputArray) == true){
            return(true);
        };
        checkRight(inputGrid, inputArray);
        if (checkRight(inputGrid, inputArray) == true){
            return(true);
        };
        checkBottom(inputGrid, inputArray);
        if (checkBottom(inputGrid, inputArray) == true){
            return(true);
        };
        checkLeft(inputGrid, inputArray);
        if (checkLeft(inputGrid, inputArray) == true){
            return(true);
        };
        if (nextCheck.length == 0){
            return(-1);
        };
        previousCheck = previousCheck.concat(check);
                check = [];
        		check = check.concat(nextCheck);
                nextCheck = [];
        return(false);
  	 };
};

/* La fonction waySolved vérifie si la solution à été trouvée*/

var waySolved = function(inputGrid){
	var l = inputGrid[0].length;
	var h = inputGrid.length;
	var knightPosition = [];
	skip: for (var y = 0; y<h; y++) {
		for (var x = 0; x < l; x++){
			if (inputGrid[y][x]=="p"){
				knightPosition = [x, y];
				break skip;
			};
		};
	};
    if ((inputGrid.length > knightPosition[1]+1) 
        && ((inputGrid[knightPosition[1]+1][knightPosition[0]] == "w" )
        || (inputGrid[knightPosition[1]+1][knightPosition[0]] == "c"))) {
		    return(true);
    } else if (( 0 <= knightPosition[1]-1) 
        && ((inputGrid[knightPosition[1]-1][knightPosition[0]] == "w") 
        || (inputGrid[knightPosition[1]-1][knightPosition[0]] == "c"))) {
		    return(true);
    } else if ((inputGrid[0].length > knightPosition[0]+1) 
        && ((inputGrid[knightPosition[1]][knightPosition[0]+1] == "w") 
        || (inputGrid[knightPosition[1]][knightPosition[0]+1] == "c"))) {
		    return(true);
    } else if ((knightPosition[0]-1 >= 0) 
        && ((inputGrid[knightPosition[1]][knightPosition[0]-1] == "w") 
        || (inputGrid[knightPosition[1]][knightPosition[0]-1] == "c" ))) {
		    return(true);
	} else {
		return(false);
	};
};

//3.3. La fonction de l'algorithme

/* La fonction findSolution applique la fonction search jusqu'à ce que le chemin le plus court soit trouvé. Dans le cas où c'est impossible,
La fonction indique qu'il n'existe pas de solution. */

var findSolution = function(inputGrid){
	bigLoop: {
		while (waySolved(inputGrid) == false){
			check = [];
			previousCheck = [];
			nextCheck = [];
			findPrincessPosition(inputGrid);
			while (search(inputGrid, check) != true && search(inputGrid, check) != -1) {
				search(inputGrid, check); 
			};
			if (search(inputGrid, check) == true){
				continue;
			}
			if (search(inputGrid, check) == -1){
				print("Oh non! Quelle tragédie!");
				break bigLoop;
			};
		};
		print("La princesse est sauvée!")
	}
};

/*===============================================================================================
PARTIE 4 : Programme
===============================================================================================*/

// La fonction program permet d'utiliser le programme.
	
var program = function(l, h, d){
	grid = createGrid(l, h);
	drawGrid(grid);
	addRandomWalls(grid, d);
	addCharacters(grid);
	findSolution(grid);
};


