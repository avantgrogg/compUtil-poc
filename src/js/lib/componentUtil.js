import { mDom, rebind } from './renderUtil';
import objectPath from 'object-path';
import $ from 'jquery';

import { cloneDeep, concat, difference, flatten, forEach, isArray, isEqual, isFunction,
    isObject, map, merge, mergeWith, omit, reduce, uniq } from 'lodash';

// Default configuration object for components
export const defaults = {
    children: [],
    childrenObjects: {},
    attachEvents: attachEvents,
    attachWatchers: attachWatchers,
    removeWatchers: removeWatchers,
    removeEvents: removeEvents,
    addChild: addChild,
    addChildren: addChildren,
    removeAllChildren: removeAllChildren,
    removeChild: removeChild,
    deactivateChild: deactivateChild,
    reactivateChild: reactivateChild,
    pauseChild: pauseChild,
    pauseChildren: pauseChildren,
    unpauseChild: unpauseChild,
    unpauseChildren: unpauseChildren,
    rebindChildren: rebindChildren,
    updateChildren: updateChildren,
    template: () => {},
    name: 'genericComponent',
    watch: [],
    render: render,
    firstRender: firstRender,
    beforeRender: beforeRender,
    afterRender: afterRender,
    beforeConstruction: beforeConstruction,
    afterConstruction: afterConstruction,
    beforeAttachEvents: beforeAttachEvents,
    afterAttachEvents: afterAttachEvents,
    beforeAttachWatchers: beforeAttachWatchers,
    afterAttachWatchers: afterAttachWatchers,
    rebind: false,
    finalRenderCall: finalRenderCall,
    renderType: mDom,
    generateDictionary: generateDictionary,
    beforeAttach: beforeAttach,
    scopedEvent: scopedEvent,
    scopedSelector: scopedSelector,
    beforeInsertion: beforeInsertion,
    getInheritedOverrides: getInheritedOverrides,
    isComponentValid: isComponentValid,
    checkStateChange: checkStateChange,
    onStateChange: onStateChange,
    afterRebind: afterRebind,
    loader: {}
};

// Internal util functions
export function generate(config, store, overrides = {}) {
    // Combining the overrides is necessary here because if this component is a child component
    // which has inherited overrides and the parent also has inherited overrides, these overrides
    // must be merged.
    // Would make more sense to have inheritedOverrides as a 4th parameter...
    const mergedOverrides = mergeOverrides(config, overrides);
    const componentConfig = generateConfig(config, mergedOverrides);
    let components = constructComponents(componentConfig, store);
    let index = 0;

    const inherited = componentConfig.getInheritedOverrides();

    forEach(components, (constructedComponent) => {
        let children = {};
        forEach(constructedComponent.children, (child) => {
            let init = child;
            // eslint-disable-next-line no-shadow
            let overrides = {};
            let newChild = {};
            if(Array.isArray(child)) {
                init = child[0];
                overrides = child[1];
            }
            if (!overrides) {
                overrides = {};
            }
            overrides.parent = componentConfig;
            if(constructedComponent.multiple) {
                overrides.parentLocation = constructedComponent.componentLocation;
                overrides.multipleIndex = index;
                overrides.generateDictionary = constructedComponent.generateDictionary;
                overrides.beforeAttach = constructedComponent.beforeAttach;
            }

            overrides = mergeOverrides(overrides, inherited);

            newChild = init(store, overrides);
            children = Object.assign(
                {}, children, newChild
            );
        });

        if(Object.keys(children).length > 0) {
            constructedComponent.childrenObjects = children;
        }

        components = Object.assign(
            {}, components, children
        );
        index++;
    });

    return components;
}

/*
 * Merge the inherited overrides from the parents into the children.
 * Do a bit of logic to maintain any overrides in the child as well
 * @param overrides - current overrides
 * @param inherited - overrides from the parent
 * @return new overrides, nicely merged
 */
function mergeOverrides(overrides, inherited) {
    if (!overrides.inheritedOverrides) {
        overrides.inheritedOverrides = [];
    }
    const childInheritedOverrides = overrides.inheritedOverrides.slice(0);
    const merged = merge(overrides, inherited);

    merged.inheritedOverrides.push(...childInheritedOverrides);

    // No duplicates in the inherited properties
    merged.inheritedOverrides = uniq(merged.inheritedOverrides);

    return merged;
}

/**
 * Returns the inherited overrides of this component.
 * Useful for children construction and modals
 * @return {Object} Component overrides
 */
export function getInheritedOverrides() {
    const inheritedOverrides = this.inheritedOverrides || [];

    // This pushes inheritedOverrides down to all children, grand-children, and deeper
    inheritedOverrides.push('inheritedOverrides');

    return reduce(inheritedOverrides, (result, value) => {
        result[value] = this[value];
        return result;
    }, {});
}

export function constructComponents(config, store) {
    // If isComponentValid returns false return an empty object
    // which will stop the component from constructing
    if (!config.isComponentValid(store)) {
        return {};
    }

    config.beforeConstruction();

    let components = {};

    if(config.multiple) {
        components = attachMultiple(config, components, store);
    } else {
        components = attachSingle(config, components, store);
    }

    runFirstRenders(components, store);
    runAttachEvents(components, store);
    runAttachWatchers(components, store);
    config.afterConstruction(store);
    return components;
}

export function runAttachEvents(components, store) {
    forEach(components, (component) => {
        component.beforeAttachEvents();
        component.attachEvents(store);
        component.afterAttachEvents();
    });
}

export function runAttachWatchers(components, store) {
    forEach(components, (component) => {
        component.beforeAttachWatchers();
        component.removeWatchers = component.attachWatchers(store);
        component.afterAttachWatchers();
    });
}

export function runFirstRenders(components, store) {
    forEach(components, (component) => {
        component.firstRender(store);
    });
}

export function generateConfig(config, overrides) {
    return Object.assign(
        {}, defaults, config, overrides
    );
}

/**
 * Create mulitple component overrides for components with
 * multiple similar children i.e. Family Products
 * @param  {Object} config      Component config
 * @param  {Array} components   List of components to override
 * @param  {Object} store       A15 Redux store
 * @return {Array}              List of overridden components
 */
export function attachMultiple(config, components, store) {
    if(!config.multiple) {
        return;
    }
    const multiples = config.multiple(store);

    for (let index = 0; index < multiples; index++) {
        const newLocation = `${config.templateLocation}[data-index='${index}']`;

        components[newLocation] = Object.assign(
            {}, config, {
                store: store,
                componentLocation: newLocation,
                multipleIndex: index
            }
        );
    }

    // eslint-disable-next-line consistent-return
    return components;
}

export function attachSingle(config, components, store) {
    const updatedConfig = config.beforeAttach(config, components);

    if (updatedConfig) {
        // eslint-disable-next-line no-param-reassign
        config = updatedConfig;
    }

    if(config.parentLocation) {
        config.templateLocation = `${config.parentLocation} ${config.templateLocation}`;
    }
    let componentName = config.name;
    if(config.templateLocation) {
        componentName = config.templateLocation;
    }
    components[componentName] = Object.assign(
        {}, config, {
            store: store,
            componentLocation: config.templateLocation
        }
    );

    return components;
}

// Default attached methods
export function updateChildren(componentList, store) {
    this.removeChild(difference(this.children, componentList), store);
    this.addChild(difference(componentList, this.children), store);
    this.children = componentList;
}

export function addChildren(newChildren, store) {
    const parent = Object.assign({}, this);
    forEach(newChildren, (child) => {
        this.addChild(child, store, parent);
    });
    return this.childrenObjects;
}

export function addChild(child, store, parent = {}) {
    let overrides = {};
    let init;
    init = child;
    if(Array.isArray(child)) {
        init = child[0];
        overrides = child[1];
    }

    overrides = mergeOverrides(overrides, this.getInheritedOverrides());
    overrides.parent = parent;
    const newComponent = init(store, overrides);
    this.childrenObjects = Object.assign(
        {}, this.childrenObjects, newComponent
    );

    return newComponent;
}

export function removeAllChildren() {

    const self = this;

    forEach(this.childrenObjects, (child) => {
        self.removeChild(child);
        child.removeAllChildren();
    });

    this.childrenObjects = {};
}

export function removeChild(child, store) {
    deactivateChild(child, store);
    this.childrenObjects = omit(this.childrenObjects, child);
    return;
}

export function deactivateChild(child, store) {
    if (!child.removeWatchers) {
        // This happens when they don't have watchers?
    } else {
        child.removeWatchers(store);
    }

    child.removeEvents(store);
    return;
}

export function pauseChildren(store) {

    forEach(this.childrenObjects, (child) =>{
        this.pauseChild(child, store)
    })
}

export function pauseChild(child, store) {
    if (!child.removeWatchers) {
        // This happens when they don't have watchers?
    } else {
        child.removeWatchers(store);
    }
    return;
}

export function unpauseChildren(store) {
    forEach(this.childrenObjects, (child) =>{
        this.unpauseChild(child, store)
    })
}

export function unpauseChild(child, store) {
    child.removeWatchers = child.attachWatchers(store);
}



export function reactivateChild(child, store) {
    child.attachWatchers(store);
    child.attachEvents(store);
    return;
}

export function rebindChildren(store) {
    let index = 0;
    let elements;
    let el;
    forEach(this.childrenObjects, (child) => {
        if(child.multiple) {
            elements = $(child.templateLocation);
            el = elements[index];
            index++;
        } else {
            el = $(`${child.componentLocation}`);
        }
        rebind(child, el, store);
    });
}

export function render(getState, config, dictionary, store = {}) {
    this.beforeRender();

    let updatedView;
    if (false) {
        const templateString = generateTemplate(getState, config, dictionary);
        const updatedTemplateString = this.beforeInsertion(getState, templateString);
        updatedView = this.renderType(config, updatedTemplateString, store, this.renderOptions);
    } else {
        let timeStart = (new Date()).getTime();
        const templateString = generateTemplate(getState, config, dictionary);
        let timeDiff = (new Date()).getTime() - timeStart;

        const updatedTemplateString = this.beforeInsertion(getState, templateString);

        timeStart = (new Date()).getTime();
        updatedView = this.renderType(config, updatedTemplateString, store, this.renderOptions);
        timeDiff = (new Date()).getTime() - timeStart;
    }

    this.finalRenderCall();
    if(this.rebind) {
        this.rebindChildren(store);
    }
    return updatedView;
}

export function generateTemplate(getState, config, dictionary) {
    const model = Object.assign(
        {}, getState(), config, config.generateDictionary(getState(), dictionary, config));

    return config.template.render(model);
}

export function generateDictionary(state, dict = {}, config) {
    return Object.assign({}, state, dict);
}

export function removeWatchers() {}

export function attachEvents() {}

export function removeEvents(store) {
    const eventTypes = ['touchend', 'click', 'mouseup', 'mousedown', 'mouseenter', 'mouseleave', 'submit', 'change',
        'keydown', 'keyup'];

    for (let i = 0; i < eventTypes.length; i++) {
        const event = eventTypes[i];
        const cleanTemplateLocation = templateLocationForEvent(this.templateLocation);
        $(document).off(`${event}.${cleanTemplateLocation}`);
    }
}

export function beforeInsertion(getState, templateString) {
    return templateString;
}

export function destroyComponent() {}

// lifecycle functions
export function isComponentValid(store) {
    return true;
}

export function beforeConstruction() {}

export function afterConstruction() {}

export function beforeAttachEvents() {}

export function afterAttachEvents() {}

export function beforeAttachWatchers() {}

export function afterAttachWatchers() {}

export function beforeRender() {}

export function afterRender() {}

export function firstRender() {}

export function finalRenderCall() { }

export function afterRebind() {}

/**
 * Clean a templateLocation so that it can be used on a scoped events
 *
 * For instance ".js-uuid-XXX .dom-modal-contents" is tranformed to
 * "js-uuid-XXXXdom-modal-contents"
 */
export function templateLocationForEvent(templateLocation) {
    if (!templateLocation) {
        return "";
    }
    return templateLocation.replace(/[.\s]/g, '');
}

/**
 * Scopes events with the templateLocation
 * @param {Array} eventTypes    'touchend' or 'touchend click'
 * @return {String}             List of template locations
 */
export function scopedEvent(eventTypes) {
    const bits = eventTypes.split(/\s+/);
    const bitsWithTemplate = map(bits, (bit) => {
        const cleanTemplateLocation = templateLocationForEvent(this.templateLocation);
        return `${bit}.${cleanTemplateLocation}`;
    });

    return bitsWithTemplate.join(' ');
}

/**
 * Scopes a css selector with the templateLocation
 * @param {String} selectors     '.js-blah' or '.js-blah, .js-blah2'
 * @returns {String}            Target selector
 */
export function scopedSelector(selectors) {
    if (!selectors) {
        return this.templateLocation;
    }

    const bits = selectors.split(/,/);
    const bitsWithTemplate = map(bits, (bit) => {
        return `${this.templateLocation} ${bit}`;
    });

    return bitsWithTemplate.join(',');
}

export function beforeAttach() {}

/**
 * Subscribes a component to state changes, and attaches a handler to manage when to updateChildren
 * @param {Object} store    A15 redux store
 * @return {Function}       Redux unsubscribe function
 */
export function attachWatchers(store) {
    if(flatten([this.watch]).length < 1) {
        return;
    }
    let previousState = {};

    const _this = this;
    const watchValues = map(flatten([this.watch]), (w) => {
        if (isFunction(w)) {
            return w.call(this);
        } else {
            return w;
        }
    });

    for (let watchIndex = 0; watchIndex < watchValues.length; watchIndex++) {
        const watchValue = watchValues[watchIndex];
        previousState[watchValue] = cloneDeep(objectPath.get(store.getState(), watchValue));
    }

    function handleStateChange() {
        let currentState = {};
        for (let watchIndex = 0; watchIndex < watchValues.length; watchIndex++) {
            const watchValue = watchValues[watchIndex];
            currentState[watchValue] = cloneDeep(objectPath.get(store.getState(), watchValue));

            if (this.checkStateChange(previousState, currentState, watchValue)) {
                this.onStateChange(store, watchValue, previousState[watchValue], currentState[watchValue]);
                break;
            }
        }
        previousState = currentState;
    }

    const unsubscribe = store.subscribe(handleStateChange.bind(this));

    // eslint-disable-next-line consistent-return
    return unsubscribe;
}

/**
 * Default function executed when watched part of store changes
 * @param {Object} store - the redux store
 * @param {Boolean} true if everything went as expected, false if a bad state was found
 */
export function onStateChange(store) {
    this.render(store.getState, this, {}, store);
    return true;
}

/**
 * Iterates through watchValue array looking for changed state, returns first watch value with changed state
 * @param {Array} watchValues       The user supplied watch values
 * @param {Object} previousState    The store state prior to subscription being triggered
 * @param {Object} currentState     The store state after the subscription update
 * @return {Object}                 State change
 */
export function checkStateChange(previousState, currentState, watchValue) {
    return !isEqual(previousState[watchValue], currentState[watchValue])
}

/**
 * Merge a component config and a brand override config
 * @param  {Object} config         Component config
 * @param  {Object} overrideConfig Component Brand Override config
 * @return {Object}                Merged config
 */
export function mergeConfigOverrides(config, overrideConfig) {
    return mergeWith(config, overrideConfig, mergeConfigOverridesCustomizer);
}

/**
 * Custom merge function for a component config and a brand override config
 * @param  {*} configValue          Component config value to be merged
 * @param  {*} overrideConfigValue  Component Brand Override config value to be merged
 * @return {*}                      Merged value
 */
export function mergeConfigOverridesCustomizer(configValue, overrideConfigValue) {
    if (isArray(configValue) && isArray(overrideConfigValue)) {
        return concat(configValue, overrideConfigValue);
    }

    if (isObject(configValue) && isObject(overrideConfigValue)) {
        return mergeConfigOverrides(configValue, overrideConfigValue);
    }

    return overrideConfigValue;
}

/**
 * Generic test for template location, to be used (usually) in isComponentValid
 *
 * to be used in the config like:
 *   componentValid: templateLocationExists
 */
export function templateLocationExists() {
    const f = function() {
        return $(this.templateLocation).length > 0;
    }.bind(this);
    return f();
}


