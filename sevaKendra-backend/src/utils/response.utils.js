const responseUtils = {
  success: (resp, { data, status = 200, message = undefined }) => {
    return resp.status(status).send({ data, success: true, message });
  },
};

// Additional helper function for education modules
const successResponse = (res, data, message, status = 200) => {
  return res.status(status).send({ data, success: true, message });
};

export { responseUtils, successResponse };
