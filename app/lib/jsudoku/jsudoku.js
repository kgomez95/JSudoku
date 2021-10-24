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
        _domId = "",
        _gameBoard = new Array(_x),
        _selectedCell = undefined;

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
        initBoard();
        createBoardView(copyBoard(3));
    }

    /**
     * @name startNormalGame
     * @description Inicializa una partida en modo normal.
     */
    function startNormalGame() {
        initBoard();
        createBoardView(copyBoard(4));
    }

    /**
     * @name startHardGame
     * @description Inicializa una partida en modo normal.
     */
    function startHardGame() {
        initBoard();
        createBoardView(copyBoard(6));
    }

    /**
     * @name getMainDOM
     * @param empty - Vacía el elemento antes de devolverlo.
     * @returns Retorna el elemento contenedor DOM de JSudoku.
     */
    function getMainDOM(empty) {
        var mainElement = document.getElementById(_domId);

        if (empty) {
            mainElement.innerHTML = "";

            var menuElement = document.createElement("div");
            var exitButton = document.createElement("button");
            exitButton.appendChild(document.createTextNode("Cerrar"));
            exitButton.onclick = _this.newGame;

            // TODO: Crear un botón para comprobar si el tablero es correcto.

            menuElement.appendChild(exitButton);
            mainElement.appendChild(menuElement);
        }

        return mainElement;
    }

    /**
     * @name cloneBoard
     * @returns Retorna una copia del tablero con sus valores.
     */
    function cloneBoard() {
        var rows = new Array(_x);
        for (var x = 0; x < _x; x++) {
            rows[x] = _this.board[x].slice();
        }
        return rows;
    }

    /**
     * @name copyBoard
     * @description Hace una copia del tablero y le quita tantos elementos a la fila como se indique en el parámetro "exclude".
     * @param exclude - Indica el total de elementos a excluir en la fila.
     * @returns Retorna la copia del tablero modificada.
     */
    function copyBoard(exclude) {
        var board = cloneBoard();

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

        // Guardamos el tablero copiado y lo retornamos.
        _gameBoard = board;
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
        var isValid = true,
            cellAttempts = 0;
        for (var x = 0; x < _x; x = initBoardIncreaseX(x, isValid, cellAttempts)) {
            // Valores disponibles para la fila.
            var rowValues = _rowValues.slice();

            // Inicializamos la fila del tablero en caso de que el valor no sea válido.
            if (!isValid) _this.board[x] = new Array(_y);

            for (var y = 0; y < _y; (isValid) ? y++ : y = _y) {
                var index = 0;
                var value = 0;
                var attempts = 0;
                isValid = false;

                // Inicializamos los intentos de comprobación en las celdas 3x3.
                cellAttempts = 0;

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
                        // Si no existe el valor en las celdas 3x3 entonces es válido.
                        isValid = !hasNumberCol(x, y, value);

                        if (!isValid) {
                            // Aumentamos el contedor de intentos de las celdas 3x3.
                            cellAttempts++;
                        }
                    }
                    else {
                        // Aumentamos el contador de intentos.
                        attempts++;
                    }

                    // Si el valor no es válido se volverá a coger otro valor disponible (así hasta un máximo de 20 intentos). Si llegamos a los 20 intentos y todavía no hemos
                    // conseguido un valor válido, significa que esta fila no tiene un orden correcto en los valores y saldremos del bucle, pero sin introducir ningún valor.
                } while (!isValid && attempts < 20 && cellAttempts < 20);

                if (isValid) {
                    // Si el valor a introducir es válido lo quitamos de la lista de valores disponibles y lo añadimos al tablero.
                    rowValues.splice(index, 1);
                    _this.board[x][y] = value;
                }
            }
        }
    }

    /**
     * @name initBoardIncreaseX
     * @description Incrementa el contador x, lo mantiene igual o lo decrementa dependiendo de si el valor de la celda es válido o no.
     * @param x - Contador actual.
     * @param isValid - Indica si el valor de la celda es válido a no.
     * @param cellAttempts - Intentos de poner el valor en el grupo de celdas 3x3.
     * @returns Retorna el contador x.
     */
    function initBoardIncreaseX(x, isValid, cellAttempts) {
        if (cellAttempts < 20) {
            return (isValid) ? ++x : x;
        }
        // NOTE: Si se han superado los intentos de celdas restablecemos el contador x dependiendo de la posición en la que se encuentre y restablecemos las celdas.
        else if (x < 3) {
            for (var i = 0; i <= x; i++) _this.board[i] = new Array(_y);
            return 0;
        }
        else if (x < 6) {
            for (var i = 3; i <= x; i++) _this.board[i] = new Array(_y);
            return 3;
        }
        else {
            for (var i = 6; i <= x; i++) _this.board[i] = new Array(_y);
            return 6;
        }
    }

    /**
     * @name hasNumberCol
     * @description Comprueba si el valor proporcionado se encuentra dentro de sus celdas 3x3.
     * @param xPos - Posición X actual.
     * @param yPos - Posición Y actual.
     * @param value - Valor a comprobar.
     * @returns Retorna "true" en caso de que el valor ya se encuentre dentro de las celdas 3x3 o "false" en caso de que todavía no esté.
     */
    function hasNumberCol(xPos, yPos, value) {
        var startX = 0,
            endX = 0,
            startY = 0,
            endY = 0,
            hasNumber = false;

        // Comprobamos la X.
        if (xPos < 3) {
            startX = 0;
            endX = 3;
        }
        else if (xPos < 6) {
            startX = 3;
            endX = 6;
        }
        else {
            startX = 6;
            endX = 9;
        }

        // Comprobamos la Y.
        if (yPos < 3) {
            startY = 0;
            endY = 3;
        }
        else if (yPos < 6) {
            startY = 3;
            endY = 6;
        }
        else {
            startY = 6;
            endY = 9;
        }

        // Comprobamos si el valor existe en el grupo de 3x3.
        for (; (startX < endX && !hasNumber); startX++) {
            for (var y = startY; (y < endY && !hasNumber); y++) {
                if (_this.board[startX][y] === value) {
                    hasNumber = true;
                }
            }
        }

        return hasNumber;
    }

    /**
     * @name createBoardView
     * @description Crea el tablero en pantalla.
     * @param board - Tablero a mostrar en pantalla.
     */
    function createBoardView(board) {
        // Busca el elemento contenedor principal, le asigna la clase del tablero y lo vacía.
        var mainElement = getMainDOM(true);
        var gameBoardElement = document.createElement("div");
        gameBoardElement.classList.add("jsudoku-board");

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

                    // Si la celda no contiene un número entonces es una celda modificable.
                    if (isNaN(parseInt(_gameBoard[xPos][yPos]))) {
                        yCellElement.onclick = selectCell;
                    }
                    else {
                        yCellElement.classList.add("disabled");
                    }

                    // Mostramos el valor en la celda.
                    yCellElement.appendChild(document.createTextNode(board[xPos][yPos]));

                    // Añadimos la celda a la columna.
                    boardYElement.appendChild(yCellElement);
                }

                // Añadimos la columna a la fila.
                boardXElement.appendChild(boardYElement);
            }

            // Añadimos la fila al contenedor del tablero.
            gameBoardElement.appendChild(boardXElement);
        }

        // Añadimos el contenedor del tablero al elemento principal.
        mainElement.appendChild(gameBoardElement);

        // Creamos el contenedor de opciones para asignar un valor a la celda seleccionada.
        var optionsContainer = document.createElement("div");
        optionsContainer.classList.add("jsudoku-options");

        for (var i = 0; i < _rowValues.length; i++) {
            var cell = document.createElement("div");
            cell.classList.add("jsudoku-options-cell");
            cell.appendChild(document.createTextNode(i + 1));
            cell.onclick = setCellValue;

            optionsContainer.appendChild(cell);
        }

        // Añadimos el contenedor de opciones al elemento principal.
        mainElement.appendChild(optionsContainer);
    }

    /**
     * @name selectCell
     * @description Función que se ejecuta al hacer clic en una celda del tablero de juego.
     */
    function selectCell() {
        if (_selectedCell) {
            _selectedCell.classList.remove("selected");
        }

        _selectedCell = this;
        _selectedCell.classList.add("selected");
    }

    /**
     * @name setCellValue
     * @description Función que se ejecuta al seleccionar una opción con la intención de asignar el valor a la celda seleccionada.
     */
    function setCellValue() {
        if (_selectedCell) {
            var x = _selectedCell.getAttribute("x"),
                y = _selectedCell.getAttribute("y");
            _gameBoard[x][y] = this.innerHTML;
            _selectedCell.innerHTML = this.innerHTML;
        }
    }

    return JSudoku;
})();
