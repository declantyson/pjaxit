(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Ocelot = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/*
 *
 *  Ocelot.js
 *  Declan Tyson
 *  v0.3.0
 *  12/01/2017
 *
 */

var Pjax = function () {
    function Pjax() {
        var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ocelot-content';

        _classCallCheck(this, Pjax);

        // The element to watch
        this.el = el;

        // Page-specific events
        this.events = {};

        // Default changePage options
        this.defaultOpts = { endpoint: false, method: 'GET', timeout: 0, callback: null, callbackTimeout: 0, push: true };

        var self = this;
        if (history.pushState) {
            window.onpopstate = function () {
                // Change page without pushing new entry to the history
                self.changePage({
                    endpoint: window.location.pathname,
                    push: false
                });
            };
        } else {
            console.warn('Ocelot: this browser does not support history.pushState. Hash changing is coming soon.');
        }
    }

    _createClass(Pjax, [{
        key: 'setEvent',
        value: function setEvent(url, event) {
            this.events[url] = event;
        }
    }, {
        key: 'changePage',
        value: function changePage() {
            var _this = this;

            var customOpts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var opts = this.defaultOpts;

            Object.keys(customOpts).forEach(function (key) {
                opts[key] = customOpts[key];
            });

            if (!opts.endpoint) console.warn('Ocelot: a PJAX endpoint is required.');

            // AJAX call made to endpoint
            var xhr = new XMLHttpRequest();
            xhr.open(opts.method, opts.endpoint, true);
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) {
                    console.warn('Ocelot: ' + opts.method + ' ' + opts.endpoint + ' returned ' + xhr.status + '.');
                    return;
                }

                // Set a timeout in case of any transition animations
                setTimeout(function () {
                    // Get only AJAX-friendly content, we don't want to duplicate the CSS and JavaScript
                    var temp = document.createElement('div');
                    temp.innerHTML = xhr.responseText;
                    document.querySelector('#' + _this.el).innerHTML = temp.querySelector('#' + _this.el).innerHTML;

                    // Perform any page-specific events
                    var pageEvent = _this.events[opts.endpoint];
                    if (pageEvent) {
                        if (typeof pageEvent !== 'function') {
                            console.warn('Ocelot: ' + opts.endpoint + ' event must be a function, instead found ' + (typeof pageEvent === 'undefined' ? 'undefined' : _typeof(pageEvent)) + '.');
                            return;
                        }
                        pageEvent();
                    }
                }, opts.timeout);

                // Perform callback function (if any)
                setTimeout(function () {
                    if (opts.callback === null) return;
                    if (typeof opts.callback !== 'function') {
                        console.warn('Ocelot: Callback must be a function, instead found ' + _typeof(opts.callback) + '.');
                        return;
                    }

                    opts.callback(xhr.responseText);
                }, opts.callbackTimeout);

                // Push to browser history to allow for back/forward
                if (opts.push) history.pushState('', 'New URL: ' + opts.endpoint, opts.endpoint);
            };
        }
    }, {
        key: 'all',
        value: function all() {
            var _this2 = this;

            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            document.addEventListener("click", function (e) {
                if (e.target.nodeName === "A") {
                    e.preventDefault();
                    opts.endpoint = e.target.attributes["href"].value;
                    _this2.changePage(opts);
                }
            });
        }
    }]);

    return Pjax;
}();

exports.Pjax = Pjax;


},{}]},{},[1])(1)
});