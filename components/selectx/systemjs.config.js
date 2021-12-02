(function(global) {
  System.config({
    transpiler: 'ts',
    typescriptOptions: {
      tsconfig: true
    },
    meta: {
      typescript: {
        "exports": "ts"
      }
    },
    // Paths serve as alias.
    paths: {
      'npm:': 'https://unpkg.com/'
    },
    // Map tells the System loader where to look for things.
    map: {
      '@angular/core': 'npm:@angular/core@4.0.2/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common@4.0.2/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler@4.0.2/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser@4.0.2/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@4.0.2/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http@4.0.2/bundles/http.umd.js',
      '@angular/forms': 'npm:@angular/forms@4.0.2/bundles/forms.umd.js',
      'ionic-angular': 'npm:ionic-angular@3.1.1',
      'rxjs': 'npm:rxjs@5.5.2',
      'rxjs/operators': 'npm:rxjs@5.5.2/operators/index.js',
      'ts': 'npm:plugin-typescript@5.2.7/lib/plugin.js',
      'typescript': 'npm:typescript@2.2.1/lib/typescript.js',
      'ionic-select-searchable': 'npm:ionic-select-searchable@2.1.1/index.js'
    },
    // Packages tells the System loader how to load when
    // no file name and/or no extension.
    packages: {
      rxjs: {
        defaultExtension: 'js'
      },
      'ionic-angular': {
        main: './umd/index.js',
        defaultExtension: 'js'
      },
      app: {
        main: './main.ts',
        defaultExtension: 'ts'
      },
      pages: {
        defaultExtension: 'ts'
      },
      components: {
        defaultExtension: 'ts'
      },
      services: {
        defaultExtension: 'ts'
      },
      types: {
        defaultExtension: 'ts'
      }
    }
  });
})(this);