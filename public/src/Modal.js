const Modal = (function () {
  let modal;
  let modalID;

  return {
    init: (__id = ".__modal") => {
      modal = document.querySelector(__id);
    },

    show: () => {
      document.body.classList.add("overflow-hidden");
      modal.classList.remove("hidden");
    },

    hide: () => {
      document.body.classList.remove("overflow-hidden");
      modal.classList.add("hidden");
    },
  };
})();

Modal.init();
