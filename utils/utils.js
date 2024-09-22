const formatNumberWithSpaces = (number) => {
  return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true,
  }).format(number).replace(/,/g, ' ');
};

function convertStringToNumber(str) {
  // Убираем все пробелы
  const noSpaces = str.replace(/\s+/g, '');
  // Преобразуем строку в число
  const number = Number(noSpaces);
  return number;
}
