const membersTable = document.querySelector(`.__member_table`);
const loadingRow = document.querySelector(`.__loading_row`);
const fileExportButton = document.querySelector(`.__file_export`);
let data = [];

const GetMembers = (function () {
  return {
    init: async (isImmediateLoad = true) => {
      if (!isImmediateLoad) {
        GetMembers.noDataHTML();
        return;
      }

      loadingRow.classList.remove("hidden");

      await GetMembers.getRequest().then((members) => {
        if (!members.length) {
          GetMembers.noDataHTML();
          return;
        }

        membersTable.deleteRow(0);
        membersTable.innerHTML = "";
        members.map((member, i) => {
          GetMembers.addRow(member);

          let address = member.merge_fields.ADDRESS && `${member.merge_fields.ADDRESS.addr1} ${member.merge_fields.ADDRESS.addr2} ${member.merge_fields.ADDRESS.city} ${member.merge_fields.ADDRESS.country} ${member.merge_fields.ADDRESS.state} ${member.merge_fields.ADDRESS.zip}`
          
          data.push({
            email_address: member.email_address,
            first_name: member.merge_fields.FNAME,
            last_name: member.merge_fields.LNAME,
            address: address,
            phone: member.merge_fields.PHONE,
          });
        });

        document.querySelector(
          `.__total_contacts`
        ).textContent = `Total # of contacts: ${members.length}`;
        document.querySelector(`.__tfoot`).innerHTML = `
        <div class="text-[12px] font-bold">
                              <td class="pt-[20px]" colspan="10">1-${members.length}</td>
                          </div>`;

        fileExportButton.removeAttribute("disabled");
      });
    },

    getRequest: () => {
      return new Promise((resolve, reject) => {
        fetch("/getMembers")
          .then((response) => response.json())
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      });
    },

    addRow: (rowData) => {
      let address =
        rowData.merge_fields.ADDRESS &&
        `<td class="py-[20px]">${rowData.merge_fields.ADDRESS.addr1} ${rowData.merge_fields.ADDRESS.addr2} ${rowData.merge_fields.ADDRESS.city} ${rowData.merge_fields.ADDRESS.country} ${rowData.merge_fields.ADDRESS.state} ${rowData.merge_fields.ADDRESS.zip}</td>`;
      const newRowHTML = `
      <tr class="border-b text-[13px]">
          <td class="py-[20px] font-[600]"> ${
            membersTable.rows.length + 1
          } </td>
          <td class="py-[20px]">${rowData.email_address}</td>
          <td class="py-[20px]">${rowData.merge_fields.FNAME}</td>
          <td class="py-[20px]">${rowData.merge_fields.LNAME}</td>
          ${address}
          <td class="py-[20px]">${rowData.merge_fields.PHONE}</td>
      </tr>
  `;
      // Append the new row to the table using insertAdjacentHTML
      membersTable.insertAdjacentHTML("beforeend", newRowHTML);
    },

    noDataHTML: () => {
      loadingRow.classList.add("hidden");
      membersTable.innerHTML = `<tr align="center">
      <td colspan=10  class="p-[50px]">No members were found.</td>
    </tr>`;
    },
  };
})();

GetMembers.init();
