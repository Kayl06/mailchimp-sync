const Contact = (function () {
    const form = document.querySelector(".__form");
    return {
      init: () => {
        form.addEventListener("submit", Contact.formSubmit);
      },
  
      formSubmit: async (e) => {
        e.preventDefault();
  
        let formData = new FormData(form);
  
        var object = {};
        formData.forEach((value, key) => (object[key] = value));
        var obj = object;
  
        req_obj = {
          email_address: obj.email,
          status_if_new: "subscribed",
          status: "subscribed",
          merge_fields: {
            FNAME: obj.fname,
            LNAME: obj.lname,
            ADDRESS: {
              addr1: obj.address1,
              addr2: obj.address2,
              city: obj.city,
              state: obj.state,
              country: obj.country,
              zip: obj.zip,
            },
            PHONE: obj.phone_number,
          },
        };
  
        res = await Contact.add(req_obj);
  
        if (res.hasOwnProperty("response")) {
          const responseMessage = JSON.parse(res.response.text);
  
          if (responseMessage.title !== "Member Exists") {
            Notification.error(
              `Error`,
              `${responseMessage.detail} Please contact the administrator. `
            );
            return;
          } else {
            Notification.success(
              `Successfully Saved!`,
              `${req_obj.email_address} is already exists`
            );
            return;
          }
        }
  
        Notification.success(
          `Successfully Saved!`,
          `${req_obj.email_address} is successfully added`
        );
  
        setTimeout(() => {
          GetMembers.init();
          form.reset();
          Modal.hide();
        }, 1000);
      },
  
      add: (req_obj) => {
        return new Promise((resolve, reject) => {
          fetch("/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(req_obj),
          })
            .then((response) => response.json())
            .then((data) => {
              resolve(data);
            })
            .catch((error) => {
              console.error("Error sending data to server:", error);
              reject(error);
            });
        });
      }
    };
  })();
  
  Contact.init();
  