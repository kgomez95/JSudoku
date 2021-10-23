/*!
 * JSudoku v0.1
 *
 * Autor: Kevin Gómez Codina
 * Date: 2021-10-23T10:00Z
 */
"use strict";

var JSudoku = (function () {
    var _this = undefined,
        _x = 9,
        _y = 9,
        _rowValues = [1, 2, 3, 4, 5, 6, 7, 8, 9],
        _domId = "";

    /**
     * @name JSudoku
     * @description Crea una partida para jugar a sudoku.
     * @param domId - Identificador del contenedor div del DOM donde se mostrará el sudoku.
     */
    function JSudoku(domId) {
        // Variables privadas.
        _this = this;
        _domId = domId;

        // Variables públicas.
        _this.board = new Array(_x);

        // Inicializamos el tablero.
        initBoard();

        return _this;
    }

    /**
     * @name newGame
     * @description Inicializa el juego.
     */
    JSudoku.prototype.newGame = function () {
        var mainElement = getMainDOM(true);
        var container = document.createElement("div");
        var span = document.createElement("span");
        var easyButton = document.createElement("button");
        var normalButton = document.createElement("button");
        var hardButton = document.createElement("button");

        span.appendChild(document.createTextNode("Selecciona la dificultad:"));
        easyButton.appendChild(document.createTextNode("Fácil"));
        normalButton.appendChild(document.createTextNode("Normal"));
        hardButton.appendChild(document.createTextNode("Difícil"));

        easyButton.onclick = startEasyGame;
        normalButton.onclick = startNormalGame;
        hardButton.onclick = startHardGame;

        container.appendChild(span);
        container.appendChild(easyButton);
        container.appendChild(normalButton);
        container.appendChild(hardButton);

        mainElement.appendChild(container);
    };

    /**
     * @name startEasyGame
     * @description Inicializa una partida en modo fácil.
     */
    function startEasyGame() {
        var board = copyBoard(3);

        initBoard();
        createBoardView(board);
    }

    /**
     * @name startNormalGame
     * @description Inicializa una partida en modo normal.
     */
    function startNormalGame() {
        var board = copyBoard(4);

        initBoard();
        createBoardView(board);
    }

    /**
     * @name startHardGame
     * @description Inicializa una partida en modo normal.
     */
    function startHardGame() {
        var board = copyBoard(6);

        initBoard();
        createBoardView(board);
    }

    /**
     * @name getMainDOM
     * @param empty - Vacía el elemento antes de devolverlo.
     * @returns Retorna el elemento contenedor DOM de JSudoku.
     */
    function getMainDOM(empty) {
        var mainElement = document.getElementById(_domId);
        mainElement.classList.add("jsudoku-board");
        if (empty) mainElement.innerHTML = "";
        return mainElement;
    }

    /**
     * @name copyBoard
     * @description Hace una copia del tablero y le quita tantos elementos a la fila como se indique en el parámetro "exclude".
     * @param exclude - Indica el total de elementos a excluir en la fila.
     * @returns Retorna la copia del tablero modificada.
     */
    function copyBoard(exclude) {
        var board = _this.board.slice();

        if (exclude < 0) exclude = 0;
        else if (exclude > _y) exclude = _y;

        for (var x = 0; x < _x; x++) {
            var random = new Array(exclude);

            for (var i = 0; i < exclude; i++) {
                random.push(Math.floor(Math.random() * _y));
            }

            random.forEach(function (y) {
                board[x][y] = "";
            });
        }

        return board;
    }

    /**
     * @name initBoard
     * @description Inicializa los valores del tablero.
     */
    function initBoard() {
        // Inicializamos las posiciones del tablero.
        for (var i = 0; i < _x; i++) {
            _this.board[i] = new Array(_y);
        }

        // Inicializamos los valores del tablero.
        var isValid = true;
        for (var x = 0; x < _x; (isValid) ? x++ : x = x) {
            // Valores disponibles para la fila.
            var rowValues = _rowValues.slice();

            // Inicializamos la fila del tablero en caso de que el valor no sea válido.
            if (!isValid) _this.board[x] = new Array(_y);

            for (var y = 0; y < _y; (isValid) ? y++ : y = _y) {
                var index = 0;
                var value = 0;
                var attempts = 0;
                isValid = false;

                do {
                    // Cogemos un elemento aleatorio de la lista de valores disponibles de la fila.
                    index = Math.floor(Math.random() * rowValues.length);
                    value = rowValues[index];

                    // Comprobamos si ya existe el valor en la columna actual (Y). No hace falta que comprobamos la fila (X), porque como estamos usando la lista "rowValues"
                    // sabemos con certeza que nunca que repetirán los valores en la fila, ya que cuando insertamos un valor lo eliminamos de la lista "rowValues".
                    isValid = !_this.board.some(function (xValue) {
                        return xValue.some(function (yValue, i) {
                            return i === y && yValue == value;
                        });
                    });

                    if (isValid) {
                        // TODO: Hay que mejorar la validación. No puede haber el mismo número dentro del grupo de 3x3 celdas.

                    }

                    // Aumentamos el contador de intentos.
                    attempts++;

                    // Si el valor no es válido se volverá a coger otro valor disponible (así hasta un máximo de 20 intentos). Si llegamos a los 20 intentos y todavía no hemos
                    // conseguido un valor válido, significa que esta fila no tiene un orden correcto en los valores y saldremos del bucle, pero sin introducir ningún valor.
                } while (!isValid && attempts < 20);

                if (isValid) {
                    // Si el valor a introducir es válido lo quitamos de la lista de valores disponibles y lo añadimos al tablero.
                    rowValues.splice(index, 1);
                    _this.board[x][y] = value;
                }
            }
        }
    }

    /**
     * @name createBoardView
     * @description Crea el tablero en pantalla.
     * @param board - Tablero a mostrar en pantalla.
     */
    function createBoardView(board) {
        // Busca el elemento contenedor principal, le asigna la clase del tablero y lo vacía.
        var mainElement = getMainDOM(true);

        for (var x = 0; x < 3; x++) {
            // Creamos la fila y le asignamos la clase.
            var boardXElement = document.createElement("div");
            boardXElement.classList.add("jsudoku-x");

            for (var y = 0; y < 3; y++) {
                // Creamos la columna y le asignamos la clase.
                var boardYElement = document.createElement("div");
                boardYElement.classList.add("jsudoku-y");

                for (var i = 0; i < _rowValues.length; i++) {
                    // Creamos las nueve celdas en la columna.
                    var xPos = 0,
                        yPos = 0,
                        yCellElement = document.createElement("div");
                    yCellElement.classList.add("jsudoku-y-cell");

                    // Calculamos las posiciones para saber a qué posición del array pertenece cada celda.
                    if (i < 3) {
                        xPos = ((x * 2) + x);
                        yPos = ((y * 3) + i);
                    }
                    else if (i < 6) {
                        xPos = ((x * 3) + 1);
                        yPos = ((y * 3) - 3 + i);
                    }
                    else {
                        xPos = ((x * 3) + 2);
                        yPos = ((y * 3) - 6 + i);
                    }

                    // Añadimos los atributos a la celda.
                    yCellElement.setAttribute("x", xPos);
                    yCellElement.setAttribute("y", yPos);

                    // Mostramos el valor en la celda.
                    yCellElement.appendChild(document.createTextNode(board[xPos][yPos]));

                    // Añadimos la celda a la columna.
                    boardYElement.appendChild(yCellElement);
                }

                // Añadimos la columna a la fila.
                boardXElement.appendChild(boardYElement);
            }

            // Añadimos la fila al contenedor principal.
            mainElement.appendChild(boardXElement);
        }
    }

    return JSudoku;
})();
