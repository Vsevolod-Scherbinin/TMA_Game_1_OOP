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
  const closureDate = localStorage.getItem('closureTime');
  // console.log('closureDate', closureDate);

  if(closureDate !== null || undefined) {
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
