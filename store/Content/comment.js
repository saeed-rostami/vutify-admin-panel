export const state = () => {
  return {
    allComments: [],
  }
};

export const getters = {
  GET_COMMENTS(state) {
    return state.allComments;
  },
};

export const mutations = {
  SET_Comments(state, allComments) {
    state.allComments = allComments;
  },
};

export const actions = {
  // *****
  getAllComments({commit}) {
    return this.$axios.$get('content/comment', {
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(response => {
        let AllComments = response.comments;
        console.log(AllComments);
        commit('SET_Comments', AllComments);
      })
      .catch(e => {
        console.log(e)
      })
  },
};

