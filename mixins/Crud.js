import Notiflix from "notiflix";

class Crud {

  //DELETE
  static delete(id, axios, path) {
    Notiflix.Loading.circle();
    axios.$delete(path + id, {
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((response => {
        Notiflix.Loading.remove();
        console.log(response);
        if (response.status === 200) {
          Notiflix.Notify.success(
            "   عملیات موفقیت آمیز",
            {
              position: 'right-bottom',
            }
          );
        }
      })).catch((error) => {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(
        "   عملیات نا موفق",
        {
          position: 'right-bottom',
        }
      );
    });

  }

  //STORE
  static store(form, axios, path) {
    Notiflix.Loading.circle();
    axios.$post(path, form, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
      .then((response => {
        Notiflix.Loading.remove();
        console.log(response);
        if (response.status === 200) {
          Notiflix.Notify.success(
            "   عملیات موفقیت آمیز",
            {
              position: 'right-bottom',
            }
          );
        }
      })).catch((error) => {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(
        "   عملیات نا موفق",
        {
          position: 'right-bottom',
        }
      );
    });

  }

  //UPDATE
  static update(form, axios, path, id) {
    Notiflix.Loading.circle();
    axios.$post(path + id, form, {
      headers: {
        'content-type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    })
      .then((response => {
        Notiflix.Loading.remove();
        console.log(response);
        if (response.status === 200) {
          Notiflix.Notify.success(
            "   عملیات موفقیت آمیز",
            {
              position: 'right-bottom',
            }
          );
        }
      })).catch((error) => {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(
        "   عملیات نا موفق",
        {
          position: 'right-bottom',
        }
      );
    });

  }
}

export default Crud;
