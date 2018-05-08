import yqtCalendar from './calendar.vue'
const calendar = {
    install :function(Vue, options) {
        Vue.component(yqtCalendar.name, yqtCalendar)  // vuePayKeyboard.name 组件的name属性
    }
};
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(calendar);
}
export default calendar // 导出..
