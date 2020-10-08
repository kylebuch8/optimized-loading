# PatternFly Elements Dynamic Loader

This proof of concept repository demonstrates the ability to use a single JavaScript file `loader.js` to dynamically load PatternFly Elements onto a page based on the `pfe` tags present in the markup. It also can dynamically load a PatternFly Element after page load if a new `pfe` tag is added to the page.

This is heavily inspired [the work that Bryan Ollendyke has done](https://dev.to/btopro/uwc-part-3-the-magic-script-122a).

## Get started
```
npm install && npm start
```

## How loader.js works
`loader.js` contains a registry of components that it cares about. 

```javascript
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
```

### On page load
On page load, we loop through all of the tags on the page and run them through a `processElement` function that checks the `elementRegistry` to see if this is a tag that we care about. If a component in the registry hasn't already been loaded, a `<script>` tag is added to the `<head>` of the document which will start downloading the code for the component and any of its dependences.

If we see that the component has already been loaded, we do nothing and move onto the next component.

### After page load
In the initial load of `loader.js`, a mutation observer is set on `document.body` and it watches for changes in the childList and subtree.

```javascript
mutationObserver.observe(document.body, { childList: true, subtree: true });
```

As nodes are added to the page, we process the added nodes with the same `processElement` function used in the initial page load.

```javascript
// set up a mutation observer to watch for changes in the DOM and process
// any added nodes
var mutationObserver = new MutationObserver(function (mutationList) {
  mutationList.forEach(function (mutation) {
    for (var i = 0; i < mutation.addedNodes.length; i++) {
      processElement(mutation.addedNodes[i]);
    }
  });
});
```

## Future ideas
### A more specific mutation observer
Rather than setting the mutation observer on the body, what if the mutation observer targeted a specific div on the page? This could prevent us from having to watch all of the nodes in the body and could probably be much more performant.

### Hosting PatternFly Elements from a CDN
Instead of loading PatternFly Elements from `node_modules`, what if we could pull them from a static CDN? This way we'd be able to take advantage of browser cache.

### Checking if the component has been registered
Before we add a component to the page, we should check the `customElement` registry to see if the component has already been defined.