(function () {
  var isModern = supportsStaticImport() && window.customElements;
  var elementRegistry = {
    "pfe-accordion": false,
    "pfe-autocomplete": false,
    "pfe-avatar": false,
    "pfe-badge": false,
    "pfe-band": false,
    "pfe-card": false,
    "pfe-collapse": false,
    "pfe-content-set": false,
    "pfe-cta": false,
    "pfe-datetime": false,
    "pfe-health-index": false,
    "pfe-icon-panel": false,
    "pfe-icon": false,
    "pfe-markdown": false,
    "pfe-modal": false,
    "pfe-navigation": false,
    "pfe-number": false,
    "pfe-page-status": false,
    "pfe-progress-indicator": false,
    "pfe-select": false,
    "pfe-tabs": false,
    "pfe-toast": false
  };

  // if the browser isn't modern (Edge 18, IE11), just throw
  // the bundle and polyfills on the page and call it a day
  if (!isModern) {
    var fragment = document.createDocumentFragment();
    var loads = 0;
    
    var customElementsEs5Adapter = document.createElement("script");
    customElementsEs5Adapter.src = "https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.4.3/custom-elements-es5-adapter.js";
    customElementsEs5Adapter.addEventListener("load", loadCheck);

    var webComponentsBundle = document.createElement("script");
    webComponentsBundle.src = "https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.4.3/webcomponents-bundle.js";
    webComponentsBundle.addEventListener("load", loadCheck);

    var pfelements = document.createElement("script");
    pfelements.src = "pfelements.min.js";
    
    fragment.appendChild(customElementsEs5Adapter);
    fragment.appendChild(webComponentsBundle);

    function loadCheck() {
      loads++;

      if (loads === 2) {
        customElementsEs5Adapter.removeEventListener("load", loadCheck);
        webComponentsBundle.removeEventListener("load", loadCheck);
        document.head.appendChild(pfelements);
      }
    }

    document.head.appendChild(fragment);
    return;
  }

  // the browser is modern so it will get all of the modern goodness.
  // start off by crawling the DOM and processing all of the elements
  var elements = document.querySelectorAll("*");
  for (var i = 0; i < elements.length; i++) {
    processElement(elements[i]);
  }

  // set up a mutation observer to watch for changes in the DOM and process
  // any added nodes
  var mutationObserver = new MutationObserver(function (mutationList) {
    mutationList.forEach(function (mutation) {
      for (var i = 0; i < mutation.addedNodes.length; i++) {
        processElement(mutation.addedNodes[i]);
      }
    });
  });
  
  mutationObserver.observe(document.body, { childList: true, subtree: true });
  
  function processElement(element) {
    if (!element || !element.tagName) {
      return;
    }
    
    const tagName = element.tagName.toLowerCase();
    
    // check our "registry" to see if the tag name exists on it
    // and hasn't already been registered
    if (elementRegistry[tagName] === false) {
      createScript(tagName);
      elementRegistry[tagName] = true;
    }
  }
  
  // create a script tag for the element we need to load and append it
  // to the head of the document
  function createScript(tagName) {
    var script = document.createElement("script");
    script.src = "./node_modules/@patternfly/" + tagName + "/dist/" + tagName + ".min.js";
    script.type = "module";

    document.head.appendChild(script);
  }

  function supportsStaticImport() {
    const script = document.createElement('script');
    return 'noModule' in script; 
  }
}());