import SvgIcon from './src/main';
import './svg-icon.scss';
/* istanbul ignore next */
SvgIcon.install = function(Vue) {
    Vue.component(SvgIcon.name, SvgIcon);
}
export default SvgIcon;