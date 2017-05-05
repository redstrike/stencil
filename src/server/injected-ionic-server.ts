import { ConfigApi, DomControllerApi, Ionic } from '../util/interfaces';
import { noop } from '../util/helpers';
import { themeVNodeData } from '../client/host';


export function initInjectedIonic(ConfigCtrl: ConfigApi, DomCtrl: DomControllerApi) {

  const injectedIonic: Ionic = {
    theme: themeVNodeData,
    emit: noop,
    listener: {
      enable: noop,
      add: function() { return noop; }
    },
    controllers: {},
    config: ConfigCtrl,
    dom: DomCtrl
  };

  return injectedIonic;
}