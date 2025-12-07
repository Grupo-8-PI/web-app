const BRAZILIAN_TIMEZONE = 'America/Sao_Paulo';

/**
 * Parses backend date string (UTC without "Z") and returns as UTC Date
 * Backend sends: "2025-12-07T09:05:05.689280" (UTC time from server)
 * This function treats it as UTC by appending "Z"
 * 
 * @param {string|Date} dateString - Date string from backend or Date object
 * @returns {Date|null} Date object in UTC
 */
export const parseBackendDate = (dateString) => {
  if (!dateString) return null;
  
  if (dateString instanceof Date) return dateString;
  
  try {
    if (!dateString.includes('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
      return new Date(`${dateString}Z`);
    }
    return new Date(dateString);
  } catch (error) {
    console.error('Error parsing backend date:', dateString, error);
    return null;
  }
};

/**
 * Converts UTC date to Brazilian timezone (UTC-3)
 * @param {string|Date} date - Date in UTC or Date object
 * @returns {Date} Date object in Brazilian timezone
 */
export const toBrazilianDate = (date) => {
  if (!date) return null;
  const utcDate = parseBackendDate(date);
  if (!utcDate) return null;
  
  const brazilianDateString = utcDate.toLocaleString('en-US', { 
    timeZone: BRAZILIAN_TIMEZONE 
  });
  return new Date(brazilianDateString);
};

/**
 * Formats date to Brazilian format with time (DD/MM/YYYY, HH:MM)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateTimeBR = (date) => {
  if (!date) return 'N/A';
  const utcDate = parseBackendDate(date);
  if (!utcDate) return 'N/A';
  return utcDate.toLocaleString('pt-BR', {
    timeZone: BRAZILIAN_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formats date to Brazilian format without time (DD/MM/YYYY)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateBR = (date) => {
  if (!date) return 'N/A';
  const utcDate = parseBackendDate(date);
  if (!utcDate) return 'N/A';
  return utcDate.toLocaleDateString('pt-BR', {
    timeZone: BRAZILIAN_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Calculates days difference between two dates in Brazilian timezone
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {number} Number of days difference
 */
export const calculateDaysDifference = (startDate, endDate) => {
  const start = toBrazilianDate(startDate);
  const end = toBrazilianDate(endDate);
  
  if (!start || !end) return 0;
  
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const diffMs = end - start;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Calculates remaining days from now until a target date (Brazilian timezone)
 * @param {string|Date} targetDate - Target date
 * @returns {number} Number of remaining days
 */
export const calculateRemainingDays = (targetDate) => {
  const now = toBrazilianDate(new Date());
  const target = toBrazilianDate(targetDate);
  
  if (!target) return 0;
  
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  
  const diffMs = target - now;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Formats remaining days into human-readable text
 * @param {string|Date} targetDate - Target date
 * @returns {string} Human-readable remaining days text
 */
export const formatRemainingDays = (targetDate) => {
  const days = calculateRemainingDays(targetDate);
  
  if (days < 0) return 'Expirada';
  if (days === 0) return 'Expira hoje';
  if (days === 1) return '1 dia restante';
  return `${days} dias restantes`;
};

/**
 * Checks if a date is in the past (Brazilian timezone)
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (date) => {
  const now = toBrazilianDate(new Date());
  const target = toBrazilianDate(date);
  
  if (!target) return false;
  
  return target < now;
};

/**
 * Checks if a date is today (Brazilian timezone)
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  const now = toBrazilianDate(new Date());
  const target = toBrazilianDate(date);
  
  if (!target) return false;
  
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  
  return now.getTime() === target.getTime();
};

/**
 * Gets current date/time in Brazilian timezone
 * @returns {Date} Current date in Brazilian timezone
 */
export const getNowBR = () => {
  return toBrazilianDate(new Date());
};
