//Apache License

(function () {

    "use strict";

    let defaults = {
        "autofocus": true,
        "wrapper": ".tab-container",
        "tab": ".tab-tab",
        "panel": ".tab-pane",
        "toggleCallback": function () { },
        "styles": {
            "active": "active",
            "doNotShow": "d-none"
        }
    },
        settings;

    let wrapper;

    function initialize(options) {

        settings = Object.assign({}, defaults, options);

        wrapper = document.querySelector(settings.wrapper);

        if (!wrapper) {
            console.error("no tab components available");
        } else {

            bindEvents();

        }

    }

    function bindEvents() {

        let tabs = wrapper.querySelectorAll(settings.tab);

        for (let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener("click", toggleTabs, false);
        }

        return;
    }

    function toggleTabs(e) {

        e.preventDefault();

        hidePanels();

        let tab = e.currentTarget,
            panelId = tab.getAttribute("tab-panel-id"),
            panel = wrapper.querySelector("#" + panelId);

        if (panel) {

            panel.classList.add(settings.styles.active);
            panel.classList.remove(settings.styles.doNotShow);

            //select the first child element with the tab-focus attribute
            setTabInitialFocus(panel);

        }

        e.target.classList.add(settings.styles.active);

        if (settings.toggleCallback) {

            settings.toggleCallback({
                "tab": tab,
                "panelId": panelId,
                "panel": panel
            });

        }

    }

    function setTabInitialFocus(panel) {

        if (settings.autofocus) {

            let initialFocus = panel.querySelector("[tab-focus], [autofocus]");

            if (initialFocus) {

                //if we have a matching element then set the focus
                initialFocus.focus();

            } else {

                //if there is no input with the tab-focus attribute, let's find form fields within the target panel
                initialFocus = panel.querySelector("input, textarea, select");

                if (initialFocus) {

                    //you can only set the focus to a single input field, so chose the first in the list.
                    initialFocus.focus();

                }

            }

        }

    }

    function hidePanels() {

        let panels = wrapper.querySelectorAll(settings.panel),
            tabs = wrapper.querySelectorAll(settings.tab);

        for (let index = 0; index < panels.length; index++) {

            panels[index].classList.remove(settings.styles.active);
            panels[index].classList.add(settings.styles.doNotShow);

        }

        for (let index = 0; index < tabs.length; index++) {

            tabs[index].classList.remove(settings.styles.active);

        }

    }

    window.tab_panel = {
        initialize: initialize
    };

})();