const formatNumber = (number) => {
  const numStr = number.toString();

  if (numStr.length > 5) {
    const formattedNumber = numStr.slice(0, -3) + 'k';

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
  const noSpaces = str.replace(/\s+/g, '');
  const number = Number(noSpaces);
  return number;
}

const formatScoreNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(number).replace(/,/g, ' ');
};

function convertStringToNumber(str) {
  const noSpaces = str.replace(/\s+/g, '');
  const number = Number(noSpaces);
  return number;
}

// function offlineTimeCounter() {
//   try {
//     tg.CloudStorage.getItem('closureTime', (err, closureDate) => {
//       if(err) {
//         console.log('err', err);
//       }
//       else {
//         console.log('closureDate', closureDate);
//         if(closureDate !== (null ||  undefined)) {
//           console.log('closureDate', closureDate);
//           const now = new Date();
//           const closureTime = new Date(closureDate);
//           const timeDelta = now - closureTime
//           const timeDeltaInSeconds = Math.floor(timeDelta / 1000);
//           console.log('timeDeltaInSeconds', timeDeltaInSeconds);
//           return timeDeltaInSeconds;
//         }
//       }
//     });
//   } catch {}
// }

function offlineTimeCounter() {
  return new Promise((resolve, reject) => {
    try {
      tg.CloudStorage.getItem('closureTime', (err, closureDate) => {
        if (err) {
          console.log('err', err);
          reject(err); // Отправляем ошибку в reject
        } else {
          console.log('closureDate', closureDate);
          if (closureDate !== null && closureDate !== undefined) {
            const now = new Date();
            const closureTime = new Date(closureDate);
            const timeDelta = now - closureTime;
            const timeDeltaInSeconds = Math.floor(timeDelta / 1000);
            console.log('timeDeltaInSeconds', timeDeltaInSeconds);
            resolve(timeDeltaInSeconds); // Возвращаем результат через resolve
          } else {
            resolve(0); // Если closureDate не задан, возвращаем 0
          }
        }
      });
    } catch (error) {
      reject(error); // Обрабатываем ошибки
    }
  });
}

function openLink(link) {
  window.open(`${link}`, '_blank');
}
