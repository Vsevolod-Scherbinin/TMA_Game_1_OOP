const formatNumberWithSpaces = (number) => {
  return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true,
  }).format(number).replace(/,/g, ' ');
};
