const response = {
  success(data: any) {
    return {
      code: "0",
      msg: "success",
      data,
    };
  },

  error(msg: string) {
    return {
      code: "400",
      msg,
    };
  },
};

export default response;
