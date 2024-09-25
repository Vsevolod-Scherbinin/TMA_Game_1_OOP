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

function offlineTimeCounter() {
  try {
  const closureDate = localStorage.getItem('closureTime');

    // const closureDateCloud = window.Telegram.WebApp.CloudStorage.getItem('closureTime');
    window.Telegram.WebApp.CloudStorage.getItem('closureTime', (data) => {
      if (data) {
        console.log('Retrieved data:', data);
        // Доступ к значению closureTime
        const closureTime = data['closureTime'];
        console.log('Closure Time:', closureTime);
      } else {
        console.error('No data found for the specified keys.');
      }
    });

  console.log('closureDate', closureDate);
  console.log('closureDateCloud', closureDateCloud);
  console.log(closureDate !== (null ||  undefined));

  if(closureDate !== (null ||  undefined)) {
    const now = new Date();
    const closureTime = new Date(closureDate);
    const timeDelta = now - closureTime
    const timeDeltaInSeconds = Math.floor(timeDelta / 1000);
    return timeDeltaInSeconds;
  }
  } catch {}
}

function openLink(link) {
  window.open(`${link}`, '_blank');
}
