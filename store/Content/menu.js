export const state = () => {
  return {
    allMenus: [],
    imgURL: 'http://localhost:8000/storage/images/content/menu/'
  }
};

export const getters = {
  GET_Menus(state) {
    return state.allMenus;
  },
};

export const mutations = {
  SET_Menus(state, AllMenus) {
    state.allMenus = AllMenus;
  },
};

export const actions = {
  // *****
  getAllMenus({commit}) {
    return this.$axios.$get('content/menu', {
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(response => {
        console.log(response);
        let AllMenus = response.menus;
        commit('SET_Menus', AllMenus);
      })
      .catch(e => {
        console.log(e)
      })
  },
};

