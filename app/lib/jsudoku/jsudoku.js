/*!
 * JSudoku v0.1
 *
 * Autor: Kevin Gómez Codina
 * 
 * Date: 2021-10-23T10:00Z
 */
"use strict";

var JSudoku = (function () {
    var _x = 9,
        _y = 9,
        _rowValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    /**
     * @name JSudoku
     * @description Crea una partida para jugar a sudoku.
     */
    function JSudoku() {
        var _this = this;
        _this.board = new Array(_x);

        // Inicializamos el tablero.
        _this.initBoard();

        return _this;
    }

    /**
     * @name initBoard
     * @description Inicializa los valores del tablero.
     */
    JSudoku.prototype.initBoard = function () {
        // Inicializamos las posiciones del tablero.
        for (var i = 0; i < _x; i++) {
            this.board[i] = new Array(_y);
        }

        // Inicializamos los valores del tablero.
        var isValid = true;
        for (var x = 0; x < _x; (isValid) ? x++ : x = x) {
            // Valores disponibles para la fila.
            var rowValues = _rowValues.slice();

            // Inicializamos la fila del tablero en caso de que el valor no sea válido.
            if (!isValid) this.board[x] = new Array(_y);

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
                    isValid = !this.board.some(function (xValue) {
                        return xValue.some(function (yValue, i) {
                            return i === y && yValue == value;
                        });
                    });

                    // Aumentamos el contador de intentos.
                    attempts++;

                    // Si el valor no es válido se volverá a coger otro valor disponible (así hasta un máximo de 20 intentos). Si llegamos a los 20 intentos y todavía no hemos
                    // conseguido un valor válido, significa que esta fila no tiene un orden correcto en los valores y saldremos del bucle, pero sin introducir ningún valor.
                } while (!isValid && attempts < 20);

                if (isValid) {
                    // Si el valor a introducir es válido lo quitamos de la lista de valores disponibles y lo añadimos al tablero.
                    rowValues.splice(index, 1);
                    this.board[x][y] = value;
                }
            }
        }
    };

    return JSudoku;
})();
