import Button from './src/main';
import './button.scss';
/* istannul ignore next */
Button.install = function(Vue) {
    Vue.component(Button.name, Button);
};
export default Button;
