export default {
  colors: {
    primary: {
      50: "#FFFFFF",
      100: "#ECF8F2",
      200: "#C6EBD8",
      300: "#8ED7B0",
      400: "#55C389",
      500: "#38A169",
      600: "#2E8456",
      700: "#215E3E",
      800: "#143925",
      900: "#000000",
    },
  },
  formatters: {
    dateTimeFormatter: (date: Date) =>
      `${date.toLocaleString("fr-CA").replace(/,.+/, "")} ${date.toLocaleString(
        "en-US",
        {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }
      )}`,
    dateFormatter: (date: Date) =>
      date.toLocaleString("fr-CA").replace(/,.+/, ""), // replace T and everything after with nothing
  },
  formats: {
    reactDatePickerDateFormat: "yyyy-MM-dd h:mm a",
  },
};
