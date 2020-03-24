const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
//require('bootstrap-loader');
import 'moment';

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    const extractCSS = new ExtractTextPlugin('vendor.css');
    //const extractStyles = new ExtractTextPlugin('app.css');
    const sharedConfig = {
        stats: { modules: false },
        resolve: { extensions: [ '.js' ] },
        module: {
            rules: [
                { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' },
            ]
        },
        entry: {
            vendor: [
                '@agm/core',
                '@angular/animations',
                '@angular/common',
                '@angular/compiler',
                '@angular/core',
                '@angular/forms',
                '@angular/platform-browser',
                '@angular/platform-browser-dynamic',
                '@angular/router',
                '@ckeditor/ckeditor5-angular',
                '@ckeditor/ckeditor5-build-classic',
                '@ng-bootstrap/ng-bootstrap',
                '@ngx-translate/core',
                '@ngx-translate/http-loader',
                'angular-calendar',
                'angular-calendar/css/angular-calendar.css',
                'angular-calendar-scheduler',
                'animate.css/animate.css',
                'tether',
                'tether/dist/css/tether.css',
                'bootstrap',
                'bootstrap/dist/css/bootstrap.css',
                'es6-shim',
                'es6-promise',
                'event-source-polyfill',
                'file-saver',
                'font-awesome/css/font-awesome.css',
                'jquery',
                'moment',
                'moment-duration-format',
                'ng-busy',
                'ng-busy/src/style/busy.css',
                'ng-click-outside',
                'ng2-file-upload',
                'ng2-validation',
                'ngx-avatar',
                'ngx-color',
                'ngx-cookie-banner',
                'ngx-cookie-service',
                'ngx-moment',
                'ngx-select-ex',
                'ngx-summernote',
                'ngx-toastr',
                'ngx-toastr/toastr.css',
                'popper.js',
                'signature_pad',
                'summernote',
                'summernote/dist/summernote-lite.css',
                'zone.js'
            ]
        },
        output: {
            publicPath: '/dist/',
            filename: '[name].js',
            library: '[name]_[hash]'
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                jquery: 'jquery',
                'window.jQuery': 'jquery',
                Tether: 'tether',
                'window.Tether': 'tether',
                Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
                Button: 'exports-loader?Button!bootstrap/js/dist/button',
                Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
                Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
                Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
                Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
                Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
                Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
                Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
                Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
                Util: 'exports-loader?Util!bootstrap/js/dist/util'
            }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
            new webpack.ContextReplacementPlugin(/\@angular\b.*\b(bundles|linker)/, path.join(__dirname, './ClientApp')), // Workaround for https://github.com/angular/angular/issues/11580
            new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)@angular/, path.join(__dirname, './ClientApp')), // Workaround for https://github.com/angular/angular/issues/14898
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /it/),
            new webpack.IgnorePlugin(/^vertx$/) // Workaround for https://github.com/stefanpenner/es6-promise/issues/100
        ]
    };

    const clientBundleConfig = merge(sharedConfig, {
        output: { path: path.join(__dirname, 'wwwroot', 'dist') },
        module: {
            rules: [
                { test: /\.scss$/, include: /ClientApp/, loaders: ['raw-loader', 'sass-loader'] },
                //{ test: /\.less(\?|$)/, include: /ClientApp/, use: extractStyles.extract('style-loader!css-loader!less-loader') },
                //{ test: /\.(scss|sass)(\?|$)/, include: /ClientApp/, use: extractStyles.extract('style-loader!css-loader!sass-loader') },
                { test: /\.css(\?|$)/, use: extractCSS.extract({ use: isDevBuild ? 'css-loader' : 'css-loader?minimize' }) }
            ]
        },
        plugins: [
            extractCSS,
            //extractStyles,
            new webpack.DllPlugin({
                path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ].concat(isDevBuild ? [] : [
            // new webpack.optimize.UglifyJsPlugin()
            new UglifyJSPlugin()
        ])
    });

    const serverBundleConfig = merge(sharedConfig, {
        target: 'node',
        resolve: { mainFields: ['main'] },
        output: {
            path: path.join(__dirname, 'ClientApp', 'dist'),
            libraryTarget: 'commonjs2',
        },
        module: {
            rules: [
                { test: /\.scss$/, include: /ClientApp/, loaders: ['raw-loader', 'sass-loader'] },
                //{ test: /\.less(\?|$)/, include: /ClientApp/, use: extractStyles.extract('style-loader!css-loader!less-loader') },
                //{ test: /\.(scss|sass)(\?|$)/, include: /ClientApp/, use: extractStyles.extract('style-loader!css-loader!sass-loader') },
                { test: /\.css(\?|$)/, use: ['to-string-loader', isDevBuild ? 'css-loader' : 'css-loader?minimize'] }
            ]
        },
        entry: { vendor: ['aspnet-prerendering'] },
        plugins: [
            new webpack.DllPlugin({
                path: path.join(__dirname, 'ClientApp', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ]
    });

    return [clientBundleConfig, serverBundleConfig];
}
