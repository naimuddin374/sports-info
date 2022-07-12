const MANGLE_ALPHABET =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const MANGLE_ALPHABET_KEY =
  'LH7a1NypnIqcGzOveZwu5hbJ20kRQ9VTxfXUDjEF36K8sArSigdYCltPBMm4oW';
const MANGLE_ALPHABET_MAP = {};
const UNMANGLE_ALPHABET_MAP = {};

for (let i = 0; i < MANGLE_ALPHABET.length; i++) {
  MANGLE_ALPHABET_MAP[MANGLE_ALPHABET[i]] = MANGLE_ALPHABET_KEY[i];
  UNMANGLE_ALPHABET_MAP[MANGLE_ALPHABET_KEY[i]] = MANGLE_ALPHABET[i];
}

export function flattenResponse(response: { id: string; data: any }): any {
  if (Array.isArray(response.data)) {
    return {
      ID: response.id,
      ITEMS: response.data,
    };
  }

  return {
    ID: response.id,
    ...response.data,
  };
}

export function mangleString(s: string) {
  const buffer = [];
  for (let i = 0; i < s.length; i++) {
    buffer[i] = MANGLE_ALPHABET_MAP[s[i]];
  }
  return buffer.join('');
}

export function unmangleString(s: string) {
  const buffer = [];
  for (let i = 0; i < s.length; i++) {
    buffer[i] = UNMANGLE_ALPHABET_MAP[s[i]];
  }
  return buffer.join('');
}
