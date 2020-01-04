import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 任务列表
    list: [],
    // 文本框的内容
    inputValue: '',
    // 模拟的下一个Id
    nextId: 5,
    //
    viewKey: 'all'
  },
  mutations: {
    // 通过actions中的getList初始化数据
    initList (state, list) {
      state.list = list
    },
    // 为 store 中的 inputValue 赋值
    setInputValue (state, val) {
      state.inputValue = val
    },
    // 添加列表项
    addItem (state) {
      const obj = {
        // 生产环境中id是后台自动生成，模拟id
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    },
    // 根据Id删除对应的任务事项
    removeItem (state, id) {
      // 根据Id查找对应项的索引
      const i = state.list.findIndex(x => x.id === id)
      // 根据索引，删除对应的元素
      if (i !== -1) {
        state.list.splice(i, 1)
        state.nextId--
      }
    },
    // 修改列表项的选中状态
    changStatus (state, param) {
      const i = state.list.findIndex(x => x.id === param.id)
      if (i !== -1) {
        state.list[i].done = param.status
      }
    },
    // 清除已完成的任务
    cleanDone (state) {
      state.list = state.list.filter(x => !x.done)
    },
    // 修改视图的关键字
    changViewkey (state, key) {
      state.viewKey = key
    }
  },
  actions: {
    // 通过axios获取数据
    getList (context) {
      axios.get('https://jinyang79.github.io/dist/list.json').then(({ data }) => {
        // console.log(data)
        context.commit('initList', data)
      })
    }
  },
  getters: {
    // 统计未完成的任务的条数
    unDoneLength (state) {
      return state.list.filter(x => x.done === false).length
    },
    // 按需显示任务数据列表
    infolist (state) {
      if (state.viewKey === 'all') {
        return state.list
      }
      if (state.viewKey === 'undone') {
        return state.list.filter(x => !x.done)
      }
      if (state.viewKey === 'done') {
        return state.list.filter(x => x.done)
      }
      return state.list
    }
  }
})
