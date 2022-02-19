/*!
 * JSudoku v0.1
 *
 * Autor: Kevin Gómez Codina
 * Date: 2022-02-16T07:45Z
 */
//@ts-check
"use strict";

(function (w) {
    w.JSudoku = (function () {
        var Dom = (function () {
            return {
                /**
                 * @type {Element}
                 */
                container: undefined,
                /**
                 * @type {Element}
                 */
                table: undefined,

                /**
                 * @name initContainer
                 * @description Inicializa los elementos básicos del contenedor.
                 * @param {Element} container - Contenedor del juego.
                 */
                initContainer: function (container) {
                    if (this.container) return;

                    // Almacenamos el contanador.
                    this.container = container;

                    // Creamos el título del contenedor.
                    var h1 = w.document.createElement("h1");
                    h1.appendChild(w.document.createTextNode("JSudoku"));
                    
                    // Añadimos el título y la clase al contenedor.
                    this.container.classList.add("jsudoku");
                    this.container.appendChild(h1);

                    // Creamos la tabla y la añadimos al contenedor.
                    this.table = w.document.createElement("table");
                    this.container.appendChild(this.table);
                },

                /**
                 * @name paintBoard
                 * @description Pintamos el tablero proporcionado en pantalla.
                 * @param {Array<any>} boardGame - Tablero de juego.
                 */
                paintBoard: function (boardGame) {
                    var tbody = w.document.createElement("tbody");

                    for (var y = 0; y < boardGame.length; y++) {
                        var tr = w.document.createElement("tr");

                        for (var x = 0; x < boardGame[y].length; x++) {
                            var td = w.document.createElement("td");
                            var content = w.document.createElement("div");

                            // Creamos el contenido.
                            content.classList.add("content");
                            content.appendChild(w.document.createTextNode(boardGame[y][x]));

                            // Si la celda tiene valor entonces bloqueamos su contenido.
                            if (boardGame[y][x]) {
                                content.classList.add("blocked");
                            }

                            // Asignamos los separadores de grupo de celdas en caso de que sea necesario.
                            if (y > 0 && (y % 3) === 0) {
                                td.classList.add("t-separator");
                            }
                            if (x > 0 && (x % 3) === 0) {
                                td.classList.add("l-separator");
                            }

                            // Añadimos el contenido a la celda, y la celda a la fila.
                            td.appendChild(content);
                            tr.appendChild(td);
                        }

                        tbody.appendChild(tr);
                    }

                    this.table.innerHTML = "";
                    this.table.appendChild(tbody);
                }
            };
        })();
        
        function Sudoku(container) {
            if (!container)
                throw Error("JSudoku -> Es necesario proporcionar un contenedor DOM para inicializar el juego.");

            // Variables públicas.
            this.board = new Array(9);
            this.gameBoard = new Array(9);

            // Inicializamos los elementos del DOM.
            Dom.initContainer(container);
        };

        /**
         * @name createBoard
         * @description Crea un tablero 9x9.
         */
        Sudoku.prototype.createBoard = function () {
            var that = this;

            /**
             * @name isValidCol
             * @description Comprueba si ya existe el valor proporcionado en la columna proporcionada.
             * @param {number} x - Columna a comprobar.
             * @param {number} value - Columna a comprobar.
             * @returns {boolean} Retorna "true" si el valor no existe en la columna o "false" en caso de que el valor exista en la columna.
             */
            function isValidCol(x, value) {
                for (var y = 0; y < that.board.length; y++) {
                    if (that.board[y][x] === value) {
                        return false;
                    }
                }

                return true;
            };

            /**
             * @name isValidRow
             * @description Comprueba si ya existe el valor proporcionado en la fila proporcionada.
             * @param {number} y - Fila a comprobar.
             * @param {number} value - Valor a comprobar.
             * @returns {boolean} Retorna "true" si el valor no existe en la fila o "false" en caso de que el valor exista en la fila.
             */
            function isValidRow(y, value) {
                for (var x = 0; x < that.board[y].length; x++) {
                    if (that.board[y][x] === value) {
                        return false;
                    }
                }

                return true;
            };

            /**
             * @name buildGroupCells
             * @description Añade los números a un grupo de celdas 3x3.
             * @param {number} xStart - Inicio de la posición de la columna.
             * @param {number} xEnd - Fin de la posición de la columna.
             * @param {number} yStart - Inicio de la posición de la fila.
             * @param {number} yEnd - Fin de la posición de la fila.
             * @returns {boolean} Devuelve "true" si ha sido posible rellenar el grupo de celdas o "false" en caso de que se hayan acabado los intentos.
             */
            function buildGroupCells(xStart, xEnd, yStart, yEnd) {
                var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                var tries = 20;

                for (var y = yStart; y < yEnd; y++) {
                    for (var x = xStart; x < xEnd; x++) {
                        // Generamos un índice aleatorio para coger el número a especificar.
                        var index = Math.floor(Math.random() * numbers.length);
                        var number = numbers[index];
    
                        if (isValidCol(x, number) && isValidRow(y, number)) {
                            // Si el número no se encuentra en la fila ni en la columna lo asignamos, lo borramos del listado de valores a especificar
                            // y reiniciamos el contador de intentos.
                            that.board[y][x] = number;
                            that.gameBoard[y][x] = number;
                            numbers.splice(index, 1);
                            tries = 20;
                        }
                        else {
                            // Restamos la columna para volver a intentar asignar un número a dicha columna y restamos los intentos.
                            x--;
                            tries--;

                            if (tries < 0) {
                                return false;
                            }
                        }
                    }
                }

                return true;
            };

            /**
             * @name clearCols
             * @description Inicializa las columnas del rango de filas especificado por parámetros.
             * @param {number} yStart - Inicio del rango de las filas a limpiar.
             * @param {number} yEnd - Fin del rango de las filas a limpiar.
             */
            function clearCols(yStart, yEnd) {
                for (var y = yStart; y < yEnd; y++) {
                    that.board[y] = new Array(9);
                    that.gameBoard[y] = new Array(9);
                }
            };

            // Inicializamos el tablero.
            that.board = new Array(9);
            that.gameBoard = new Array(9);
            for (var y = 0; y < that.board.length; y++) {
                that.board[y] = new Array(9);
                that.gameBoard[y] = new Array(9);
            }

            // Rellenamos el tablero con los números.
            for (var y = 0; y < that.board.length; y = y + 3) {
                for (var x = 0; x < that.board[y].length; x = x + 3) {
                    var isValid = buildGroupCells(x, x + 3, y, y + 3);
                    if (!isValid) {
                        clearCols(y, y + 3);
                        x = -3;
                    }
                }
            }
        };

        /**
         * @name emptyGameBoard
         * @description Vacía la cantidad de celdas recibidas por parámetros del tablero de juego.
         * @param {number} amountToEmpty - Cantidad de celdas a vaciar.
         */
        Sudoku.prototype.emptyGameBoard = function (amountToEmpty) {
            for (var i = 0; i < amountToEmpty; i++) {
                // Generamos una posición aleatoria en el tablero.
                var x = Math.floor(Math.random() * 9);
                var y = Math.floor(Math.random() * 9);

                if (this.gameBoard[y][x]) {
                    // Si la celda tiene valor se lo quitamos.
                    this.gameBoard[y][x] = "";
                }
                else {
                    // Si la celda no tiene valor volvemos a buscar otra celda.
                    i--;
                }
            }
        };

        /**
         * @name newGame
         * @description Crea la instancia de juego con la dificultad proporcionada.
         * @param {number} difficulty - Dificultad de la partida.
         */
        Sudoku.prototype.newGame = function (difficulty) {
            // Creamos el tablero de juego.
            this.createBoard();

            // Vaciamos el tablero de juego dependiendo de la dificultad seleccionada.
            switch (difficulty) {
                // Fácil.
                case 0:
                    this.emptyGameBoard(40);
                    break;
                // Normal.
                case 1:
                    this.emptyGameBoard(50);
                    break;
                // Difícil.
                case 2:
                    this.emptyGameBoard(60);
                    break;
                default:
                    throw Error("JSudoku -> Es necesario que especifique una dificultad válida para poder jugar.");
            }

            // TODO: Pintar el tablero.
            Dom.paintBoard(this.gameBoard);
        };
    
        return Sudoku;
    })();
})(window);