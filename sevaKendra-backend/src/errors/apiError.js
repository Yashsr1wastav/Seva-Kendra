class APIError extends Error {
  statusCode;
  success;
  constructor(messageOrStatusCode, statusCodeOrMessage) {
    const statusCode =
      typeof messageOrStatusCode === "number"
        ? messageOrStatusCode
        : statusCodeOrMessage;
    const message =
      typeof messageOrStatusCode === "number"
        ? statusCodeOrMessage
        : messageOrStatusCode;

    super(typeof message === "string" ? message : "An error occurred");
    this.statusCode =
      typeof statusCode === "number" && Number.isInteger(statusCode)
        ? statusCode
        : 500;
    this.success = false;
  }
}

const generateAPIError = async (msg, statusCode) => {
  console.log(msg, statusCode, "error");

  throw new APIError(msg, statusCode);
};

export { generateAPIError, APIError };
