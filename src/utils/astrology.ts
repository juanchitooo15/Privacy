export interface ZodiacInfo {
  sign: string;
  element: 'Fuego' | 'Tierra' | 'Aire' | 'Agua';
  symbol: string;
  period: string;
}

export function calculateAge(birthDateStr: string): number {
  if (!birthDateStr) return 0;
  const birth = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

export function getZodiacInfo(birthDateStr: string): ZodiacInfo {
  if (!birthDateStr) {
    return { sign: 'Desconocido', element: 'Tierra', symbol: '✦', period: '' };
  }
  const date = new Date(birthDateStr);
  // Using UTC or local month/day
  const month = date.getUTCMonth() + 1; // 1 - 12
  const day = date.getUTCDate();

  // Aries: Mar 21 - Apr 19 (Fuego)
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return { sign: 'Aries', element: 'Fuego', symbol: '♈', period: '21 Mar - 19 Abr' };
  }
  // Tauro: Apr 20 - May 20 (Tierra)
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return { sign: 'Tauro', element: 'Tierra', symbol: '♉', period: '20 Abr - 20 May' };
  }
  // Géminis: May 21 - Jun 20 (Aire)
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return { sign: 'Géminis', element: 'Aire', symbol: '♊', period: '21 May - 20 Jun' };
  }
  // Cáncer: Jun 21 - Jul 22 (Agua)
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return { sign: 'Cáncer', element: 'Agua', symbol: '♋', period: '21 Jun - 22 Jul' };
  }
  // Leo: Jul 23 - Aug 22 (Fuego)
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return { sign: 'Leo', element: 'Fuego', symbol: '♌', period: '23 Jul - 22 Ago' };
  }
  // Virgo: Aug 23 - Sep 22 (Tierra)
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return { sign: 'Virgo', element: 'Tierra', symbol: '♍', period: '23 Ago - 22 Sep' };
  }
  // Libra: Sep 23 - Oct 22 (Aire)
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return { sign: 'Libra', element: 'Aire', symbol: '♎', period: '23 Sep - 22 Oct' };
  }
  // Escorpio: Oct 23 - Nov 21 (Agua)
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return { sign: 'Escorpio', element: 'Agua', symbol: '♏', period: '23 Oct - 21 Nov' };
  }
  // Sagitario: Nov 22 - Dec 21 (Fuego)
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return { sign: 'Sagitario', element: 'Fuego', symbol: '♐', period: '22 Nov - 21 Dic' };
  }
  // Capricornio: Dec 22 - Jan 19 (Tierra)
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return { sign: 'Capricornio', element: 'Tierra', symbol: '♑', period: '22 Dic - 19 Ene' };
  }
  // Acuario: Jan 20 - Feb 18 (Aire)
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return { sign: 'Acuario', element: 'Aire', symbol: '♒', period: '20 Ene - 18 Feb' };
  }
  // Piscis: Feb 19 - Mar 20 (Agua)
  return { sign: 'Piscis', element: 'Agua', symbol: '♓', period: '19 Feb - 20 Mar' };
}

export function getElementColor(element: 'Fuego' | 'Tierra' | 'Aire' | 'Agua'): string {
  switch (element) {
    case 'Fuego':
      return '#EF5350';
    case 'Tierra':
      return '#B4E197';
    case 'Aire':
      return '#81D4FA';
    case 'Agua':
      return '#64B5F6';
    default:
      return '#B4E197';
  }
}
