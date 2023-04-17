const FileUpload = (function () {
  const fileInput = document.querySelector('input[type="file"]');
  const loadingIcon = document.querySelector(".__loading_icon");
  const fileImportBtn = document.querySelector(".__file_import");
  const fileImportBtnLbl = document.querySelector(".__label");

  return {
    init: () => {
      fileInput.addEventListener("change", async (event) => {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = async () => {
          const csv = reader.result;
          const lines = csv.split("\n");
          const headers = lines[0].split(",");
          const result = [];
          const emails = [];

          fileImportBtnLbl.textContent = "IMPORTING...";
          fileImportBtn.disabled = true;
          fileExportButton.disabled = true;
          loadingIcon.classList.remove("hidden");

          membersTable.deleteRow(0);
          membersTable.innerHTML = "";

          for (let i = 1; i < lines.length; i++) {
            const obj = {};
            const currentLine = lines[i].split(",");

            for (let j = 0; j < headers.length; j++) {
              obj[headers[j].replace(/\w+\\/, "").replace(/ /g, "_")] =
                currentLine[j];
            }

            if (emails.includes(obj["Email_Email_address"])) {
              continue;
            }

            req_obj = {
              email_address: obj["Email_Email_address"],
              status_if_new: "subscribed",
              status: "subscribed",
              merge_fields: {
                FNAME: obj["First_name"],
                LNAME: obj["Last/Organization/Group/Household_name"],
                ADDRESS: {
                  addr1: obj["Address_line_1"],
                  addr2: obj["Address_line_2"],
                  city: obj["City"],
                  state: obj["State_abbreviation"],
                  country: obj["Country_abbreviation"],
                  zip: obj["ZIP"],
                },
                PHONE: obj["Number"],
              },
            };

            result.push(req_obj);
            emails.push(obj["Email_Email_address"]);
           
            let address = req_obj.merge_fields.ADDRESS && `${req_obj.merge_fields.ADDRESS.addr1} ${req_obj.merge_fields.ADDRESS.addr2} ${req_obj.merge_fields.ADDRESS.city} ${req_obj.merge_fields.ADDRESS.country} ${req_obj.merge_fields.ADDRESS.state} ${req_obj.merge_fields.ADDRESS.zip}`;

            data.push({
              email_address: req_obj.email_address,
              first_name: req_obj.merge_fields.FNAME,
              last_name: req_obj.merge_fields.LNAME,
              address: address,
              phone: req_obj.merge_fields.PHONE,
            });

            const res = await Contact.add(req_obj);

            rowData = req_obj;

            if (res.hasOwnProperty("response")) {
              const responseMessage = JSON.parse(res.response.text);

              if (responseMessage.title === "Member Exists") {
                GetMembers.addRow(rowData);
              }
            } else {
              GetMembers.addRow({
                email_address: res.email_address,
                merge_fields: res.merge_fields,
              });
            }

            document.querySelector(
              `.__total_contacts`
            ).innerHTML = `<span class="text-[#666666] __total_contacts">Importing contacts... #${i}</span>`;

            document.querySelector(`.__tfoot`).innerHTML = `
          <div class="text-[12px] font-bold">
                                <td class="pt-[20px]" colspan="10">1-${i}</td>
                            </div>`;
          }

          document.querySelector(
            `.__total_contacts`
          ).innerHTML = `<span class="text-[#666666] __total_contacts font-[600]">Total # of unique contacts: ${result.length}.</span>`;

          document
            .querySelector(`.__success_message`)
            .classList.remove(`hidden`);

          membersTable.classList.remove(`hidden`);
          fileImportBtnLbl.textContent = "IMPORT CSV";
          fileImportBtn.disabled = false;
          fileExportButton.disabled = false;
          loadingIcon.classList.add("hidden");
          GetMembers.init();

        };
      });
    },

    handleOpenFileInput: () => {
      fileInput.click();
    },
  };
})();

FileUpload.init();
