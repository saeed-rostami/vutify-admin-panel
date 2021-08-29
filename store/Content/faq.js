export const state = () => {
  return {
    allFAQS: [],
  }
};

export const getters = {
  GET_FAQS(state) {
    return state.allFAQS;
  },
};

export const mutations = {
  SET_FAQS(state, AllFAQS) {
    state.allFAQS = AllFAQS;
  },
};

export const actions = {
  // *****
  getAllFaqs({commit}) {
    return this.$axios.$get('content/faq', {
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(response => {
        console.log(response);
        let AllFAQS = response.faqs;
        commit('SET_FAQS', AllFAQS);
      })
      .catch(e => {
        console.log(e)
      })
  },
};

