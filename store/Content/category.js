export const state = () => {
  return {
    allPostCategories: [],
  }
};

export const getters = {
  GET_POST_CATEGORIES(state) {
    return state.allPostCategories;
  },
};

export const mutations = {
  SET_POST_CATEGORIES(state, AllPostCategories) {
    state.allPostCategories = AllPostCategories;
  },
};

export const actions = {
  // *****
  getAllPostCategories({commit}) {
    return this.$axios.$get('content/category', {
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(response => {
        console.log(response);
        let AllPostCategories = response.categories;
        commit('SET_POST_CATEGORIES', AllPostCategories);
      })
      .catch(e => {
        console.log(e)
      })
  },
};

