//dollar bill is a simple, custom helper library with a collection of
//utility methods based on jQuery's example.
;

(function (window, undefined) {

    "use strict";

    var dbl = function (selector, context) {

        var db = new dbl.fn.init(selector, context),
            nodes, i;

        // HANDLE: $(""), $(null), $(undefined), $(false)
        if (!selector) {

            db.length = 0;
            return db;

        }

        if (typeof selector === "string") {

            if (context && context.nodeType) {
                nodes = context.querySelectorAll(selector);
            } else {
                nodes = document.querySelectorAll(selector);
            }

            db.length = nodes.length;
            db.selector = selector;

            for (i = 0; i < nodes.length; i++) {
                db[i] = nodes[i];
            }

        } else if (selector.nodeType) {

            //if(!selector.length){
            //    selector = [selector];
            //}

            db[0] = selector;
            db.length = (!selector.length) ? 1 : selector.length;
        }

        return db;

    };

    dbl.fn = dbl.prototype = {

        constructor: dbl,

        init: function () {

            //this.length = 5;
            //this.selector = ".test";

            return this;
        },

        version: "0.0.6",

        length: 0,
        context: undefined,
        selector: "",
        rclass: /[\t\r\n]/g

    };

    dbl.noop = function () {};

    // Give the init function the dbl prototype for later instantiation
    dbl.fn.init.prototype = dbl.fn;

    window.dollarbill = window.$ = dbl;

    dollarbill.fn.removeClass = function (cssClass) {

        if (!cssClass || typeof cssClass !== "string") {
            return;
        }

        for (var i = 0; i < this.length; i++) {

            var classes = cssClass.split(" ");

            for (var j = 0; j < classes.length; j++) {
                if (classes[j] !== "") {
                    this[i].classList.remove(classes[j]);
                }
            }

        }

        return this;

    };

    dollarbill.fn.addClass = function (cssClass) {

        if (!cssClass || typeof cssClass !== "string") {
            return;
        }

        for (var i = 0; i < this.length; i++) {
            var classes = cssClass.split(" ");

            for (var j = 0; j < classes.length; j++) {
                if (classes[j] !== "") {
                    this[i].classList.add(classes[j]);
                }
            }
        }

        return this;

    };

    dollarbill.fn.hasClass = function (cssClass) {

        if (!cssClass || typeof cssClass !== "string") {
            return this;
        }

        return this[0].classList.contains(cssClass);

    };

    dollarbill.fn.toggleClass = function (cssClass) {

        if (!cssClass || typeof cssClass !== "string") {
            return;
        }

        for (var i = 0; i < this.length; i++) {

            this[i].classList.toggle(cssClass);
        }

        return this;

    };


    //https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
    if (!window.CustomEvent) {

        function CustomEvent(event, params) {
            params = params || {
                bubbles: false,
                cancelable: false,
                detail: undefined
            };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };

        CustomEvent.prototype = window.CustomEvent.prototype;

        window.CustomEvent = CustomEvent;

    }

    dollarbill.fn.on = function (evt, fn, bubble) {

        bubble = (bubble === true) ? true : false;

        if (!Array.isArray(evt)) {
            evt = [evt];
        }

        for (var i = 0; i < this.length; i++) {

            for (var j = 0; j < evt.length; j++) {

                this[i].addEventListener(evt[j], fn, bubble);

            }

        }

        return this;

    };

    dollarbill.fn.off = function (evt, fn, bubble) {

        for (var i = 0; i < this.length; i++) {
            this[i].removeEventListener(evt, fn, bubble);
        }

        return this;

    };

    dollarbill.fn.trigger = function (eventType, extraParameters) {

        if (!eventType) {
            return this;
        }

        var i = 0,
            event = new CustomEvent(eventType, extraParameters);

        for (; i < this.length; i++) {
            elem.dispatchEvent(event);
        }

        return this;
    };

    dollarbill.fn.value = function (value) {

        if (value) {
            for (var i = 0; i < this.length; i++) {
                this[i].value = value;
            }
        } else {
            if (this[0]) {

                return this[0].value;

            }
        }

    };

    dollarbill.fn.isValid = function () {
        return this[0].validity.valid;
    };

    dollarbill.fn.toggleDisabled = function (state) {

        for (var i = 0; i < this.length; i++) {
            this[i].disabled = state;
            this[i].setAttribute("aria-disabled", state);
        }

        return this;

    };


    dollarbill.fn.toggleFlex = function (state) {

        for (var i = 0; i < this.length; i++) {

            if (!state) //display
            {

                this[i].classList.add("d-none");
                this[i].classList.remove("d-flex");

            } else {

                this[i].classList.remove("d-none");
                this[i].classList.add("d-flex");

            }

        }

        return this;

    };

    dollarbill.fn.html = function (value) {

        if (value !== undefined) {
            for (var i = 0; i < this.length; i++) {
                this[i].innerHTML = value;
            }
        } else {
            return this[0].innerHTML;
        }

    };

    dollarbill.fn.text = function (value) {

        if (value) {
            for (var i = 0; i < this.length; i++) {
                this[i].innerText = value;
            }
        } else {
            return this[0].innerText;
        }

    };

    dollarbill.fn.value = function (value) {

        if (value) {
            for (var i = 0; i < this.length; i++) {
                this[i].value = value;
            }
        } else {
            if (this[0]) {
                return this[0].value;
            }
        }

    };

    dollarbill.fn.checked = function (value) {

        if (value !== undefined) {
            for (var i = 0; i < this.length; i++) {
                this[i].checked = value;
            }
        } else {
            return this[0].checked;
        }

    };

    dollarbill.fn.append = function (content) {

        if (!content) {
            return this;
        }

        if (!content.nodeType && typeof content === "string") {
            content = document.createElement(content);
        }

        this[0].appendChild(content);

        return this;

    };

    dollarbill.fn.type = function (value) {

        if (value !== undefined) {
            for (var i = 0; i < this.length; i++) {
                this[i].type = value;
            }
        } else {
            if (this[0]) {
                return this[0].type;
            }
        }

    };

    dollarbill.fn.attr = function (name, value) {

        if (value) {

            for (var i = 0; i < this.length; i++) {
                this[i].setAttribute(name, value);
            }

        } else {

            if (this[0]) {

                return this[0].getAttribute(name);

            }

        }

    };

}(window));