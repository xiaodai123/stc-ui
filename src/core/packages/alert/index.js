import Alert from './src/main';
import './alert.scss';
/* istannul ignore next */
Alert.install = function(Vue) {
    Vue.component(Alert.name, Alert);
};
export default Alert;
