// const formatNumber = (number) => {
//   return new Intl.NumberFormat('en-US', {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2,
//       useGrouping: true,
//   }).format(number).replace(/,/g, ' ');
// };

const formatNumber = (number) => {
  // Преобразуем число в строку и проверяем его длину
  const numStr = number.toString();

  if (numStr.length > 5) {
    // Заменяем последние три разряда на 'k'
    console.log('numStr', numStr);

    const formattedNumber = numStr.slice(0, -3) + 'k';
    console.log('formattedNumber', formattedNumber);

    return formattedNumber;
  } else {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(number).replace(/,/g, ' ');
  }
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

function openLink(link) {
  window.open(`${link}`, '_blank');
}
