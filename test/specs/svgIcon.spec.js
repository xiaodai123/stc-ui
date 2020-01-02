/* eslint-disable no-undef */
import { createTest, createVue, destroyVM } from '../util';
import SvgIcon from '@packages/svgIcon';
describe('SvgIcon', () => {
    let vm;
    // 在这个作用域的所有测试用例运行之前运行
    before(() => {});
    // 在这个作用域的所有测试用例运行完之后运行
    after(() => {})
    // 在这个作用域的每一个测试用例运行之前运行
    beforeEach(() => {})
    // 在这个作用域的每一个测试用例运行之后运行
    afterEach(() => {
        destroyVM(vm);
    });
    it('create', () => {
        vm = createTest(SvgIcon, {
            name: 'dashboard'
        }, true);
        expect(vm.$el).to.exist;
        expect(vm.$options.name).to.equal('stc-svg-icon');
    })
});