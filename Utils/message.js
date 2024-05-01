const Generate_Message = (from, text) => {
  return {
    from: from,
    text: text,
    createdAt: new Date().toLocaleString(),
  };
};

module.exports = { Generate_Message };
