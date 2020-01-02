const request = require.context('@core/svgAssets', false, /\.svg$/);
request.keys().forEach(request);
export default {
    name: 'stc-svg-icon',
    props: ['name', 'fill', 'width', 'height'],
    methods: {
        clickEvent() {
            this.$emit('click');
        }
    },
    render() {
        const { name, fill = 'currentColor', width = 14, height = 14 } = this;
        const useStyle = {
            fill: fill
        }
        return (
            <svg onClick = {this.clickEvent.bind(this)} class="stc-svg-icon" width={ width } height={ height }>
                <use href={ '#icon-' + name } style={ useStyle }></use>
            </svg>
        )
    }
}