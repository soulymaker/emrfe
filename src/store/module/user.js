import api from '@/api/api'
import storage from '@/util/storage'
import {STORAGE_KEY} from '@/util/constants'

const state = {
  user: {}
};
const getters = {
  user: state => state.user || {},
  isAdminRole: (state, getters) => {
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
  }
}
const mutations = {
  ['SET_USER'] (state, user) {
    state.user = user;
    storage.set(STORAGE_KEY.AUTHED, !!user)
  }
}
const actions = {
  getProfile ({commit}) {
    commit('SET_USER', {
      user: {}
    });
    storage.clear();
    api.getUserInfo().then(res => {
      commit('SET_USER', res.data.user)
    })
  },
  clearProfile ({commit}) {
    commit('SET_USER', {
      user: {}
    });
    storage.clear()
  }
};
export default {
  state, getters, actions, mutations
}
