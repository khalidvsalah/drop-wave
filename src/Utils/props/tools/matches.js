import regexs from './regexs';

/**
 * Get CSS property
 * @param {string} name - property short name.
 * @return {Function} - get properties function.
 */
export default function matchs(name) {
  const length = regexs.length;
  for (let i = 0; i < length; i++) {
    const regex = regexs[i];
    if (name.match(regex[0])) return regex[1];
  }
}
