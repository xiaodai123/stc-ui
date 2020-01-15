
/* eslint-disable no-undef */
import { createTest, createVue, destroyVM } from '../util';
import Button from '@packages/button';
describe('Button', () => {
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
        vm = createTest(Button, true);
        expect(vm.$el).to.exist;
        expect(vm.$options.name).to.equal('STCButton');
    })
});

