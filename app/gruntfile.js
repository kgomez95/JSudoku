module.exports = function (grunt) {
    // Creamos la configuración que utilizará grunt.
    grunt.initConfig({
        cssmin: {
            jsudoku: {
                src: "lib/jsudoku/*.css",   // Ruta y ficheros los cuales se van a procesar.
                dest: "lib/jsudoku/",       // Ruta de destino donde se generará el resultado.
                expand: true,               // Permite una construcción dinámica.
                flatten: true,              // Elimina todos los anidamientos innecesarios.
                ext: ".min.css"             // Remplaza la extensión .css por .min.css.
            }
        },
        uglify: {
            jsudoku: {
                src: "lib/jsudoku/*.js",    // Ruta y ficheros los cuales se van a procesar.
                dest: "lib/jsudoku/",       // Ruta de destino donde se generará el resultado.
                expand: true,               // Permite una construcción dinámica.
                flatten: true,              // Elimina todos los anidamientos innecesarios.
                ext: ".min.js"              // Remplaza la extensión .js por .min.js.
            }
        }
    });

    // Carga los plugins necesarios de grunt.
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");

    // Registra la configuración que hemos creado arriba.
    grunt.registerTask("default", ["uglify", "cssmin"]);
};