import { attributeChangedCallback } from '../../../element/attribute-changed';
import { ComponentController, Ionic } from '../../../utils/interfaces';
import { connectedCallback } from '../../../element/connected';
import { disconnectedCallback } from '../../../element/disconnected';
import { initComponentMeta } from '../../../element/proxy';
import { initRenderer } from '../../../renderer/core';
import { PlatformClient } from '../../../platform/platform-client';
import { update } from '../../../element/update';


const ionic: Ionic = (<any>window).Ionic = (<any>window).Ionic || {};

const plt = PlatformClient(window, document, ionic);
const renderer = initRenderer(plt);

const ctrls = new WeakMap<HTMLElement, ComponentController>();


Object.keys(ionic.components || {}).forEach(tag => {
  const cmpMeta = initComponentMeta(tag, ionic.components[tag]);

  plt.registerComponent(cmpMeta);

  // closure doesn't support outputting es6 classes (yet)
  // build step does some closure tricks by changing this class
  // to just a function for compiling, then changing it back to a class
  class ProxyElement extends HTMLElement {}

  (<any>ProxyElement).prototype.connectedCallback = function() {
    var ctrl: ComponentController = {};
    ctrls.set(this, ctrl);
    connectedCallback(plt, ionic.config, renderer, this, ctrl, cmpMeta);
  };

  (<any>ProxyElement).prototype.attributeChangedCallback = function(attrName: string, oldVal: string, newVal: string, namespace: string) {
    var ctrl = ctrls.get(this);
    if (ctrl) {
      attributeChangedCallback(ctrl.instance, cmpMeta, attrName, oldVal, newVal, namespace);
    }
  };

  (<any>ProxyElement).prototype.disconnectedCallback = function() {
    disconnectedCallback(ctrls.get(this));
    ctrls.delete(this);
  };

  (<any>ProxyElement).observedAttributes = cmpMeta.observedAttrs;

  window.customElements.define(tag, ProxyElement);
});