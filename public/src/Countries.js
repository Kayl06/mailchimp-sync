const Countries = (function () {
  var countries;
  return {
    init: async () => {
      countries = await Countries.get();

      let htmlOption = "";

      countries.map((country) => {
        const isSelected = country.code == "US" && "selected";
        htmlOption += `<option value="${country.code}" ${isSelected}>${country.name}</option>`;
      });

      document.querySelector(`.__select_countries`).innerHTML = htmlOption;
    },

    get: () => {
      return new Promise((resolve, reject) => {
        fetch("/getCountries")
          .then((response) => response.json())
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      });
    },
  };
})();

Countries.init();
