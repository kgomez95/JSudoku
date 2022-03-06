/*!
 * JSudoku v0.9
 *
 * Autor: Kevin Gómez Codina
 * Date: 2022-03-06T09:43Z
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
                 * @type {Element}
                 */
                timer: undefined,
                popup: {
                    /**
                     * @type {Element}
                     */
                    container: undefined,
                    /**
                     * @type {Element}
                     */
                    message: undefined
                },

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

                    // Creamos el menú principal del juego.
                    Dom.createMainMenu();

                    // Creamos la tabla y la añadimos al contenedor.
                    this.table = w.document.createElement("table");
                    this.container.appendChild(this.table);

                    // Inicializamos la tabla de valores.
                    Dom.paintTableValues();

                    // Creamos el input oculto para leer los valores del teclado.
                    this.inputValue = w.document.createElement("input");
                    this.inputValue.setAttribute("type", "text");
                    this.inputValue.setAttribute("inputmode", "none");
                    this.inputValue.classList.add("hidden");
                    this.container.appendChild(this.inputValue);

                    // Creamos el popup para mostrar mensajes.
                    Dom.createPopup();

                    // Inicializamos los eventos de la tabla.
                    Dom.createSelectEvent();
                    Dom.createValueEvent();
                },

                /**
                 * @name createMainMenu
                 * @description Crea el menú principal del juego.
                 */
                createMainMenu: function () {
                    var that = this;

                    /**
                     * @name createButton
                     * @description Crea un botón con el texto y el evento click proporcionados por parámetros.
                     * @param {string} text - Texto del botón.
                     * @param {EventListenerOrEventListenerObject | undefined | null} onclickFunction - Función que se ejecutará al hacer clic en el botón.
                     * @returns {Element} Retorna el botón construido.
                     */
                    function createButton(text, onclickFunction) {
                        var button = w.document.createElement("button");
                        button.innerText = text;
                        if (typeof (onclickFunction) === "function")
                            button.addEventListener("click", onclickFunction);
                        return button;
                    };

                    // Creamos el contenedor del menú principal.
                    var menuContainer = w.document.createElement("div");
                    menuContainer.classList.add("main-menu");

                    // Creamos el primer contenedor para la creación de la partida.
                    menuContainer.appendChild((function () {
                        // Creamos los contenedores y el formulario.
                        var container = w.document.createElement("div");
                        var easyContainer = w.document.createElement("div");
                        var normalContainer = w.document.createElement("div");
                        var hardContainer = w.document.createElement("div");
                        var form = w.document.createElement("form");

                        /**
                         * @name createInputRadio
                         * @description Crea un input de tipo radio-button con los valores proporcionados por parámetros.
                         * @param {string} id - Identificador del elemento.
                         * @param {string} name - Nombre del elemento.
                         * @param {string} value - Valor del elemento.
                         * @param {boolean} checked - Indica si está o no seleccionado por defecto.
                         * @returns {Element} Retorna el elemento input construido.
                         */
                        function createInputRadio(id, name, value, checked) {
                            var input = w.document.createElement("input");
                            input.setAttribute("id", id);
                            input.setAttribute("type", "radio");
                            input.setAttribute("name", name);
                            input.setAttribute("value", value);
                            if (checked)
                                input.setAttribute("checked", "checked");
                            return input;
                        };

                        /**
                         * @name createLabel
                         * @description Crea un elemento label con el texto proporcionado por parámetro y se lo asigna al elemento que le especifiquemos.
                         * @param {string} idFor - Identificador del elemento al que hará referencia el label.
                         * @param {string} text - Texto que mostrará el elemento label.
                         * @returns {Element} Retorna el elemento label construido.
                         */
                        function createLabel(idFor, text) {
                            var label = w.document.createElement("label");
                            label.setAttribute("for", idFor);
                            label.innerText = text;
                            return label;
                        };

                        // Creamos el contenedor para la dificultad "fácil".
                        var idEasyInput = "easy_input";
                        easyContainer.appendChild(createInputRadio(idEasyInput, "difficulty", "0", false));
                        easyContainer.appendChild(createLabel(idEasyInput, "Fácil"));

                        // Creamos el contenedor para la dificultad "normal".
                        var idNormalInput = "normal_input";
                        normalContainer.appendChild(createInputRadio(idNormalInput, "difficulty", "1", true));
                        normalContainer.appendChild(createLabel(idNormalInput, "Normal"));

                        // Creamos el contenedor para la dificultad "difícil".
                        var idHardInput = "hard_input";
                        hardContainer.appendChild(createInputRadio(idHardInput, "difficulty", "2", false));
                        hardContainer.appendChild(createLabel(idHardInput, "Difícil"));

                        // Creamos el botón para crear la nueva partida.
                        var newGameButton = w.document.createElement("input");
                        newGameButton.setAttribute("type", "submit");
                        newGameButton.value = "Nuevo";

                        // Añadimos los contenedores al formulario y el botón de crear la partida.
                        form.appendChild(easyContainer);
                        form.appendChild(normalContainer);
                        form.appendChild(hardContainer);
                        form.appendChild(newGameButton);

                        // Configuramos el evento para crear la partida.
                        form.onsubmit = function (e) {
                            e.preventDefault();

                            // NOTE: Cogemos la dificultad recorriendo los elementos radio buttons. Cogemos el valor haciendo un bucle para
                            //       que funcione también en IE.
                            var difficulty = (function (elements) {
                                for (var i = 0; i < elements.length; i++) {
                                    if (elements[i].checked)
                                        return w.parseInt(elements[i].value);
                                }
                                return undefined;
                            })(this.difficulty);

                            // Creamos la nueva partida.
                            that.sudoku.newGame(difficulty);
                        };

                        // Añadimos el formulario al contenedor.
                        container.appendChild(form);

                        // Añadimos la clase para el contenedor del menú.
                        container.classList.add("menu-1");

                        return container;
                    })());

                    // Creamos el segundo contenedor para los botones del tablero.
                    menuContainer.appendChild((function () {
                        var container = w.document.createElement("div");

                        // Creamos el botón de comprobar tablero.
                        container.appendChild(createButton("Comprobar", function () {
                            that.sudoku.checkCells(false, false);
                        }));

                        // Creamos el botón de resolver el tablero.
                        container.appendChild(createButton("Resolver", function () {
                            that.sudoku.resolveGameBoard();
                        }));

                        // Creamos el botón de guardar partida.
                        container.appendChild(createButton("Guardar", function () {
                            that.sudoku.saveGame();
                        }));

                        // Creamos el botón de cargar partida.
                        container.appendChild(createButton("Cargar", function () {
                            that.sudoku.loadGame();
                        }));

                        // Añadimos la clase para el contenedor del menú.
                        container.classList.add("menu-2");

                        return container;
                    })());

                    // Creamos el tercer contenedor para el contador del juego.
                    menuContainer.appendChild((function () {
                        var container = w.document.createElement("div");
                        var divTimer = w.document.createElement("div");

                        // Creamos el contador.
                        that.timer = w.document.createElement("span");
                        that.timer.innerText = "00:00:00";
                        divTimer.appendChild(that.timer);
                        container.appendChild(divTimer);

                        // Creamos el botón de iniciar el contador.
                        container.appendChild(createButton("Iniciar", function () {
                            that.sudoku.startTimer();
                        }));

                        // Creamos el botón de pausar el contador.
                        container.appendChild(createButton("Pausar", function () {
                            that.sudoku.pauseTimer();
                        }));

                        // Creamos el botón de reiniciar el contador.
                        container.appendChild(createButton("Reiniciar", function () {
                            that.sudoku.resetTimer();
                        }));

                        // Añadimos la clase para el contenedor del menú.
                        container.classList.add("menu-3");

                        return container;
                    })());

                    // Añadimos el menú principal al contenedor del juego.
                    that.container.appendChild(menuContainer);
                },

                /**
                 * @name paintTableValues
                 * @description Pinta por pantalla la tabla de valores para seleccionar.
                 */
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
                     * @param {boolean} showNote - Indica si es necesario mostrar la nota o no.
                     * @returns {Element} Retorna el contenedor nota con el número asignado.
                     */
                    function createNote(value, showNote) {
                        var div = w.document.createElement("div");
                        div.setAttribute("data-value", value.toString());
                        if (!showNote)
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

                            // Comprobamos si la celda del tablero de juego es un array, es decir, comprobamos si tiene notas activas.
                            var isArray = w.Array.isArray(boardGame[y][x]);

                            // Cogemos el valor de la posición del tablero, y en caso de que no sea un número cogemos un valor vacío.
                            var boardGameValue = (!w.isNaN(w.parseInt(boardGame[y][x])) && !isArray) ? boardGame[y][x] : "";

                            if ((x % 3) === 0) {
                                groupX++;
                            }

                            // Creamos el contenido.
                            content.classList.add("content");
                            var span = w.document.createElement("span");
                            span.appendChild(w.document.createTextNode(boardGameValue));
                            content.appendChild(span);
                            content.setAttribute("data-x", x.toString());
                            content.setAttribute("data-y", y.toString());
                            content.setAttribute("data-group", (groupY + groupX).toString());
                            content.setAttribute("data-value", boardGameValue);
                            content.setAttribute("tabindex", "1");

                            // Si la celda tiene valor entonces bloqueamos su contenido.
                            if (boardGameValue && typeof(boardGame[y][x]) === "number") {
                                content.classList.add("blocked");
                            }
                            else {
                                var contentNotes = w.document.createElement("div");

                                // Asignamos la clase al contenedor de notas.
                                contentNotes.classList.add("content-notes");

                                // Creamos los elementos en el contenedor de notas.
                                for (var i = 1; i <= 9; i++) {
                                    var showNote = false;

                                    // Si la celda tiene un array como valor significa que tiene notas, por tanto, mostramos la nota.
                                    if (isArray) {
                                        showNote = boardGame[y][x].indexOf(i) > -1;
                                    }

                                    contentNotes.appendChild(createNote(i, showNote));
                                }

                                // Ocultamos el contenedor de notas en caso de que no haya notas visibles u ocultamos el span del valor de la celda.
                                if (!isArray) {
                                    contentNotes.style.display = "none";
                                }
                                else {
                                    span.style.display = "none";
                                }
                                    
                                // Añadimos el contenedor de notas al contenedor del contenido.
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
                        if (!selectedValues || that.sudoku.gameOver) return;

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

                    /**
                     * @name event
                     * @description Selecciona la celda del tablero.
                     * @param {Event} e - Evento para obtener el elemento "target".
                     */
                    function event(e) {
                        if (that.selectedCell && that.selectedCell !== e.target) {
                            // Deseleccionamos la celda anterior y su grupo de celdas.
                            that.selectedCell.classList.remove("selected");
                            deselectGroup();

                        }

                        // Deseleccionamos sus celdas con el mismo valor.
                        deselectValues();

                        // Guardamos la referencia del elemento seleccionado y vaciamos las celdas grupo seleccionadas.
                        that.selectedCell = e.target;
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
                    };

                    // Evento focusin para seleccionar la celda.
                    this.table.addEventListener("focusin", function (e) {
                        event(e);
                    });

                    // Evento click para seleccionar la celda.
                    this.table.addEventListener("click", function (e) {
                        event(e);
                    });
                },

                /**
                 * @name createValueEvent
                 * @description Crea el evento para asignar valores al tablero.
                 */
                createValueEvent: function () {
                    var that = this;

                    /**
                     * @name event
                     * @description Asigna el valor o la nota a la celda seleccionada.
                     * @param {string} value - Valor a introducir.
                     */
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

                    /**
                     * @name changeSelectedCell
                     * @description Cambia la celda seleccionada del tablero de juego.
                     * @param {number} xPos - Posición X a incrementar o restar a la posición actual.
                     * @param {number} yPos - Posición Y a incrementar o restar a la posición actual.
                     */
                    function changeSelectedCell(xPos, yPos) {
                        if (!that.selectedCell) return;

                        var x = w.parseInt(that.selectedCell.getAttribute("data-x")) + xPos;
                        var y = w.parseInt(that.selectedCell.getAttribute("data-y")) + yPos;

                        if (x >= 0 && x < 9 && y >= 0 && y < 9) {
                            var cell = w.document.querySelector("[data-x='" + x + "'][data-y='" + y + "']");

                            if (cell) {
                                cell.click();
                            }
                        }
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
                            // Quitamos la palabra "arrow" en caso de que la tenga.
                            key = key.replace("arrow", "");

                            // Movemos el cursor en el caso de que se esté presionando cualquier flecha del teclado.
                            switch (key) {
                                case "up":
                                    changeSelectedCell(0, -1);
                                    break;
                                case "left":
                                    changeSelectedCell(-1, 0);
                                    break;
                                case "right":
                                    changeSelectedCell(1, 0);
                                    break;
                                case "down":
                                    changeSelectedCell(0, 1);
                                    break;
                            }
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
                        // Paramos el contador.
                        this.sudoku.pauseTimer();

                        // Comprobamos las celdas del tablero, pero sin incrementar el contador de comprobaciones.
                        this.sudoku.checkCells(true, false);

                        // Indicamos el fin de la partida.
                        this.sudoku.gameOver = true;

                        // Mostramos el popup de victoria.
                        this.showVictoryPopup(this.sudoku.gameBoardChecked);
                    }
                },

                /**
                 * @name setBlockedCell
                 * @description Bloquea la celda proporcionada y la pone como válida o inválida dependiendo de los parámetros recibidos.
                 * @param {number} x - Posición horizontal de la celda.
                 * @param {number} y - Posición vertical de la celda.
                 * @param {boolean} isValid - Indica si la celda ha sido indicada por el usuario o no.
                 * @param {string | number | undefined} value - Indica si la celda ha sido indicada por el usuario o no.
                 */
                setBlockedCell: function (x, y, isValid, value) {
                    // Buscamos la celda.
                    var cell = this.table.querySelector("[data-x='" + x + "'][data-y='" + y + "']");

                    if (cell && !cell.classList.contains("blocked") && isValid) {
                        // Bloqueamos y validamos la celda.
                        cell.classList.add("blocked");
                        cell.classList.add("valid");
                    }
                    else if (cell && !cell.classList.contains("blocked") && !isValid) {
                        // Bloqueamos e invalidamos la celda.
                        cell.classList.add("blocked");
                        cell.classList.add("invalid");

                        // Ocultamos las notas y mostramos el contenido de la celda.
                        cell.children[1].style.display = "none";
                        cell.children[0].style.display = "";
                    }

                    if (typeof (value) !== "undefined") {
                        // Convertimos el valor a una cadena de texto.
                        value = w.String(value);

                        // Especificamos el valor a la celda.
                        cell.setAttribute("data-value", value);
                        cell.children[0].innerHTML = value;
                    }
                },

                /**
                 * @name createPopup
                 * @description Crea un popup para mostrar avisos por pantalla.
                 */
                createPopup: function () {
                    var that = this;

                    // Creamos los contenedores.
                    that.popup.container = w.document.createElement("div");
                    that.popup.container.classList.add("modal");
                    var messageDiv = w.document.createElement("div");

                    // Creamos el mensaje del popup.
                    that.popup.message = w.document.createElement("div");
                    that.popup.message.classList.add("message");
                    messageDiv.appendChild(that.popup.message);

                    // Creamos el botón de cerrar el popup.
                    var button = w.document.createElement("button");
                    button.innerText = "Cerrar";
                    button.addEventListener("click", function (e) {
                        // Ocultamos el popup cuando el usuario presione el botón "Cerrar".
                        that.popup.container.style.display = "none";
                    });
                    messageDiv.appendChild(button);

                    // Añadimos el contenedor del mensaje al contenedor del popup y lo ocultamos.
                    that.popup.container.appendChild(messageDiv);
                    that.popup.container.style.display = "none";

                    // Añadimos el popup al contenedor principal.
                    that.container.appendChild(that.popup.container);
                },

                /**
                 * @name showVictoryPopup
                 * @description Muestra el mensaje de victoria.
                 * @param {number} gameBoardChecks - Número de comprobaciones que ha realizado el usuario en la partida.
                 */
                showVictoryPopup: function (gameBoardChecks) {
                    var message = "<h2>¡Has completado el tablero!</h2>";
                    //message += "<table class='results'><tr><td>Comprobaciones</td><td>0</td></tr><tr><td>Tiempo</td><td>00:00:00</td></tr></table>";
                    message += "<div class='result'><div>Comprobaciones:</div><div>" + gameBoardChecks + "</div></div>";
                    message += "<div class='result'><div>Tiempo de juego:</div><div>" + this.timer.innerHTML + "</div></div>";

                    this.popup.message.innerHTML = message;
                    this.popup.container.style.display = "";
                },

                /**
                 * @name showMessagePopup
                 * @description Muestra el popup con el mensaje recibido por parámetros.
                 * @param {string} message - Mensaje a mostrar.
                 */
                showMessagePopup: function (message) {
                    this.popup.message.innerHTML = "<p>" + message + "</p>";
                    this.popup.container.style.display = "";
                },

                /**
                 * @name deselectValues
                 * @description Busca los valores seleccionados en el tablero y los deselecciona.
                 */
                deselectValues: function () {
                    var cells = this.table.querySelectorAll(".selected-values");

                    for (var i = 0; i < cells.length; i++) {
                        cells[i].classList.remove("selected-values");
                    }
                },

                /**
                 * @name setTime
                 * @description Asigna eñ valor proporcionado al contador en caso de que sea diferente al valor actual.
                 * @param {string} time - Valor a especificar al contador.
                 */
                setTime: function (time) {
                    if (this.timer.innerHTML !== time) {
                        this.timer.innerHTML = time;
                    }
                },

                /**
                 * @name getSaveElements
                 * @description Coge todos los elementos que se tengan que guardar.
                 * @returns Retorna los elementos que se guardarán.
                 */
                getSaveElements: function () {
                    var that = this;
                    var difficulty = w.document.querySelector("[name='difficulty']:checked");

                    return {
                        difficulty: (difficulty) ? difficulty.value : undefined,
                        timer: that.timer.innerHTML
                    };
                },

                /**
                 * @name setDifficulty
                 * @description Selecciona la dificultad especificada por parámetros.
                 * @param {string} value - Dificultad a seleccionar.
                 */
                setDifficulty: function (value) {
                    // Buscamos el radio button de la dificultad que venga por parámetros.
                    var element = w.document.querySelector("[name='difficulty'][value='" + value + "']");

                    if (element) {
                        // Seleccionamos el radio button si éste existe.
                        element.checked = true;
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
            this.gameBoardChecked = 0;
            this.gameOver = false;
            this.timerInterval = undefined;
            this.timerStartDate = 0;
            this.timerPauseDate = 0;

            // Inicializamos los elementos del DOM.
            Dom.initContainer(this, container);

            // Iniciamos una nueva partida en dificultad normal.
            this.newGame(1);
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

            // Reestablecemos las comprobaciones del tablero de juego.
            this.gameBoardChecked = 0;
            this.gameOver = false;

            // Pintamos el tablero de juego en pantalla.
            Dom.paintBoard(this.gameBoard);
        };

        /**
         * @name isGameBoardCleared
         * @description Comprueba si el tablero de juego está correcto.
         * @returns {boolean} Retorna "true" si el tablero de juego está correcto o "false" en caso de que no lo esté.
         */
        Sudoku.prototype.isGameBoardCleared = function () {
            if (this.gameOver) return true;

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

        /**
         * @name checkCells
         * @description Valida y bloquea las celdas del tablero de juego cuyo valor sea correcto.
         * @param {boolean} ignoreCounter - Si es "true" entonces no incrementará el contador de intentos.
         * @param {boolean} resolveBoard - Si es "true" entonces las celdas que no sean correctas se solucionarán, pero se marcarán como no resueltas.
         */
        Sudoku.prototype.checkCells = function (ignoreCounter, resolveBoard) {
            if (this.gameOver) return;

            // Incrementamos el contador de comprobaciones si es necesario.
            if (!ignoreCounter) {
                this.gameBoardChecked++;
            }

            // Recorremos el tablero de juego para comprobar las celdas.
            for (var y = 0; y < this.board.length; y++) {
                for (var x = 0; x < this.board[y].length; x++) {
                    var value = w.parseInt(this.gameBoard[y][x]);

                    // Si el valor de la celda es correcto y no es una celda ya bloqueada, bloqueamos la celda y la ponemos como una celda válida.
                    if (!w.Array.isArray(this.gameBoard[y][x]) && !w.isNaN(value) && this.board[y][x] === value && typeof (this.gameBoard[y][x]) === "string") {
                        // Bloqueamos y validamos la celda.
                        Dom.setBlockedCell(x, y, true, undefined);

                        // Asignamos a la celda el mismo valor, pero en formato entero.
                        this.gameBoard[y][x] = value;

                        // TODO: Hacer algo aquí para indentificar las celdas que están validadas, para que cuando se cargue la partida estas celdas ya estén bloqueadas
                        //       y de color verde.
                    }
                    else if (resolveBoard && (w.Array.isArray(this.gameBoard[y][x]) || typeof (this.gameBoard[y][x]) === "string")) {
                        // Bloqueamos la celda, la invalidamos y le asignamos el valor correcto.
                        Dom.setBlockedCell(x, y, false, this.board[y][x]);

                        // Asignamos a la celda el valor correcto.
                        this.gameBoard[y][x] = this.board[y][x];
                    }
                }
            }
        };

        /**
         * @name resolveGameBoard
         * @description Resuelve el tablero de juego, pero invalida las celdas que no tengan el valor correcto, por tanto, el usuario pierde la partida.
         */
        Sudoku.prototype.resolveGameBoard = function () {
            if (this.gameOver) return;

            // Paramos el contador.
            this.pauseTimer();

            // Resolvemos el tablero.
            this.checkCells(false, true);

            // Finalizamos la partida.
            this.gameOver = true;

            // Deseleccionamos los valores que estén marcados.
            Dom.deselectValues();
        };

        /**
         * @name saveGame
         * @description Guarda la partida actual en el localStorage.
         */
        Sudoku.prototype.saveGame = function () {
            if (this.gameOver) {
                // Si la partida ya ha finalizado mostramos un mensaje indicando que no se puede guardar la partida.
                Dom.showMessagePopup("No es posible guardar la partida cuando ésta ya ha finalizado.");
                return;
            }

            var that = this;

            // Cogemos todos los elementos a guardar.
            var game = {
                mainMenu: Dom.getSaveElements(),
                board: that.board,
                gameBoard: that.gameBoard,
                gameBoardChecked: that.gameBoardChecked,
                timerStartDate: that.timerStartDate,
                diffDate: new Date()
            };

            // Guardamos la partida en el localStorage.
            w.localStorage.setItem("jsudoku-game", w.JSON.stringify(game));
        };

        /**
         * @name loadGame
         * @description Carga la partida que esté guardada en el localStorage.
         */
        Sudoku.prototype.loadGame = function () {
            // Cargamos la partida guardada de localStorage.
            var item = w.localStorage.getItem("jsudoku-game");

            if (item) {
                // Parseamos a JSON la partida guardada.
                var game = w.JSON.parse(item);

                // Parseamos la fecha de inicio del contador para después sumarle la diferencia de fechas, para que así el contador
                // pueda continuar por donde se quedó.
                var startDate = (game.timerStartDate) ? new Date(game.timerStartDate) : undefined;

                // Asignamos los valores cargados.
                this.board = game.board;
                this.gameBoard = game.gameBoard;
                this.gameBoardChecked = game.gameBoardChecked;
                this.timerStartDate = (startDate) ? new Date(startDate.setMilliseconds(new Date() - new Date(game.diffDate))) : startDate;
                this.timerPauseDate = new Date();
                Dom.setTime(game.mainMenu.timer);
                Dom.setDifficulty(game.mainMenu.difficulty);

                // Reestablecemos las comprobaciones del tablero de juego.
                this.gameOver = false;

                // Pintamos el tablero de juego en pantalla.
                Dom.paintBoard(this.gameBoard);

                // TODO: Ahora cuando se carga una celda ya validada se pone como bloqueada, pero sin el color verde. Hay que encontrar
                //       alguna forma de que las celdas que ya estuvieran validadas vuelvan a salir en color verde.
            }
        };

        /**
         * @name startTimer
         * @description Pone en marcha el intervalo para que funcione el temporizador.
         */
        Sudoku.prototype.startTimer = function () {
            if (this.gameOver) return;

            var that = this;

            if (!that.timerInterval) {
                if (!that.timerStartDate) {
                    // Inicializamos la fecha de inicio en caso de que no lo esté.
                    that.timerStartDate = new Date();
                }
                else if (that.timerPauseDate) {
                    // Sumamos la diferencia de tiempo en caso de reanudar un temporizador pausado.
                    that.timerStartDate = new Date(that.timerStartDate.setMilliseconds(new Date() - that.timerPauseDate));
                }

                // Creamos el intervalo del temporizador.
                that.timerInterval = w.setInterval(function () {
                    // Cogemos la fecha actual menos la fecha de inicio para saber las horas, minutos y segundos que lleva la partida en marcha.
                    var diffDate = new Date(w.parseFloat(new Date() - that.timerStartDate));

                    // Cogemos las horas, los minutos y los segundos con dos dígitos.
                    var hours = diffDate.getUTCHours().toLocaleString(undefined, { minimumIntegerDigits: 2 }),
                        minutes = diffDate.getUTCMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 }),
                        seconds = diffDate.getUTCSeconds().toLocaleString(undefined, { minimumIntegerDigits: 2 });

                    // Especificamos el tiempo por pantalla.
                    Dom.setTime(hours + ":" + minutes + ":" + seconds);
                }, 1);
            }
        };

        /**
         * @name pauseTimer
         * @description Pone en pausa el temporizador.
         */
        Sudoku.prototype.pauseTimer = function () {
            if (this.gameOver) return;

            // Guardamos la fecha a la que ha sido pausado el temporizador para utilizarla posteriormente cuando éste se reanude.
            this.timerPauseDate = new Date();

            // Limpiamos el intervalo del temporizador.
            w.clearInterval(this.timerInterval);
            this.timerInterval = 0;

        };

        /**
         * @name resetTimer
         * @description Restablece el temporizador a cero y lo para.
         */
        Sudoku.prototype.resetTimer = function () {
            if (this.gameOver) return;

            // Limpiamos el intervalo del temporizador para pararlo.
            w.clearInterval(this.timerInterval);
            this.timerInterval = 0;

            // Restablecemos las fechas del temporizador.
            this.timerStartDate = undefined;
            this.timerPauseDate = undefined;

            // Especificamos el tiempo de inicio por pantalla.
            Dom.setTime("00:00:00");
        };

        return Sudoku;
    })();
})(window);