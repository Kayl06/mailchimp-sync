const DownloadMembers = (function () {
  const defaultFileName = "mailchimp-contacts.csv";

  return {
    init: () => {},

    go: (file_name = null) => {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        DownloadMembers.convertArrayOfObjectsToCSV(data);

      const encodedUri = encodeURI(csvContent);

      const link = document.createElement("a");

      link.setAttribute("href", encodedUri);
      link.setAttribute("download", file_name ?? defaultFileName);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    convertArrayOfObjectsToCSV: (array) => {
      const fields = Object.keys(array[0]).map((field) =>
        field
          .replace(/[^\w\s]/gi, "")
          .toLowerCase()
          .replace(/\s+/g, "_")
      );
      const csvContent = fields.join(", ") + "\n";

      const rows = array.map((obj) => {
        const sanitizedRow = fields.map((field) => {
          const value = obj[field];
          if (typeof value === "string") {
            return value
              .replace(/[^\w\s]/gi, "")
              .replace(/\s+/g, " ")
              .trim();
          } else {
            return value;
          }
        });
        return sanitizedRow;
      });

      const rowsContent = rows.map((row) => row.join(", ")).join("\n");

      return csvContent + rowsContent;
    },
  };
})();
