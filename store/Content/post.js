export const state = () => {
  return {
    allPosts: [],
    imgURL: 'http://localhost:8000/'
  }
};

export const getters = {
  GET_POSTS(state) {
    return state.allPosts;
  },
};

export const mutations = {
  SET_POSTS(state, allPosts) {
    state.allPosts = allPosts;
  },
};

export const actions = {
  // *****
  getAllPosts({commit}) {
    return this.$axios.$get('content/post', {
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(response => {
        let AllPosts = response.posts;
        commit('SET_POSTS', AllPosts);
      })
      .catch(e => {
        console.log(e)
      })
  },
};

