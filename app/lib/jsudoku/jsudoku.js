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
            // TODO: Clase para administrar la parte visual.
            return {

            };
        })();
        
        function Sudoku(container) {
            // Clase para administrar el juego.
            this.board = new Array(9);
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
                }
            };

            // Inicializamos el tablero.
            that.board = new Array(9);
            for (var y = 0; y < that.board.length; y++) {
                that.board[y] = new Array(9);
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
    
        return Sudoku;
    })();
})(window);