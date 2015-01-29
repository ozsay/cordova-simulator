require.config({
    baseUrl: '/',
    map: {
        '*': {
            'css': 'lib/require-css/css'
        }
    },
    paths: {
        socketio: 'socket.io/socket.io',
        domReady: 'lib/requirejs-domready/domReady',
        jquery: 'lib/jquery/dist/jquery',
        bootstrap: 'lib/bootstrap/dist/js/bootstrap',
        angular: 'lib/angular/angular',
        Blob: 'lib/Blob/Blob',
        saveAs: 'lib/FileSaver/FileSaver',
        app: '/js',
        api: '/api'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        bootstrap: { 
            deps: ['jquery'] 
        },
        Blob: {
            exports: 'Blob'
        }
    },
});

require(['domReady!', 'bootstrap', 'angular', 'app/app', 'api/fileReader/js/app', 'api/storage/js/app', 'api/fileSaver/js/app', 'api/server/js/app', 'css!lib/bootstrap/dist/css/bootstrap', 'css!lib/bootstrap/dist/css/bootstrap-theme', 'css!lib/csshake/csshake'], function(document, bootstrap, angular, app) {
    
    angular.module('cordovaSimulator.api', [
        'cordovaSimulator.api.fileReader',
        'cordovaSimulator.api.fileSaver',
        'cordovaSimulator.api.server',
        'cordovaSimulator.api.storage'
    ]);
    
    angular.bootstrap(document, ['cordovaSimulator']);
});