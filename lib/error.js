// FORMAT ERROR THROWN TO THE CLIENT
const Error = (err, type, code) => {
  const error = {
    message: err,
    type,
    code,
  };
  return error;
};

module.exports = Error;
