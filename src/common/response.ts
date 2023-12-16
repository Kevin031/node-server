const response = {
  success(data: any) {
    return {
      code: '200',
      msg: 'success',
      data
    }
  },

  error(msg: string, code = '400') {
    return {
      code,
      msg
    }
  }
}

export default response
