/**
 * @license Angular v4.0.0
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
import { Compiler, ComponentFactoryResolver, Directive, ElementRef, EventEmitter, Inject, Injector, NgModule, NgZone, ReflectiveInjector, SimpleChange, Testability, Version } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all public APIs of the common package.
 */
/**
 * \@stable
 */
const VERSION = new Version('4.0.0');

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @return {?}
 */
function noNg() {
    throw new Error('AngularJS v1.x is not loaded!');
}
let angular = ({
    bootstrap: noNg,
    module: noNg,
    element: noNg,
    version: noNg,
    resumeBootstrap: noNg,
    getTestability: noNg
});
try {
    if (window.hasOwnProperty('angular')) {
        angular = ((window)).angular;
    }
}
catch (e) {
}
const bootstrap = angular.bootstrap;
const module$1 = angular.module;
const element = angular.element;

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const $COMPILE = '$compile';
const $CONTROLLER = '$controller';

const $HTTP_BACKEND = '$httpBackend';
const $INJECTOR = '$injector';
const $PARSE = '$parse';

const $ROOT_SCOPE = '$rootScope';
const $SCOPE = '$scope';
const $TEMPLATE_CACHE = '$templateCache';

const $$TESTABILITY = '$$testability';
const COMPILER_KEY = '$$angularCompiler';

const INJECTOR_KEY = '$$angularInjector';
const NG_ZONE_KEY = '$$angularNgZone';
const REQUIRE_INJECTOR = '?^^' + INJECTOR_KEY;
const REQUIRE_NG_MODEL = '?ngModel';

/**
 * A `PropertyBinding` represents a mapping between a property name
 * and an attribute name. It is parsed from a string of the form
 * `"prop: attr"`; or simply `"propAndAttr" where the property
 * and attribute have the same identifier.
 */
class PropertyBinding {
    /**
     * @param {?} prop
     * @param {?} attr
     */
    constructor(prop, attr) {
        this.prop = prop;
        this.attr = attr;
        this.parseBinding();
    }
    /**
     * @return {?}
     */
    parseBinding() {
        this.bracketAttr = `[${this.attr}]`;
        this.parenAttr = `(${this.attr})`;
        this.bracketParenAttr = `[(${this.attr})]`;
        const /** @type {?} */ capitalAttr = this.attr.charAt(0).toUpperCase() + this.attr.substr(1);
        this.onAttr = `on${capitalAttr}`;
        this.bindAttr = `bind${capitalAttr}`;
        this.bindonAttr = `bindon${capitalAttr}`;
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} e
 * @return {?}
 */
function onError(e) {
    // TODO: (misko): We seem to not have a stack trace here!
    if (console.error) {
        console.error(e, e.stack);
    }
    else {
        // tslint:disable-next-line:no-console
        console.log(e, e.stack);
    }
    throw e;
}
/**
 * @param {?} name
 * @return {?}
 */
function controllerKey(name) {
    return '$' + name + 'Controller';
}
/**
 * @param {?} node
 * @return {?}
 */

/**
 * @param {?} component
 * @return {?}
 */
function getComponentName(component) {
    // Return the name of the component or the first line of its stringified version.
    return ((component)).overriddenName || component.name || component.toString().split('\n')[0];
}
class Deferred {
    constructor() {
        this.promise = new Promise((res, rej) => {
            this.resolve = res;
            this.reject = rej;
        });
    }
}
/**
 * @param {?} component
 * @return {?} Whether the passed-in component implements the subset of the
 *     `ControlValueAccessor` interface needed for AngularJS `ng-model`
 *     compatibility.
 */
function supportsNgModel(component) {
    return typeof component.writeValue === 'function' &&
        typeof component.registerOnChange === 'function';
}
/**
 * Glue the AngularJS `NgModelController` (if it exists) to the component
 * (if it implements the needed subset of the `ControlValueAccessor` interface).
 * @param {?} ngModel
 * @param {?} component
 * @return {?}
 */
function hookupNgModel(ngModel, component) {
    if (ngModel && supportsNgModel(component)) {
        ngModel.$render = () => { component.writeValue(ngModel.$viewValue); };
        component.registerOnChange(ngModel.$setViewValue.bind(ngModel));
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const INITIAL_VALUE = {
    __UNINITIALIZED__: true
};
class DowngradeComponentAdapter {
    /**
     * @param {?} id
     * @param {?} element
     * @param {?} attrs
     * @param {?} scope
     * @param {?} ngModel
     * @param {?} parentInjector
     * @param {?} $injector
     * @param {?} $compile
     * @param {?} $parse
     * @param {?} componentFactory
     */
    constructor(id, element, attrs, scope, ngModel, parentInjector, $injector, $compile, $parse, componentFactory) {
        this.id = id;
        this.element = element;
        this.attrs = attrs;
        this.scope = scope;
        this.ngModel = ngModel;
        this.parentInjector = parentInjector;
        this.$injector = $injector;
        this.$compile = $compile;
        this.$parse = $parse;
        this.componentFactory = componentFactory;
        this.inputChangeCount = 0;
        this.inputChanges = null;
        this.componentRef = null;
        this.component = null;
        this.changeDetector = null;
        this.element[0].id = id;
        this.componentScope = scope.$new();
    }
    /**
     * @return {?}
     */
    compileContents() {
        const /** @type {?} */ compiledProjectableNodes = [];
        const /** @type {?} */ projectableNodes = this.groupProjectableNodes();
        const /** @type {?} */ linkFns = projectableNodes.map(nodes => this.$compile(nodes));
        this.element.empty();
        linkFns.forEach(linkFn => {
            linkFn(this.scope, (clone) => {
                compiledProjectableNodes.push(clone);
                this.element.append(clone);
            });
        });
        return compiledProjectableNodes;
    }
    /**
     * @param {?} projectableNodes
     * @return {?}
     */
    createComponent(projectableNodes) {
        const /** @type {?} */ childInjector = ReflectiveInjector.resolveAndCreate([{ provide: $SCOPE, useValue: this.componentScope }], this.parentInjector);
        this.componentRef =
            this.componentFactory.create(childInjector, projectableNodes, this.element[0]);
        this.changeDetector = this.componentRef.changeDetectorRef;
        this.component = this.componentRef.instance;
        hookupNgModel(this.ngModel, this.component);
    }
    /**
     * @return {?}
     */
    setupInputs() {
        const /** @type {?} */ attrs = this.attrs;
        const /** @type {?} */ inputs = this.componentFactory.inputs || [];
        for (let /** @type {?} */ i = 0; i < inputs.length; i++) {
            const /** @type {?} */ input = new PropertyBinding(inputs[i].propName, inputs[i].templateName);
            let /** @type {?} */ expr = null;
            if (attrs.hasOwnProperty(input.attr)) {
                const /** @type {?} */ observeFn = (prop => {
                    let /** @type {?} */ prevValue = INITIAL_VALUE;
                    return (currValue) => {
                        if (prevValue === INITIAL_VALUE) {
                            prevValue = currValue;
                        }
                        this.updateInput(prop, prevValue, currValue);
                        prevValue = currValue;
                    };
                })(input.prop);
                attrs.$observe(input.attr, observeFn);
            }
            else if (attrs.hasOwnProperty(input.bindAttr)) {
                expr = ((attrs) /** TODO #9100 */)[input.bindAttr];
            }
            else if (attrs.hasOwnProperty(input.bracketAttr)) {
                expr = ((attrs) /** TODO #9100 */)[input.bracketAttr];
            }
            else if (attrs.hasOwnProperty(input.bindonAttr)) {
                expr = ((attrs) /** TODO #9100 */)[input.bindonAttr];
            }
            else if (attrs.hasOwnProperty(input.bracketParenAttr)) {
                expr = ((attrs) /** TODO #9100 */)[input.bracketParenAttr];
            }
            if (expr != null) {
                const /** @type {?} */ watchFn = (prop => (currValue, prevValue) => this.updateInput(prop, prevValue, currValue))(input.prop);
                this.componentScope.$watch(expr, watchFn);
            }
        }
        const /** @type {?} */ prototype = this.componentFactory.componentType.prototype;
        if (prototype && ((prototype)).ngOnChanges) {
            // Detect: OnChanges interface
            this.inputChanges = {};
            this.componentScope.$watch(() => this.inputChangeCount, () => {
                const /** @type {?} */ inputChanges = this.inputChanges;
                this.inputChanges = {};
                ((this.component)).ngOnChanges(inputChanges);
            });
        }
        this.componentScope.$watch(() => this.changeDetector && this.changeDetector.detectChanges());
    }
    /**
     * @return {?}
     */
    setupOutputs() {
        const /** @type {?} */ attrs = this.attrs;
        const /** @type {?} */ outputs = this.componentFactory.outputs || [];
        for (let /** @type {?} */ j = 0; j < outputs.length; j++) {
            const /** @type {?} */ output = new PropertyBinding(outputs[j].propName, outputs[j].templateName);
            let /** @type {?} */ expr = null;
            let /** @type {?} */ assignExpr = false;
            const /** @type {?} */ bindonAttr = output.bindonAttr ? output.bindonAttr.substring(0, output.bindonAttr.length - 6) : null;
            const /** @type {?} */ bracketParenAttr = output.bracketParenAttr ?
                `[(${output.bracketParenAttr.substring(2, output.bracketParenAttr.length - 8)})]` :
                null;
            if (attrs.hasOwnProperty(output.onAttr)) {
                expr = ((attrs) /** TODO #9100 */)[output.onAttr];
            }
            else if (attrs.hasOwnProperty(output.parenAttr)) {
                expr = ((attrs) /** TODO #9100 */)[output.parenAttr];
            }
            else if (attrs.hasOwnProperty(bindonAttr)) {
                expr = ((attrs) /** TODO #9100 */)[bindonAttr];
                assignExpr = true;
            }
            else if (attrs.hasOwnProperty(bracketParenAttr)) {
                expr = ((attrs) /** TODO #9100 */)[bracketParenAttr];
                assignExpr = true;
            }
            if (expr != null && assignExpr != null) {
                const /** @type {?} */ getter = this.$parse(expr);
                const /** @type {?} */ setter = getter.assign;
                if (assignExpr && !setter) {
                    throw new Error(`Expression '${expr}' is not assignable!`);
                }
                const /** @type {?} */ emitter = (this.component[output.prop]);
                if (emitter) {
                    emitter.subscribe({
                        next: assignExpr ?
                            ((setter) => (v /** TODO #9100 */) => setter(this.scope, v))(setter) :
                            ((getter) => (v /** TODO #9100 */) => getter(this.scope, { $event: v }))(getter)
                    });
                }
                else {
                    throw new Error(`Missing emitter '${output.prop}' on component '${getComponentName(this.componentFactory.componentType)}'!`);
                }
            }
        }
    }
    /**
     * @return {?}
     */
    registerCleanup() {
        this.element.bind('$destroy', () => {
            this.componentScope.$destroy();
            this.componentRef.destroy();
        });
    }
    /**
     * @return {?}
     */
    getInjector() { return this.componentRef && this.componentRef.injector; }
    /**
     * @param {?} prop
     * @param {?} prevValue
     * @param {?} currValue
     * @return {?}
     */
    updateInput(prop, prevValue, currValue) {
        if (this.inputChanges) {
            this.inputChangeCount++;
            this.inputChanges[prop] = new SimpleChange(prevValue, currValue, prevValue === currValue);
        }
        this.component[prop] = currValue;
    }
    /**
     * @return {?}
     */
    groupProjectableNodes() {
        let /** @type {?} */ ngContentSelectors = this.componentFactory.ngContentSelectors;
        return groupNodesBySelector(ngContentSelectors, this.element.contents());
    }
}
/**
 * Group a set of DOM nodes into `ngContent` groups, based on the given content selectors.
 * @param {?} ngContentSelectors
 * @param {?} nodes
 * @return {?}
 */
function groupNodesBySelector(ngContentSelectors, nodes) {
    const /** @type {?} */ projectableNodes = [];
    let /** @type {?} */ wildcardNgContentIndex;
    for (let /** @type {?} */ i = 0, /** @type {?} */ ii = ngContentSelectors.length; i < ii; ++i) {
        projectableNodes[i] = [];
    }
    for (let /** @type {?} */ j = 0, /** @type {?} */ jj = nodes.length; j < jj; ++j) {
        const /** @type {?} */ node = nodes[j];
        const /** @type {?} */ ngContentIndex = findMatchingNgContentIndex(node, ngContentSelectors);
        if (ngContentIndex != null) {
            projectableNodes[ngContentIndex].push(node);
        }
    }
    return projectableNodes;
}
/**
 * @param {?} element
 * @param {?} ngContentSelectors
 * @return {?}
 */
function findMatchingNgContentIndex(element, ngContentSelectors) {
    const /** @type {?} */ ngContentIndices = [];
    let /** @type {?} */ wildcardNgContentIndex;
    for (let /** @type {?} */ i = 0; i < ngContentSelectors.length; i++) {
        const /** @type {?} */ selector = ngContentSelectors[i];
        if (selector === '*') {
            wildcardNgContentIndex = i;
        }
        else {
            if (matchesSelector(element, selector)) {
                ngContentIndices.push(i);
            }
        }
    }
    ngContentIndices.sort();
    if (wildcardNgContentIndex !== undefined) {
        ngContentIndices.push(wildcardNgContentIndex);
    }
    return ngContentIndices.length ? ngContentIndices[0] : null;
}
let _matches;
/**
 * @param {?} el
 * @param {?} selector
 * @return {?}
 */
function matchesSelector(el, selector) {
    if (!_matches) {
        const /** @type {?} */ elProto = (Element.prototype);
        _matches = elProto.matches || elProto.matchesSelector || elProto.mozMatchesSelector ||
            elProto.msMatchesSelector || elProto.oMatchesSelector || elProto.webkitMatchesSelector;
    }
    return el.nodeType === Node.ELEMENT_NODE ? _matches.call(el, selector) : false;
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
let downgradeCount = 0;
/**
 * \@whatItDoes
 *
 * *Part of the [upgrade/static](/docs/ts/latest/api/#!?query=upgrade%2Fstatic)
 * library for hybrid upgrade apps that support AoT compilation*
 *
 * Allows an Angular component to be used from AngularJS.
 *
 * \@howToUse
 *
 * Let's assume that you have an Angular component called `ng2Heroes` that needs
 * to be made available in AngularJS templates.
 *
 * {\@example upgrade/static/ts/module.ts region="ng2-heroes"}
 *
 * We must create an AngularJS [directive](https://docs.angularjs.org/guide/directive)
 * that will make this Angular component available inside AngularJS templates.
 * The `downgradeComponent()` function returns a factory function that we
 * can use to define the AngularJS directive that wraps the "downgraded" component.
 *
 * {\@example upgrade/static/ts/module.ts region="ng2-heroes-wrapper"}
 *
 * \@description
 *
 * A helper function that returns a factory function to be used for registering an
 * AngularJS wrapper directive for "downgrading" an Angular component.
 *
 * The parameter contains information about the Component that is being downgraded:
 *
 * * `component: Type<any>`: The type of the Component that will be downgraded
 *
 * \@experimental
 * @param {?} info
 * @return {?}
 */
function downgradeComponent(info) {
    const /** @type {?} */ idPrefix = `NG2_UPGRADE_${downgradeCount++}_`;
    let /** @type {?} */ idCount = 0;
    const /** @type {?} */ directiveFactory = function ($compile, $injector, $parse) {
        return {
            restrict: 'E',
            terminal: true,
            require: [REQUIRE_INJECTOR, REQUIRE_NG_MODEL],
            link: (scope, element, attrs, required) => {
                // We might have to compile the contents asynchronously, because this might have been
                // triggered by `UpgradeNg1ComponentAdapterBuilder`, before the Angular templates have
                // been compiled.
                const /** @type {?} */ parentInjector = required[0] || $injector.get(INJECTOR_KEY);
                const /** @type {?} */ ngModel = required[1];
                const /** @type {?} */ downgradeFn = (injector) => {
                    const /** @type {?} */ componentFactoryResolver = injector.get(ComponentFactoryResolver);
                    const /** @type {?} */ componentFactory = componentFactoryResolver.resolveComponentFactory(info.component);
                    if (!componentFactory) {
                        throw new Error('Expecting ComponentFactory for: ' + getComponentName(info.component));
                    }
                    const /** @type {?} */ id = idPrefix + (idCount++);
                    const /** @type {?} */ injectorPromise = new ParentInjectorPromise$1(element);
                    const /** @type {?} */ facade = new DowngradeComponentAdapter(id, element, attrs, scope, ngModel, injector, $injector, $compile, $parse, componentFactory);
                    const /** @type {?} */ projectableNodes = facade.compileContents();
                    facade.createComponent(projectableNodes);
                    facade.setupInputs();
                    facade.setupOutputs();
                    facade.registerCleanup();
                    injectorPromise.resolve(facade.getInjector());
                };
                if (parentInjector instanceof ParentInjectorPromise$1) {
                    parentInjector.then(downgradeFn);
                }
                else {
                    downgradeFn(parentInjector);
                }
            }
        };
    };
    // bracket-notation because of closure - see #14441
    directiveFactory['$inject'] = [$COMPILE, $INJECTOR, $PARSE];
    return directiveFactory;
}
/**
 * Synchronous promise-like object to wrap parent injectors,
 * to preserve the synchronous nature of Angular 1's $compile.
 */
class ParentInjectorPromise$1 {
    /**
     * @param {?} element
     */
    constructor(element) {
        this.element = element;
        this.injectorKey = controllerKey(INJECTOR_KEY);
        this.callbacks = [];
        // Store the promise on the element.
        element.data(this.injectorKey, this);
    }
    /**
     * @param {?} callback
     * @return {?}
     */
    then(callback) {
        if (this.injector) {
            callback(this.injector);
        }
        else {
            this.callbacks.push(callback);
        }
    }
    /**
     * @param {?} injector
     * @return {?}
     */
    resolve(injector) {
        this.injector = injector;
        // Store the real injector on the element.
        this.element.data(this.injectorKey, injector);
        // Release the element to prevent memory leaks.
        this.element = null;
        // Run the queued callbacks.
        this.callbacks.forEach(callback => callback(injector));
        this.callbacks.length = 0;
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@whatItDoes
 *
 * *Part of the [upgrade/static](/docs/ts/latest/api/#!?query=upgrade%2Fstatic)
 * library for hybrid upgrade apps that support AoT compilation*
 *
 * Allow an Angular service to be accessible from AngularJS.
 *
 * \@howToUse
 *
 * First ensure that the service to be downgraded is provided in an {\@link NgModule}
 * that will be part of the upgrade application. For example, let's assume we have
 * defined `HeroesService`
 *
 * {\@example upgrade/static/ts/module.ts region="ng2-heroes-service"}
 *
 * and that we have included this in our upgrade app {\@link NgModule}
 *
 * {\@example upgrade/static/ts/module.ts region="ng2-module"}
 *
 * Now we can register the `downgradeInjectable` factory function for the service
 * on an AngularJS module.
 *
 * {\@example upgrade/static/ts/module.ts region="downgrade-ng2-heroes-service"}
 *
 * Inside an AngularJS component's controller we can get hold of the
 * downgraded service via the name we gave when downgrading.
 *
 * {\@example upgrade/static/ts/module.ts region="example-app"}
 *
 * \@description
 *
 * Takes a `token` that identifies a service provided from Angular.
 *
 * Returns a [factory function](https://docs.angularjs.org/guide/di) that can be
 * used to register the service on an AngularJS module.
 *
 * The factory function provides access to the Angular service that
 * is identified by the `token` parameter.
 *
 * \@experimental
 * @param {?} token
 * @return {?}
 */
function downgradeInjectable(token) {
    const /** @type {?} */ factory = function (i) { return i.get(token); };
    ((factory)).$inject = [INJECTOR_KEY];
    return factory;
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const CAMEL_CASE = /([A-Z])/g;
const INITIAL_VALUE$1 = {
    __UNINITIALIZED__: true
};
const NOT_SUPPORTED = 'NOT_SUPPORTED';
class UpgradeNg1ComponentAdapterBuilder {
    /**
     * @param {?} name
     */
    constructor(name) {
        this.name = name;
        this.inputs = [];
        this.inputsRename = [];
        this.outputs = [];
        this.outputsRename = [];
        this.propertyOutputs = [];
        this.checkProperties = [];
        this.propertyMap = {};
        this.linkFn = null;
        this.directive = null;
        this.$controller = null;
        const selector = name.replace(CAMEL_CASE, (all /** TODO #9100 */, next) => '-' + next.toLowerCase());
        const self = this;
        this.type =
            Directive({ selector: selector, inputs: this.inputsRename, outputs: this.outputsRename })
                .Class({
                constructor: [
                    new Inject($SCOPE), ElementRef,
                    function (scope, elementRef) {
                        return new UpgradeNg1ComponentAdapter(self.linkFn, scope, self.directive, elementRef, self.$controller, self.inputs, self.outputs, self.propertyOutputs, self.checkProperties, self.propertyMap);
                    }
                ],
                ngOnInit: function () { },
                ngOnChanges: function () { },
                ngDoCheck: function () { },
                ngOnDestroy: function () { },
            });
    }
    /**
     * @param {?} injector
     * @return {?}
     */
    extractDirective(injector) {
        const /** @type {?} */ directives = injector.get(this.name + 'Directive');
        if (directives.length > 1) {
            throw new Error('Only support single directive definition for: ' + this.name);
        }
        const /** @type {?} */ directive = directives[0];
        if (directive.replace)
            this.notSupported('replace');
        if (directive.terminal)
            this.notSupported('terminal');
        const /** @type {?} */ link = directive.link;
        if (typeof link == 'object') {
            if (((link)).post)
                this.notSupported('link.post');
        }
        return directive;
    }
    /**
     * @param {?} feature
     * @return {?}
     */
    notSupported(feature) {
        throw new Error(`Upgraded directive '${this.name}' does not support '${feature}'.`);
    }
    /**
     * @return {?}
     */
    extractBindings() {
        const /** @type {?} */ btcIsObject = typeof this.directive.bindToController === 'object';
        if (btcIsObject && Object.keys(this.directive.scope).length) {
            throw new Error(`Binding definitions on scope and controller at the same time are not supported.`);
        }
        const /** @type {?} */ context = (btcIsObject) ? this.directive.bindToController : this.directive.scope;
        if (typeof context == 'object') {
            for (const /** @type {?} */ name in context) {
                if (((context)).hasOwnProperty(name)) {
                    let /** @type {?} */ localName = context[name];
                    const /** @type {?} */ type = localName.charAt(0);
                    const /** @type {?} */ typeOptions = localName.charAt(1);
                    localName = typeOptions === '?' ? localName.substr(2) : localName.substr(1);
                    localName = localName || name;
                    const /** @type {?} */ outputName = 'output_' + name;
                    const /** @type {?} */ outputNameRename = outputName + ': ' + name;
                    const /** @type {?} */ outputNameRenameChange = outputName + ': ' + name + 'Change';
                    const /** @type {?} */ inputName = 'input_' + name;
                    const /** @type {?} */ inputNameRename = inputName + ': ' + name;
                    switch (type) {
                        case '=':
                            this.propertyOutputs.push(outputName);
                            this.checkProperties.push(localName);
                            this.outputs.push(outputName);
                            this.outputsRename.push(outputNameRenameChange);
                            this.propertyMap[outputName] = localName;
                            this.inputs.push(inputName);
                            this.inputsRename.push(inputNameRename);
                            this.propertyMap[inputName] = localName;
                            break;
                        case '@':
                        // handle the '<' binding of angular 1.5 components
                        case '<':
                            this.inputs.push(inputName);
                            this.inputsRename.push(inputNameRename);
                            this.propertyMap[inputName] = localName;
                            break;
                        case '&':
                            this.outputs.push(outputName);
                            this.outputsRename.push(outputNameRename);
                            this.propertyMap[outputName] = localName;
                            break;
                        default:
                            let /** @type {?} */ json = JSON.stringify(context);
                            throw new Error(`Unexpected mapping '${type}' in '${json}' in '${this.name}' directive.`);
                    }
                }
            }
        }
    }
    /**
     * @param {?} compile
     * @param {?} templateCache
     * @param {?} httpBackend
     * @return {?}
     */
    compileTemplate(compile, templateCache, httpBackend) {
        if (this.directive.template !== undefined) {
            this.linkFn = compileHtml(isFunction(this.directive.template) ? this.directive.template() :
                this.directive.template);
        }
        else if (this.directive.templateUrl) {
            const /** @type {?} */ url = isFunction(this.directive.templateUrl) ? this.directive.templateUrl() :
                this.directive.templateUrl;
            const /** @type {?} */ html = templateCache.get(url);
            if (html !== undefined) {
                this.linkFn = compileHtml(html);
            }
            else {
                return new Promise((resolve, err) => {
                    httpBackend('GET', url, null, (status /** TODO #9100 */, response /** TODO #9100 */) => {
                        if (status == 200) {
                            resolve(this.linkFn = compileHtml(templateCache.put(url, response)));
                        }
                        else {
                            err(`GET ${url} returned ${status}: ${response}`);
                        }
                    });
                });
            }
        }
        else {
            throw new Error(`Directive '${this.name}' is not a component, it is missing template.`);
        }
        return null;
        /**
         * @param {?} html
         * @return {?}
         */
        function compileHtml(html /** TODO #9100 */) {
            const /** @type {?} */ div = document.createElement('div');
            div.innerHTML = html;
            return compile(div.childNodes);
        }
    }
    /**
     * Upgrade ng1 components into Angular.
     * @param {?} exportedComponents
     * @param {?} injector
     * @return {?}
     */
    static resolve(exportedComponents, injector) {
        const /** @type {?} */ promises = [];
        const /** @type {?} */ compile = injector.get($COMPILE);
        const /** @type {?} */ templateCache = injector.get($TEMPLATE_CACHE);
        const /** @type {?} */ httpBackend = injector.get($HTTP_BACKEND);
        const /** @type {?} */ $controller = injector.get($CONTROLLER);
        for (const /** @type {?} */ name in exportedComponents) {
            if (((exportedComponents)).hasOwnProperty(name)) {
                const /** @type {?} */ exportedComponent = exportedComponents[name];
                exportedComponent.directive = exportedComponent.extractDirective(injector);
                exportedComponent.$controller = $controller;
                exportedComponent.extractBindings();
                const /** @type {?} */ promise = exportedComponent.compileTemplate(compile, templateCache, httpBackend);
                if (promise)
                    promises.push(promise);
            }
        }
        return Promise.all(promises);
    }
}
class UpgradeNg1ComponentAdapter {
    /**
     * @param {?} linkFn
     * @param {?} scope
     * @param {?} directive
     * @param {?} elementRef
     * @param {?} $controller
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} propOuts
     * @param {?} checkProperties
     * @param {?} propertyMap
     */
    constructor(linkFn, scope, directive, elementRef, $controller, inputs, outputs, propOuts, checkProperties, propertyMap) {
        this.linkFn = linkFn;
        this.directive = directive;
        this.$controller = $controller;
        this.inputs = inputs;
        this.outputs = outputs;
        this.propOuts = propOuts;
        this.checkProperties = checkProperties;
        this.propertyMap = propertyMap;
        this.controllerInstance = null;
        this.destinationObj = null;
        this.checkLastValues = [];
        this.$element = null;
        this.element = elementRef.nativeElement;
        this.componentScope = scope.$new(!!directive.scope);
        this.$element = element(this.element);
        const controllerType = directive.controller;
        if (directive.bindToController && controllerType) {
            this.controllerInstance = this.buildController(controllerType);
            this.destinationObj = this.controllerInstance;
        }
        else {
            this.destinationObj = this.componentScope;
        }
        for (let i = 0; i < inputs.length; i++) {
            this /** TODO #9100 */[inputs[i]] = null;
        }
        for (let j = 0; j < outputs.length; j++) {
            const emitter = this /** TODO #9100 */[outputs[j]] = new EventEmitter();
            this.setComponentProperty(outputs[j], ((emitter /** TODO #9100 */) => (value /** TODO #9100 */) => emitter.emit(value))(emitter));
        }
        for (let k = 0; k < propOuts.length; k++) {
            this /** TODO #9100 */[propOuts[k]] = new EventEmitter();
            this.checkLastValues.push(INITIAL_VALUE$1);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.directive.bindToController && this.directive.controller) {
            this.controllerInstance = this.buildController(this.directive.controller);
        }
        if (this.controllerInstance && isFunction(this.controllerInstance.$onInit)) {
            this.controllerInstance.$onInit();
        }
        let /** @type {?} */ link = this.directive.link;
        if (typeof link == 'object')
            link = ((link)).pre;
        if (link) {
            const /** @type {?} */ attrs = NOT_SUPPORTED;
            const /** @type {?} */ transcludeFn = NOT_SUPPORTED;
            const /** @type {?} */ linkController = this.resolveRequired(this.$element, this.directive.require);
            ((this.directive.link))(this.componentScope, this.$element, attrs, linkController, transcludeFn);
        }
        const /** @type {?} */ childNodes = [];
        let /** @type {?} */ childNode;
        while (childNode = this.element.firstChild) {
            this.element.removeChild(childNode);
            childNodes.push(childNode);
        }
        this.linkFn(this.componentScope, (clonedElement, scope) => {
            for (let /** @type {?} */ i = 0, /** @type {?} */ ii = clonedElement.length; i < ii; i++) {
                this.element.appendChild(clonedElement[i]);
            }
        }, {
            parentBoundTranscludeFn: (scope /** TODO #9100 */, cloneAttach /** TODO #9100 */) => { cloneAttach(childNodes); }
        });
        if (this.controllerInstance && isFunction(this.controllerInstance.$postLink)) {
            this.controllerInstance.$postLink();
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        const /** @type {?} */ ng1Changes = {};
        Object.keys(changes).forEach(name => {
            const /** @type {?} */ change = changes[name];
            this.setComponentProperty(name, change.currentValue);
            ng1Changes[this.propertyMap[name]] = change;
        });
        if (isFunction(this.destinationObj.$onChanges)) {
            this.destinationObj.$onChanges(ng1Changes);
        }
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        const /** @type {?} */ destinationObj = this.destinationObj;
        const /** @type {?} */ lastValues = this.checkLastValues;
        const /** @type {?} */ checkProperties = this.checkProperties;
        for (let /** @type {?} */ i = 0; i < checkProperties.length; i++) {
            const /** @type {?} */ value = destinationObj[checkProperties[i]];
            const /** @type {?} */ last = lastValues[i];
            if (value !== last) {
                if (typeof value == 'number' && isNaN(value) && typeof last == 'number' && isNaN(last)) {
                }
                else {
                    const /** @type {?} */ eventEmitter = ((this) /** TODO #9100 */)[this.propOuts[i]];
                    eventEmitter.emit(lastValues[i] = value);
                }
            }
        }
        if (this.controllerInstance && isFunction(this.controllerInstance.$doCheck)) {
            this.controllerInstance.$doCheck();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.controllerInstance && isFunction(this.controllerInstance.$onDestroy)) {
            this.controllerInstance.$onDestroy();
        }
    }
    /**
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    setComponentProperty(name, value) {
        this.destinationObj[this.propertyMap[name]] = value;
    }
    /**
     * @param {?} controllerType
     * @return {?}
     */
    buildController(controllerType /** TODO #9100 */) {
        const /** @type {?} */ locals = { $scope: this.componentScope, $element: this.$element };
        const /** @type {?} */ controller = this.$controller(controllerType, locals, null, this.directive.controllerAs);
        this.$element.data(controllerKey(this.directive.name), controller);
        return controller;
    }
    /**
     * @param {?} $element
     * @param {?} require
     * @return {?}
     */
    resolveRequired($element, require) {
        if (!require) {
            return undefined;
        }
        else if (typeof require == 'string') {
            let /** @type {?} */ name = (require);
            let /** @type {?} */ isOptional = false;
            let /** @type {?} */ startParent = false;
            let /** @type {?} */ searchParents = false;
            if (name.charAt(0) == '?') {
                isOptional = true;
                name = name.substr(1);
            }
            if (name.charAt(0) == '^') {
                searchParents = true;
                name = name.substr(1);
            }
            if (name.charAt(0) == '^') {
                startParent = true;
                name = name.substr(1);
            }
            const /** @type {?} */ key = controllerKey(name);
            if (startParent)
                $element = $element.parent();
            const /** @type {?} */ dep = searchParents ? $element.inheritedData(key) : $element.data(key);
            if (!dep && !isOptional) {
                throw new Error(`Can not locate '${require}' in '${this.directive.name}'.`);
            }
            return dep;
        }
        else if (require instanceof Array) {
            const /** @type {?} */ deps = [];
            for (let /** @type {?} */ i = 0; i < require.length; i++) {
                deps.push(this.resolveRequired($element, require[i]));
            }
            return deps;
        }
        throw new Error(`Directive '${this.directive.name}' require syntax unrecognized: ${this.directive.require}`);
    }
}
/**
 * @param {?} value
 * @return {?}
 */
function isFunction(value) {
    return typeof value === 'function';
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
let upgradeCount = 0;
/**
 * Use `UpgradeAdapter` to allow AngularJS and Angular to coexist in a single application.
 *
 * The `UpgradeAdapter` allows:
 * 1. creation of Angular component from AngularJS component directive
 *    (See [UpgradeAdapter#upgradeNg1Component()])
 * 2. creation of AngularJS directive from Angular component.
 *    (See [UpgradeAdapter#downgradeNg2Component()])
 * 3. Bootstrapping of a hybrid Angular application which contains both of the frameworks
 *    coexisting in a single application.
 *
 * ## Mental Model
 *
 * When reasoning about how a hybrid application works it is useful to have a mental model which
 * describes what is happening and explains what is happening at the lowest level.
 *
 * 1. There are two independent frameworks running in a single application, each framework treats
 *    the other as a black box.
 * 2. Each DOM element on the page is owned exactly by one framework. Whichever framework
 *    instantiated the element is the owner. Each framework only updates/interacts with its own
 *    DOM elements and ignores others.
 * 3. AngularJS directives always execute inside AngularJS framework codebase regardless of
 *    where they are instantiated.
 * 4. Angular components always execute inside Angular framework codebase regardless of
 *    where they are instantiated.
 * 5. An AngularJS component can be upgraded to an Angular component. This creates an
 *    Angular directive, which bootstraps the AngularJS component directive in that location.
 * 6. An Angular component can be downgraded to an AngularJS component directive. This creates
 *    an AngularJS directive, which bootstraps the Angular component in that location.
 * 7. Whenever an adapter component is instantiated the host element is owned by the framework
 *    doing the instantiation. The other framework then instantiates and owns the view for that
 *    component. This implies that component bindings will always follow the semantics of the
 *    instantiation framework. The syntax is always that of Angular syntax.
 * 8. AngularJS is always bootstrapped first and owns the bottom most view.
 * 9. The new application is running in Angular zone, and therefore it no longer needs calls to
 *    `$apply()`.
 *
 * ### Example
 *
 * ```
 * const adapter = new UpgradeAdapter(forwardRef(() => MyNg2Module), myCompilerOptions);
 * const module = angular.module('myExample', []);
 * module.directive('ng2Comp', adapter.downgradeNg2Component(Ng2Component));
 *
 * module.directive('ng1Hello', function() {
 *   return {
 *      scope: { title: '=' },
 *      template: 'ng1[Hello {{title}}!](<span ng-transclude></span>)'
 *   };
 * });
 *
 *
 * \@Component({
 *   selector: 'ng2-comp',
 *   inputs: ['name'],
 *   template: 'ng2[<ng1-hello [title]="name">transclude</ng1-hello>](<ng-content></ng-content>)',
 *   directives:
 * })
 * class Ng2Component {
 * }
 *
 * \@NgModule({
 *   declarations: [Ng2Component, adapter.upgradeNg1Component('ng1Hello')],
 *   imports: [BrowserModule]
 * })
 * class MyNg2Module {}
 *
 *
 * document.body.innerHTML = '<ng2-comp name="World">project</ng2-comp>';
 *
 * adapter.bootstrap(document.body, ['myExample']).ready(function() {
 *   expect(document.body.textContent).toEqual(
 *       "ng2[ng1[Hello World!](transclude)](project)");
 * });
 *
 * ```
 *
 * \@stable
 */
class UpgradeAdapter {
    /**
     * @param {?} ng2AppModule
     * @param {?=} compilerOptions
     */
    constructor(ng2AppModule, compilerOptions) {
        this.ng2AppModule = ng2AppModule;
        this.compilerOptions = compilerOptions;
        this.idPrefix = `NG2_UPGRADE_${upgradeCount++}_`;
        this.downgradedComponents = [];
        /**
         * An internal map of ng1 components which need to up upgraded to ng2.
         *
         * We can't upgrade until injector is instantiated and we can retrieve the component metadata.
         * For this reason we keep a list of components to upgrade until ng1 injector is bootstrapped.
         *
         * \@internal
         */
        this.ng1ComponentsToBeUpgraded = {};
        this.upgradedProviders = [];
        this.moduleRef = null;
        if (!ng2AppModule) {
            throw new Error('UpgradeAdapter cannot be instantiated without an NgModule of the Angular app.');
        }
    }
    /**
     * Allows Angular Component to be used from AngularJS.
     *
     * Use `downgradeNg2Component` to create an AngularJS Directive Definition Factory from
     * Angular Component. The adapter will bootstrap Angular component from within the
     * AngularJS template.
     *
     * ## Mental Model
     *
     * 1. The component is instantiated by being listed in AngularJS template. This means that the
     *    host element is controlled by AngularJS, but the component's view will be controlled by
     *    Angular.
     * 2. Even thought the component is instantiated in AngularJS, it will be using Angular
     *    syntax. This has to be done, this way because we must follow Angular components do not
     *    declare how the attributes should be interpreted.
     * 3. `ng-model` is controlled by AngularJS and communicates with the downgraded Angular component
     *    by way of the `ControlValueAccessor` interface from \@angular/forms. Only components that
     *    implement this interface are eligible.
     *
     * ## Supported Features
     *
     * - Bindings:
     *   - Attribute: `<comp name="World">`
     *   - Interpolation:  `<comp greeting="Hello {{name}}!">`
     *   - Expression:  `<comp [name]="username">`
     *   - Event:  `<comp (close)="doSomething()">`
     *   - ng-model: `<comp ng-model="name">`
     * - Content projection: yes
     *
     * ### Example
     *
     * ```
     * const adapter = new UpgradeAdapter(forwardRef(() => MyNg2Module));
     * const module = angular.module('myExample', []);
     * module.directive('greet', adapter.downgradeNg2Component(Greeter));
     *
     * \@Component({
     *   selector: 'greet',
     *   template: '{{salutation}} {{name}}! - <ng-content></ng-content>'
     * })
     * class Greeter {
     *   \@Input() salutation: string;
     *   \@Input() name: string;
     * }
     *
     * \@NgModule({
     *   declarations: [Greeter],
     *   imports: [BrowserModule]
     * })
     * class MyNg2Module {}
     *
     * document.body.innerHTML =
     *   'ng1 template: <greet salutation="Hello" [name]="world">text</greet>';
     *
     * adapter.bootstrap(document.body, ['myExample']).ready(function() {
     *   expect(document.body.textContent).toEqual("ng1 template: Hello world! - text");
     * });
     * ```
     * @param {?} component
     * @return {?}
     */
    downgradeNg2Component(component) {
        this.downgradedComponents.push(component);
        return downgradeComponent({ component });
    }
    /**
     * Allows AngularJS Component to be used from Angular.
     *
     * Use `upgradeNg1Component` to create an Angular component from AngularJS Component
     * directive. The adapter will bootstrap AngularJS component from within the Angular
     * template.
     *
     * ## Mental Model
     *
     * 1. The component is instantiated by being listed in Angular template. This means that the
     *    host element is controlled by Angular, but the component's view will be controlled by
     *    AngularJS.
     *
     * ## Supported Features
     *
     * - Bindings:
     *   - Attribute: `<comp name="World">`
     *   - Interpolation:  `<comp greeting="Hello {{name}}!">`
     *   - Expression:  `<comp [name]="username">`
     *   - Event:  `<comp (close)="doSomething()">`
     * - Transclusion: yes
     * - Only some of the features of
     *   [Directive Definition Object](https://docs.angularjs.org/api/ng/service/$compile) are
     *   supported:
     *   - `compile`: not supported because the host element is owned by Angular, which does
     *     not allow modifying DOM structure during compilation.
     *   - `controller`: supported. (NOTE: injection of `$attrs` and `$transclude` is not supported.)
     *   - `controllerAs`: supported.
     *   - `bindToController`: supported.
     *   - `link`: supported. (NOTE: only pre-link function is supported.)
     *   - `name`: supported.
     *   - `priority`: ignored.
     *   - `replace`: not supported.
     *   - `require`: supported.
     *   - `restrict`: must be set to 'E'.
     *   - `scope`: supported.
     *   - `template`: supported.
     *   - `templateUrl`: supported.
     *   - `terminal`: ignored.
     *   - `transclude`: supported.
     *
     *
     * ### Example
     *
     * ```
     * const adapter = new UpgradeAdapter(forwardRef(() => MyNg2Module));
     * const module = angular.module('myExample', []);
     *
     * module.directive('greet', function() {
     *   return {
     *     scope: {salutation: '=', name: '=' },
     *     template: '{{salutation}} {{name}}! - <span ng-transclude></span>'
     *   };
     * });
     *
     * module.directive('ng2', adapter.downgradeNg2Component(Ng2Component));
     *
     * \@Component({
     *   selector: 'ng2',
     *   template: 'ng2 template: <greet salutation="Hello" [name]="world">text</greet>'
     * })
     * class Ng2Component {
     * }
     *
     * \@NgModule({
     *   declarations: [Ng2Component, adapter.upgradeNg1Component('greet')],
     *   imports: [BrowserModule]
     * })
     * class MyNg2Module {}
     *
     * document.body.innerHTML = '<ng2></ng2>';
     *
     * adapter.bootstrap(document.body, ['myExample']).ready(function() {
     *   expect(document.body.textContent).toEqual("ng2 template: Hello world! - text");
     * });
     * ```
     * @param {?} name
     * @return {?}
     */
    upgradeNg1Component(name) {
        if (((this.ng1ComponentsToBeUpgraded)).hasOwnProperty(name)) {
            return this.ng1ComponentsToBeUpgraded[name].type;
        }
        else {
            return (this.ng1ComponentsToBeUpgraded[name] = new UpgradeNg1ComponentAdapterBuilder(name))
                .type;
        }
    }
    /**
     * Registers the adapter's AngularJS upgrade module for unit testing in AngularJS.
     * Use this instead of `angular.mock.module()` to load the upgrade module into
     * the AngularJS testing injector.
     *
     * ### Example
     *
     * ```
     * const upgradeAdapter = new UpgradeAdapter(MyNg2Module);
     *
     * // configure the adapter with upgrade/downgrade components and services
     * upgradeAdapter.downgradeNg2Component(MyComponent);
     *
     * let upgradeAdapterRef: UpgradeAdapterRef;
     * let $compile, $rootScope;
     *
     * // We must register the adapter before any calls to `inject()`
     * beforeEach(() => {
     *   upgradeAdapterRef = upgradeAdapter.registerForNg1Tests(['heroApp']);
     * });
     *
     * beforeEach(inject((_$compile_, _$rootScope_) => {
     *   $compile = _$compile_;
     *   $rootScope = _$rootScope_;
     * }));
     *
     * it("says hello", (done) => {
     *   upgradeAdapterRef.ready(() => {
     *     const element = $compile("<my-component></my-component>")($rootScope);
     *     $rootScope.$apply();
     *     expect(element.html()).toContain("Hello World");
     *     done();
     *   })
     * });
     *
     * ```
     *
     * @param {?=} modules any AngularJS modules that the upgrade module should depend upon
     * @return {?} an {\@link UpgradeAdapterRef}, which lets you register a `ready()` callback to
     * run assertions once the Angular components are ready to test through AngularJS.
     */
    registerForNg1Tests(modules) {
        const /** @type {?} */ windowNgMock = ((window))['angular'].mock;
        if (!windowNgMock || !windowNgMock.module) {
            throw new Error('Failed to find \'angular.mock.module\'.');
        }
        this.declareNg1Module(modules);
        windowNgMock.module(this.ng1Module.name);
        const /** @type {?} */ upgrade = new UpgradeAdapterRef();
        this.ng2BootstrapDeferred.promise.then((ng1Injector) => { ((upgrade))._bootstrapDone(this.moduleRef, ng1Injector); }, onError);
        return upgrade;
    }
    /**
     * Bootstrap a hybrid AngularJS / Angular application.
     *
     * This `bootstrap` method is a direct replacement (takes same arguments) for AngularJS
     * [`bootstrap`](https://docs.angularjs.org/api/ng/function/angular.bootstrap) method. Unlike
     * AngularJS, this bootstrap is asynchronous.
     *
     * ### Example
     *
     * ```
     * const adapter = new UpgradeAdapter(MyNg2Module);
     * const module = angular.module('myExample', []);
     * module.directive('ng2', adapter.downgradeNg2Component(Ng2));
     *
     * module.directive('ng1', function() {
     *   return {
     *      scope: { title: '=' },
     *      template: 'ng1[Hello {{title}}!](<span ng-transclude></span>)'
     *   };
     * });
     *
     *
     * \@Component({
     *   selector: 'ng2',
     *   inputs: ['name'],
     *   template: 'ng2[<ng1 [title]="name">transclude</ng1>](<ng-content></ng-content>)'
     * })
     * class Ng2 {
     * }
     *
     * \@NgModule({
     *   declarations: [Ng2, adapter.upgradeNg1Component('ng1')],
     *   imports: [BrowserModule]
     * })
     * class MyNg2Module {}
     *
     * document.body.innerHTML = '<ng2 name="World">project</ng2>';
     *
     * adapter.bootstrap(document.body, ['myExample']).ready(function() {
     *   expect(document.body.textContent).toEqual(
     *       "ng2[ng1[Hello World!](transclude)](project)");
     * });
     * ```
     * @param {?} element
     * @param {?=} modules
     * @param {?=} config
     * @return {?}
     */
    bootstrap(element$$1, modules, config) {
        this.declareNg1Module(modules);
        const /** @type {?} */ upgrade = new UpgradeAdapterRef();
        // Make sure resumeBootstrap() only exists if the current bootstrap is deferred
        const /** @type {?} */ windowAngular = ((window) /** TODO #???? */)['angular'];
        windowAngular.resumeBootstrap = undefined;
        this.ngZone.run(() => { bootstrap(element$$1, [this.ng1Module.name], config); });
        const /** @type {?} */ ng1BootstrapPromise = new Promise((resolve) => {
            if (windowAngular.resumeBootstrap) {
                const /** @type {?} */ originalResumeBootstrap = windowAngular.resumeBootstrap;
                windowAngular.resumeBootstrap = function () {
                    windowAngular.resumeBootstrap = originalResumeBootstrap;
                    windowAngular.resumeBootstrap.apply(this, arguments);
                    resolve();
                };
            }
            else {
                resolve();
            }
        });
        Promise.all([this.ng2BootstrapDeferred.promise, ng1BootstrapPromise]).then(([ng1Injector]) => {
            element(element$$1).data(controllerKey(INJECTOR_KEY), this.moduleRef.injector);
            this.moduleRef.injector.get(NgZone).run(() => { ((upgrade))._bootstrapDone(this.moduleRef, ng1Injector); });
        }, onError);
        return upgrade;
    }
    /**
     * Allows AngularJS service to be accessible from Angular.
     *
     *
     * ### Example
     *
     * ```
     * class Login { ... }
     * class Server { ... }
     *
     * \@Injectable()
     * class Example {
     *   constructor(\@Inject('server') server, login: Login) {
     *     ...
     *   }
     * }
     *
     * const module = angular.module('myExample', []);
     * module.service('server', Server);
     * module.service('login', Login);
     *
     * const adapter = new UpgradeAdapter(MyNg2Module);
     * adapter.upgradeNg1Provider('server');
     * adapter.upgradeNg1Provider('login', {asToken: Login});
     *
     * adapter.bootstrap(document.body, ['myExample']).ready((ref) => {
     *   const example: Example = ref.ng2Injector.get(Example);
     * });
     *
     * ```
     * @param {?} name
     * @param {?=} options
     * @return {?}
     */
    upgradeNg1Provider(name, options) {
        const /** @type {?} */ token = options && options.asToken || name;
        this.upgradedProviders.push({
            provide: token,
            useFactory: ($injector) => $injector.get(name),
            deps: [$INJECTOR]
        });
    }
    /**
     * Allows Angular service to be accessible from AngularJS.
     *
     *
     * ### Example
     *
     * ```
     * class Example {
     * }
     *
     * const adapter = new UpgradeAdapter(MyNg2Module);
     *
     * const module = angular.module('myExample', []);
     * module.factory('example', adapter.downgradeNg2Provider(Example));
     *
     * adapter.bootstrap(document.body, ['myExample']).ready((ref) => {
     *   const example: Example = ref.ng1Injector.get('example');
     * });
     *
     * ```
     * @param {?} token
     * @return {?}
     */
    downgradeNg2Provider(token) { return downgradeInjectable(token); }
    /**
     * Declare the AngularJS upgrade module for this adapter without bootstrapping the whole
     * hybrid application.
     *
     * This method is automatically called by `bootstrap()` and `registerForNg1Tests()`.
     *
     * @param {?=} modules The AngularJS modules that this upgrade module should depend upon.
     * @return {?} The AngularJS upgrade module that is declared by this method
     *
     * ### Example
     *
     * ```
     * const upgradeAdapter = new UpgradeAdapter(MyNg2Module);
     * upgradeAdapter.declareNg1Module(['heroApp']);
     * ```
     */
    declareNg1Module(modules = []) {
        const /** @type {?} */ delayApplyExps = [];
        let /** @type {?} */ original$applyFn;
        let /** @type {?} */ rootScopePrototype;
        let /** @type {?} */ rootScope;
        const /** @type {?} */ upgradeAdapter = this;
        const /** @type {?} */ ng1Module = this.ng1Module = module$1(this.idPrefix, modules);
        const /** @type {?} */ platformRef = platformBrowserDynamic();
        this.ngZone = new NgZone({ enableLongStackTrace: Zone.hasOwnProperty('longStackTraceZoneSpec') });
        this.ng2BootstrapDeferred = new Deferred();
        ng1Module.factory(INJECTOR_KEY, () => this.moduleRef.injector.get(Injector))
            .constant(NG_ZONE_KEY, this.ngZone)
            .factory(COMPILER_KEY, () => this.moduleRef.injector.get(Compiler))
            .config([
            '$provide', '$injector',
            (provide, ng1Injector) => {
                provide.decorator($ROOT_SCOPE, [
                    '$delegate',
                    function (rootScopeDelegate) {
                        // Capture the root apply so that we can delay first call to $apply until we
                        // bootstrap Angular and then we replay and restore the $apply.
                        rootScopePrototype = rootScopeDelegate.constructor.prototype;
                        if (rootScopePrototype.hasOwnProperty('$apply')) {
                            original$applyFn = rootScopePrototype.$apply;
                            rootScopePrototype.$apply = (exp) => delayApplyExps.push(exp);
                        }
                        else {
                            throw new Error('Failed to find \'$apply\' on \'$rootScope\'!');
                        }
                        return rootScope = rootScopeDelegate;
                    }
                ]);
                if (ng1Injector.has($$TESTABILITY)) {
                    provide.decorator($$TESTABILITY, [
                        '$delegate',
                        function (testabilityDelegate) {
                            const /** @type {?} */ originalWhenStable = testabilityDelegate.whenStable;
                            // Cannot use arrow function below because we need the context
                            const /** @type {?} */ newWhenStable = function (callback) {
                                originalWhenStable.call(this, function () {
                                    const /** @type {?} */ ng2Testability = upgradeAdapter.moduleRef.injector.get(Testability);
                                    if (ng2Testability.isStable()) {
                                        callback.apply(this, arguments);
                                    }
                                    else {
                                        ng2Testability.whenStable(newWhenStable.bind(this, callback));
                                    }
                                });
                            };
                            testabilityDelegate.whenStable = newWhenStable;
                            return testabilityDelegate;
                        }
                    ]);
                }
            }
        ]);
        ng1Module.run([
            '$injector', '$rootScope',
            (ng1Injector, rootScope) => {
                UpgradeNg1ComponentAdapterBuilder.resolve(this.ng1ComponentsToBeUpgraded, ng1Injector)
                    .then(() => {
                    // At this point we have ng1 injector and we have lifted ng1 components into ng2, we
                    // now can bootstrap ng2.
                    const /** @type {?} */ DynamicNgUpgradeModule = NgModule({
                        providers: [
                            { provide: $INJECTOR, useFactory: () => ng1Injector },
                            { provide: $COMPILE, useFactory: () => ng1Injector.get($COMPILE) },
                            this.upgradedProviders
                        ],
                        imports: [this.ng2AppModule],
                        entryComponents: this.downgradedComponents
                    }).Class({
                        constructor: function DynamicNgUpgradeModule() { },
                        ngDoBootstrap: function () { }
                    });
                    ((platformRef))
                        ._bootstrapModuleWithZone(DynamicNgUpgradeModule, this.compilerOptions, this.ngZone)
                        .then((ref) => {
                        this.moduleRef = ref;
                        this.ngZone.run(() => {
                            if (rootScopePrototype) {
                                rootScopePrototype.$apply = original$applyFn; // restore original $apply
                                while (delayApplyExps.length) {
                                    rootScope.$apply(delayApplyExps.shift());
                                }
                                rootScopePrototype = null;
                            }
                        });
                    })
                        .then(() => this.ng2BootstrapDeferred.resolve(ng1Injector), onError)
                        .then(() => {
                        let /** @type {?} */ subscription = this.ngZone.onMicrotaskEmpty.subscribe({ next: () => rootScope.$digest() });
                        rootScope.$on('$destroy', () => { subscription.unsubscribe(); });
                    });
                })
                    .catch((e) => this.ng2BootstrapDeferred.reject(e));
            }
        ]);
        return ng1Module;
    }
}
/**
 * Use `UpgradeAdapterRef` to control a hybrid AngularJS / Angular application.
 *
 * \@stable
 */
class UpgradeAdapterRef {
    constructor() {
        this._readyFn = null;
        this.ng1RootScope = null;
        this.ng1Injector = null;
        this.ng2ModuleRef = null;
        this.ng2Injector = null;
    }
    /**
     * @param {?} ngModuleRef
     * @param {?} ng1Injector
     * @return {?}
     */
    _bootstrapDone(ngModuleRef, ng1Injector) {
        this.ng2ModuleRef = ngModuleRef;
        this.ng2Injector = ngModuleRef.injector;
        this.ng1Injector = ng1Injector;
        this.ng1RootScope = ng1Injector.get($ROOT_SCOPE);
        this._readyFn && this._readyFn(this);
    }
    /**
     * Register a callback function which is notified upon successful hybrid AngularJS / Angular
     * application has been bootstrapped.
     *
     * The `ready` callback function is invoked inside the Angular zone, therefore it does not
     * require a call to `$apply()`.
     * @param {?} fn
     * @return {?}
     */
    ready(fn) { this._readyFn = fn; }
    /**
     * Dispose of running hybrid AngularJS / Angular application.
     * @return {?}
     */
    dispose() {
        this.ng1Injector.get($ROOT_SCOPE).$destroy();
        this.ng2ModuleRef.destroy();
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all public APIs of the upgrade/dynamic package, allowing
 * Angular 1 and Angular 2+ to run side by side in the same application.
 */

// This file only re-exports content of the `src` folder. Keep it that way.

/**
 * Generated bundle index. Do not edit.
 */

export { VERSION, UpgradeAdapter, UpgradeAdapterRef };
//# sourceMappingURL=upgrade.js.map
