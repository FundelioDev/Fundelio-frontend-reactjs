/**
 * Utility function để merge class names
 * Kết hợp clsx và tailwind-merge functionality
 */

export function cn(...inputs) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ')
    .split(' ')
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(' ');
}

// Alternative version with better conflict resolution
export function clsx(...inputs) {
  const classes = [];

  inputs.forEach((input) => {
    if (!input) return;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      Object.keys(input).forEach((key) => {
        if (input[key]) {
          classes.push(key);
        }
      });
    }
  });

  return classes.join(' ');
}
