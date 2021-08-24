class Crud {

  //DELETE
  static delete(id, axios, path) {
    axios.$delete(path + id, {
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((response => {
        console.log(response);
        if (response.status === 200) {
        }
      })).catch((error) => {
    });

  }

  //STORE
  static store(form, axios, path) {
    axios.$post(path, form, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
      .then((response => {
        console.log(response);
        if (response.status === 200) {
        }
      })).catch((error) => {
    });

  }

  //UPDATE
  static update(form, axios, path, id) {
    axios.$post(path + id, form, {
      headers: {
        'content-type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    })
      .then((response => {
        console.log(response);
        if (response.status === 200) {
        }
      })).catch((error) => {
    });

  }
}

export default Crud;
