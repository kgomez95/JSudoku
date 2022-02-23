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
                 * @type {Sudoku}
                 */
                sudoku: undefined,
                /**
                 * @type {Element}
                 */
                container: undefined,
                /**
                 * @type {Element}
                 */
                table: undefined,
                /**
                 * @type {Element}
                 */
                tableValues: undefined,
                /**
                 * @type {Element}
                 */
                selectedCell: undefined,
                /**
                 * @type {Element}
                 */
                inputValue: undefined,

                /**
                 * @name initContainer
                 * @description Inicializa los elementos básicos del contenedor.
                 * @param {Sudoku} sudoku - Instancia del juego.
                 * @param {Element} container - Contenedor del juego.
                 */
                initContainer: function (sudoku, container) {
                    if (this.container) return;

                    // Almacenamos el contenedor y la instancia del juego.
                    this.container = container;
                    this.sudoku = sudoku;

                    // Creamos el título del contenedor.
                    var titleContainer = w.document.createElement("div");
                    var h1 = w.document.createElement("h1");
                    titleContainer.classList.add("title");
                    h1.appendChild(w.document.createTextNode("JSudoku"));
                    titleContainer.appendChild(h1);

                    // Añadimos el título y la clase al contenedor.
                    this.container.classList.add("jsudoku");
                    this.container.appendChild(titleContainer);

                    // TODO: Crear el menú superior del juego.

                    // Creamos la tabla y la añadimos al contenedor.
                    this.table = w.document.createElement("table");
                    this.container.appendChild(this.table);

                    // Inicializamos la tabla de valores.
                    Dom.paintTableValues();

                    // Creamos el input oculto para leer los valores del teclado.
                    this.inputValue = w.document.createElement("input");
                    this.inputValue.setAttribute("type", "text");
                    this.inputValue.classList.add("hidden");
                    this.container.appendChild(this.inputValue);

                    // Inicializamos los eventos de la tabla.
                    Dom.createSelectEvent();
                    Dom.createValueEvent();
                },

                paintTableValues: function () {
                    this.tableValues = w.document.createElement("table");
                    var tr = w.document.createElement("tr");

                    for (var i = 0; i < 10; i++) {
                        var td = w.document.createElement("td");
                        var contentValues = w.document.createElement("div");
                        var value = (i > 0) ? i.toString() : "";

                        // Creamos el contenido.
                        contentValues.classList.add("content-values");
                        contentValues.setAttribute("data-value", value);
                        contentValues.appendChild(w.document.createTextNode(value));

                        // Añadimos el contenido a la celda, y la celda a la fila.
                        td.classList.add("td-values");
                        td.appendChild(contentValues);
                        tr.appendChild(td);
                    }

                    this.tableValues.classList.add("table-values");
                    this.tableValues.appendChild(tr);
                    this.container.appendChild(this.tableValues);
                },

                /**
                 * @name paintBoard
                 * @description Pintamos el tablero proporcionado en pantalla.
                 * @param {Array<any>} boardGame - Tablero de juego.
                 */
                paintBoard: function (boardGame) {
                    var tbody = w.document.createElement("tbody");
                    var groupY = 0;

                    /**
                     * @name createNote
                     * @description Crea un contenedor nota con el número especificado.
                     * @param {number} value - Número a especificar en el contenedor nota.
                     * @returns {Element} Retorna el contenedor nota con el número asignado.
                     */
                    function createNote(value) {
                        var div = w.document.createElement("div");
                        div.setAttribute("data-value", value.toString());
                        div.style.display = "none";
                        div.classList.add("note" + value);
                        div.appendChild(w.document.createTextNode(value.toString()));
                        return div;
                    };

                    for (var y = 0; y < boardGame.length; y++) {
                        var tr = w.document.createElement("tr");
                        var groupX = 0;

                        if (y > 0 && (y % 3) === 0) {
                            groupY += 3;
                        }

                        for (var x = 0; x < boardGame[y].length; x++) {
                            var td = w.document.createElement("td");
                            var content = w.document.createElement("div");

                            if ((x % 3) === 0) {
                                groupX++;
                            }

                            // Creamos el contenido.
                            content.classList.add("content");
                            var span = w.document.createElement("span");
                            span.appendChild(w.document.createTextNode(boardGame[y][x]));
                            content.appendChild(span);
                            content.setAttribute("data-x", x.toString());
                            content.setAttribute("data-y", y.toString());
                            content.setAttribute("data-group", (groupY + groupX).toString());
                            content.setAttribute("data-value", boardGame[y][x]);

                            // Si la celda tiene valor entonces bloqueamos su contenido.
                            if (boardGame[y][x]) {
                                content.classList.add("blocked");
                            }
                            else {
                                var contentNotes = w.document.createElement("div");

                                // Asignamos la clase al contenedor de notas.
                                contentNotes.classList.add("content-notes");

                                // Creamos los elementos en el contenedor de notas.
                                for (var i = 1; i <= 9; i++) {
                                    contentNotes.appendChild(createNote(i));
                                }

                                // Ocultamos el contenedor de notas y lo añadimos al contenedor del contenido.
                                contentNotes.style.display = "none";
                                content.appendChild(contentNotes);
                            }

                            // Asignamos los separadores de grupo de celdas en caso de que sea necesario.
                            if (y > 0 && (y % 3) === 0) {
                                td.classList.add("t-separator");
                            }
                            if (x > 0 && (x % 3) === 0) {
                                td.classList.add("l-separator");
                            }

                            // Añadimos el contenido, y la celda a la fila.
                            td.appendChild(content);
                            tr.appendChild(td);
                        }

                        tbody.appendChild(tr);
                    }

                    this.table.innerHTML = "";
                    this.table.appendChild(tbody);
                },

                /**
                 * @name createSelectEvent
                 * @description Crea el evento para seleccionar las celdas del tablero.
                 */
                createSelectEvent: function () {
                    var that = this;

                    /**
                     * @type {NodeList}
                     */
                    var selectedGroup = undefined;
                    /**
                     * @type {NodeList}
                     */
                    var selectedValues = undefined;

                    /**
                     * @name selectGroup
                     * @description Selecciona las celdas de grupo marcadas. 
                     */
                    function selectGroup() {
                        if (!selectedGroup) return;

                        for (var i = 0; i < selectedGroup.length; i++) {
                            if (that.selectedCell !== selectedGroup[i]) {
                                selectedGroup[i].classList.add("selected-group");
                            }
                        }
                    };

                    /**
                     * @name deselectGroup
                     * @description Deselecciona las celdas de grupo marcadas. 
                     */
                    function deselectGroup() {
                        if (!selectedGroup) return;

                        for (var i = 0; i < selectedGroup.length; i++) {
                            if (that.selectedCell !== selectedGroup[i]) {
                                selectedGroup[i].classList.remove("selected-group");
                            }
                        }
                    };

                    /**
                     * @name selectValues
                     * @description Selecciona las celdas de valores marcadas. 
                     */
                    function selectValues() {
                        if (!selectedValues) return;

                        for (var i = 0; i < selectedValues.length; i++) {
                            if (that.selectedCell !== selectedValues[i]) {
                                selectedValues[i].classList.add("selected-values");
                            }
                        }
                    };

                    /**
                     * @name deselectValues
                     * @description Deselecciona las celdas de valores marcadas. 
                     */
                    function deselectValues() {
                        if (!selectedValues) return;

                        for (var i = 0; i < selectedValues.length; i++) {
                            if (that.selectedCell !== selectedValues[i]) {
                                selectedValues[i].classList.remove("selected-values");
                            }
                        }
                    };

                    // Evento click.
                    this.table.addEventListener("click", function (event) {
                        if (that.selectedCell && that.selectedCell !== event.target) {
                            // Deseleccionamos la celda anterior y su grupo de celdas.
                            that.selectedCell.classList.remove("selected");
                            deselectGroup();

                        }

                        // Deseleccionamos sus celdas con el mismo valor.
                        deselectValues();

                        // Guardamos la referencia del elemento seleccionado y vaciamos las celdas grupo seleccionadas.
                        that.selectedCell = event.target;
                        selectedGroup = undefined;
                        selectedValues = undefined;

                        if (that.selectedCell.className.indexOf("content") === -1) {
                            // Si no seleccionamos el contenido cogemos el elemento padre.
                            that.selectedCell = that.selectedCell.parentElement;

                            if (that.selectedCell.className.indexOf("content-notes") > -1) {
                                // Si la celda tiene la clase "content-notes" necesitamos coger el padre del elemento padre para coger el contenido.
                                that.selectedCell = that.selectedCell.parentElement;
                            }
                        }
                        else if (that.selectedCell.className.indexOf("content-notes") > -1) {
                            // Si la celda tiene la clase "content-notes" necesitamos coger el padre del elemento padre para coger el contenido.
                            that.selectedCell = that.selectedCell.parentElement;
                        }

                        // Si no hay contenido salimos del evento.
                        if (that.selectedCell.className.indexOf("content") === -1) return;

                        // Marcamos el elemento como seleccionado el elemento.
                        that.selectedCell.classList.add("selected");

                        // Cogemos los elementos del grupo, de la fila, de la columna y los seleccionamos.
                        var group = that.selectedCell.getAttribute("data-group");
                        var x = that.selectedCell.getAttribute("data-x");
                        var y = that.selectedCell.getAttribute("data-y");
                        selectedGroup = w.document.querySelectorAll("[data-group='" + group + "'], [data-x='" + x + "'], [data-y='" + y + "']");
                        selectGroup();

                        // Cogemos los elementos que tengan el mismo valor que la celda seleccionada y los seleccionamos.
                        var value = that.selectedCell.getAttribute("data-value");
                        selectedValues = w.document.querySelectorAll("[data-value='" + value + "']");
                        selectValues();

                        // Nos posicionamos en el input oculto para leer los valores del teclado.
                        that.inputValue.focus();
                    });
                },

                /**
                 * @name createValueEvent
                 * @description Crea el evento para asignar valores al tablero.
                 */
                createValueEvent: function () {
                    var that = this;

                    // TODO: Permitir asignar valores y notas con el teclado numérico.

                    function event(value) {
                        // Si no hay celda seleccionada o si la celda seleccionada está bloqueada entonces salimos del evento.
                        if (!that.selectedCell || that.selectedCell.className.indexOf("blocked") > -1) return;

                        if (!that.selectedCell.children[0].style.display && that.selectedCell.getAttribute("data-value") != value) {
                            // Asignamos el valor a la celda.
                            that.selectedCell.setAttribute("data-value", value);
                            that.selectedCell.children[0].innerHTML = value;
                            that.setGameBoardValue(value);

                            // Comprobamos el tablero de juego para ver si se puede finalizar la partida.
                            that.checkGameBoard();
                        }
                        else {
                            var hideNotes = false;

                            // Si el valor de la celda está visible y se vuelve a seleccionar el mismo valor mostramos el contenedor de notas.
                            if (!that.selectedCell.children[0].style.display && that.selectedCell.getAttribute("data-value") == value) {
                                that.selectedCell.children[0].style.display = "none";
                                that.selectedCell.children[1].style.display = "";
                            }

                            if (!that.selectedCell.children[1].style.display) {
                                var note = that.selectedCell.children[1].querySelector("[data-value='" + value + "']");

                                if (note) {
                                    // Cambiamos la visibilidad de la nota.
                                    note.style.display = (!note.style.display) ? "none" : "";

                                    // Si no hay notas entonces volvemos a mostrar el contenido de la celda.
                                    hideNotes = w.Array.prototype.slice.call(that.selectedCell.children[1].children).filter(function (x) {
                                        return !x.style.display;
                                    }).length === 0;
                                }
                                else {
                                    // Si se borra la nota entonces volvemos a mostrar el contenido de la celda y ocultamos las notas.
                                    hideNotes = true;
                                }
                            }

                            if (hideNotes) {
                                // Ocultamos las notas y mostramos el contenido de la celda.
                                that.selectedCell.children[1].style.display = "none";
                                that.selectedCell.children[0].style.display = "";

                                // Ocultamos todas las notas de la celda.
                                for (var i = 0; i < that.selectedCell.children[1].children.length; i++) {
                                    that.selectedCell.children[1].children[i].style.display = "none";
                                }
                            }

                            // Quitamos el valor a la celda.
                            that.selectedCell.setAttribute("data-value", "");
                            that.selectedCell.children[0].innerHTML = "";

                            // Especificamos la nota en el tablero de juego.
                            that.setGameBoardNote(value);
                        }

                        // Volvemos a hacer clic en la celda.
                        that.selectedCell.click();
                    };

                    // Creamos el evento click para la tabla de valores.
                    this.tableValues.addEventListener("click", function (e) {
                        event(e.target.getAttribute("data-value"));
                    });

                    // Creamos el evento keyup para asignar un valor por teclado.
                    this.inputValue.addEventListener("keyup", function (e) {
                        // Obtenemos la tecla presionada.
                        var key = e.key.toLowerCase();

                        if (key.indexOf("del") > -1 || key.indexOf("back") > -1 || key === "0") {
                            // Ejecutamos el evento si se presiona suprimir, retroceso o 0.
                            event("");
                        }
                        else if (!w.isNaN(w.parseInt(key))) {
                            // Ejecutamos el evento si se presiona un número entre 1 y 9.
                            switch (key) {
                                case "1":
                                case "2":
                                case "3":
                                case "4":
                                case "5":
                                case "6":
                                case "7":
                                case "8":
                                case "9":
                                    event(key);
                                    break;
                            }
                        }
                        else {
                            // TODO: Si el usuario presiona las flechas del teclado se debería poder mover entre las celdas del tablero.
                        }

                        // Borramos el valor del input.
                        this.value = "";
                    });
                },

                /**
                 * @name setGameBoardValue
                 * @description Especifica el valor proporcionado en el tablero de juego.
                 * @param {string} value - Valor a especificar en el tablero.
                 */
                setGameBoardValue: function (value) {
                    // Si no hay celda seleccionada no hacemos nada.
                    if (!this.selectedCell) return;

                    // Obtenemos las coordenadas de la celda y le especificamos el valor.
                    var x = w.parseInt(this.selectedCell.getAttribute("data-x"));
                    var y = w.parseInt(this.selectedCell.getAttribute("data-y"));
                    this.sudoku.gameBoard[y][x] = value;
                },

                /**
                 * @name setGameBoardNote
                 * @description Especifica la nota proporcionada en el tablero de juego.
                 * @param {string} note - Nota a especificar en el tablero.
                 */
                setGameBoardNote: function (note) {
                    // Si no hay celda seleccionada no hacemos nada.
                    if (!this.selectedCell) return;

                    // Parseamos la nota para ver si es un número o no.
                    var noteValue = w.parseInt(note);

                    // Obtenemos las coordenadas de la celda.
                    var x = w.parseInt(this.selectedCell.getAttribute("data-x"));
                    var y = w.parseInt(this.selectedCell.getAttribute("data-y"));

                    if (w.isNaN(noteValue)) {
                        // Si la nota no es numérica vaciamos la celda.
                        this.sudoku.gameBoard[y][x] = "";
                    }
                    else {
                        // Si la nota es numérica, creamos un array en la celda en el caso de que no haya uno ya creado.
                        if (!w.Array.isArray(this.sudoku.gameBoard[y][x])) {
                            this.sudoku.gameBoard[y][x] = [];
                        }

                        var index = this.sudoku.gameBoard[y][x].indexOf(noteValue);

                        if (index === -1) {
                            // Si la nota no existe la añadimos.
                            this.sudoku.gameBoard[y][x].push(noteValue);
                        }
                        else {
                            // Si la nota ya existe la eliminamos.
                            this.sudoku.gameBoard[y][x].splice(index, 1);
                        }
                    }
                },

                /**
                 * @name checkGameBoard
                 * @description Comprueba si el tablero de juego es correcto para poder finalizar la partida.
                 */
                checkGameBoard: function () {
                    if (this.sudoku.isGameBoardCleared()) {
                        // TODO: Finalizar la partida.
                        // TODO: Parar el contador en el caso de que esté activo.
                    }
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
            Dom.initContainer(this, container);
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

            Dom.paintBoard(this.gameBoard);
        };

        /**
         * @name isGameBoardCleared
         * @description Comprueba si el tablero de juego está correcto.
         * @returns {boolean} Retorna "true" si el tablero de juego está correcto o "false" en caso de que no lo esté.
         */
        Sudoku.prototype.isGameBoardCleared = function () {
            for (var y = 0; y < this.board.length; y++) {
                for (var x = 0; x < this.board[y].length; x++) {
                    var value = w.parseInt(this.gameBoard[y][x]);

                    if (w.Array.isArray(this.gameBoard[y][x]) || w.isNaN(value) || this.board[y][x] !== value) {
                        return false;
                    }
                }
            }

            return true;
        };

        return Sudoku;
    })();
})(window);