export const validateSchema = (schema, source = 'body') => (req, res, next) => {
    try {
      const dataToValidate =
        source === 'params'
          ? req.params
          : source === 'query'
          ? req.query
          : req.body;
  
      schema.parse(dataToValidate);
      next();
    } catch (error) {
      return res
        .status(400)
        .json(error.errors.map((err) => err.message));
    }
  };
  