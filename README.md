# JSudoku
Sudoku realizado en HTML, CSS y JavaScript.
<br/>

# ¿Cómo importarlo?
<p>Para importar JSudoku en tu página web tienes que descargar los dos siguientes ficheros (los cuales puedes encontrar en la carpeta "app/lib" de este repositorio):</p>
<ul>
    <li>jsudoku/jsudoku.min.js</li>
    <li>jsudoku/jsudoku.min.css</li>
</ul>
<p>Una vez descargados, simplemente tienes que importarlos en tu fichero "index.html" (o en el fichero donde cargues tus recursos).</p>
<br/>

# ¿Cómo instanciar el juego?
<p>1.- Lo primer es tener un contenedor donde se instanciará el juego.</p>
<p>2.- Una vez tengas el contenedor tienes que instanciar en JavaScript un objeto de tipo "JSudoku", indicándole como argumento el contenedor creado en el punto anterior. En mi caso, cojo el contenedor mediante su identificador y se lo proporciono al objeto:</p>
<p><i>var game = new JSudoku(document.getElementById("jsudoku"));</i></p>
<br/>
<p>En el fichero "index.html" de este repositorio tienes un ejemplo donde se crea una instancia del juego dentro de las etiquetas "script".</p>
<br/>

# Controles del juego
<p>- Para seleccionar una casilla puedes hacerlo pulsando clic izquierdo con el ratón sobre ella, o si todavía no tienes ninguna casilla seleccionada, puedes presionar tabulador para seleccionar la primera casilla y para moverte por las demás casillas puedes utilizar las flechas de dirección de tu teclado.</p>
<p>- Para especificar un valor a una casilla lo primero es seleccionarla. Una vez seleccionada puedes seleccionar el valor deseado desde la tabla de valores inferior haciendo clic izquierdo con el ratón, o bien puedes pulsar un número del cero al nueve de tu teclado siempre y cuando tengas una casilla seleccionada.</p>
<p>- Para especificar notas tienes que seleccionar previamente la casilla deseada e introducir el valor que quieres anotar. Una vez introducido el valor tienes que volver a introducir el mismo valor en la misma casilla, esto hará que la celda trate dicho valor como si fuese una anotación. Cuando una casilla está en modo "anotación", el siguente valor que especifiques en ella también lo va a tratar como si fuese una anotación.</p>
<p>- Para borrar un valor de una casilla tienes que seleccionar la casilla deseada y seleccionar el valor vacío de la tabla de valores o presionar la tecla "0" o la tecla de retroceso o suprimir.</p>
<p>- Para quitar un valor de una casilla en modo "anotación" simplemente tienes que volver a introducir el valor que quieras borrar y dicho valor desaparecerá de la anotación. Si por el contrario quieres borrar todos los números anotador en una casilla puedes usar el mismo método que se explica en el punto anterior para borrar un valor de una casilla.</p>
<br/>

# Anexos
<p>Paquetes utilizados para minimizar los ficheros ".js" y ".css":</p>
<ul>
    <li>https://www.npmjs.com/package/grunt</li>
    <li>https://www.npmjs.com/package/grunt-cli</li>
    <li>https://www.npmjs.com/package/grunt-contrib-uglify</li>
    <li>https://www.npmjs.com/package/grunt-contrib-cssmin</li>
</ul>
<br/>
