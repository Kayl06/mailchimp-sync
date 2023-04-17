const Notification = (function () {
    const notification = document.querySelector(`.__notification`);
    const header_message = document.querySelector(`.__header_message`);
    const detailed_m = document.querySelector(`.__detailed_message`);
    const svg_el = document.querySelector(`.__svg`);
    let svg = ``;
  
    return {
      init: () => {},
  
      success: (message, detail) => {
        notification.classList.remove("hidden");
        notification.classList.add("flex");
  
        header_message.innerHTML = message;
        detailed_m.innerHTML = detail;
  
        svg = `<svg width="24" height="24" viewBox="0 0 1792 1792" fill="#44C997"
          xmlns="http://www.w3.org/2000/svg">
          <path
              d="M1299 813l-422 422q-19 19-45 19t-45-19l-294-294q-19-19-19-45t19-45l102-102q19-19 45-19t45 19l147 147 275-275q19-19 45-19t45 19l102 102q19 19 19 45t-19 45zm141 83q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" />
      </svg>`;
  
        svg_el.innerHTML = svg;
        Notification.reset();
      },
  
      error: (message, detail) => {
        notification.classList.remove("hidden");
        notification.classList.add("flex");
  
        header_message.innerHTML = message;
        detailed_m.innerHTML = detail;
  
        svg = `<svg style="color: red" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm5.793-4.207a1 1 0 0 1 1.414 0L12 10.586l2.793-2.793a1 1 0 1 1 1.414 1.414L13.414 12l2.793 2.793a1 1 0 0 1-1.414 1.414L12 13.414l-2.793 2.793a1 1 0 0 1-1.414-1.414L10.586 12 7.793 9.207a1 1 0 0 1 0-1.414z" fill="red"></path></svg>`;
  
        svg_el.innerHTML = svg;
        Notification.reset();
      },
  
      reset: () => {
        setTimeout(() => {
          notification.classList.add("hidden");
          notification.classList.remove("flex");
        }, 4000);
      },
    };
  })();
  