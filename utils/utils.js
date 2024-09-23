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

function offlineTimeCounter() {
  const closureDate = localStorage.getItem('closureTime');
  if(closureDate) {
    const now = new Date();
    const closureTime = new Date(closureDate);
    const timeDelta = now - closureTime
    const timeDeltaInSeconds = Math.floor(timeDelta / 1000);
    return timeDeltaInSeconds;
  }
}
