import VError from 'verror';
import { ATATUS_REQ_FIELDS } from './constants';

// Take a single Error or array of Errors and return an array of errors that
// have message prefixed.
export function handleError(err, prefix = 'AtatusSourceMapPlugin') {
  if (!err) {
    return [];
  }

  const errors = [].concat(err);
  return errors.map(e => new VError(e, prefix));
}

// Validate required options and return an array of errors or null if there
// are no errors.
export function validateOptions(ref) {
  const errors = ATATUS_REQ_FIELDS.reduce((result, field) => {
    if (ref && ref[field]) {
      return result;
    }

    return [
      ...result,
      new Error(`required field, '${field}', is missing.`)
    ];
  }, []);

  return errors.length ? errors : null;
}
