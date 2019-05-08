import storage from '@/util/storage'
import {STORAGE_KEY} from '@/util/constants'

const state = {
  user: {}
};
const getters = {
  user: state => state.user || {},
  isAdminRole: (state, getters) => {
    console.log('getters.user.userType === \'管理员\''+ (getters.user.userType === '管理员'));
    return getters.user.userType === '管理员'
  },
  isDoctorRole: (state, getters) => {
    return getters.user.userType === '医生'
  },
  isNurseRole: (state, getters) => {
    return getters.user.userType === '护士'
  },
  isPatientRole: (state, getters) => {
    return getters.user.userType === '患者'
  },
  isNotPatientRole: (state, getters) => {
    return getters.user.userType !== '患者'
  },
};
const mutations = {
  ['SET_USER'](state, user) {
    state.user = user;
    storage.set(user.userId, 'auth')
  }
};
const actions = {
  getProfile ({commit},user) {
    commit('SET_USER', user);
  },
  clearProfile () {
    storage.clear()
  }
};
export default {
  state, getters, actions, mutations
}
