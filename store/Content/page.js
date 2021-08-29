export const state = () => {
  return {
    allPages: [],
  }
};

export const getters = {
  GET_Pages(state) {
    return state.allPages;
  },
};

export const mutations = {
  SET_Pages(state, AllPages) {
    state.allPages = AllPages;
  },
};

export const actions = {
  // *****
  getAllPages({commit}) {
    return this.$axios.$get('content/page', {
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(response => {
        console.log(response);
        let AllPages = response.pages;
        commit('SET_Pages', AllPages);
      })
      .catch(e => {
        console.log(e)
      })
  },
};

