/**
 * Utility for normalizing and handling reservation status
 * Ensures consistency across frontend components
 * 
 * Business Logic:
 * - Backend creates reservations as CONFIRMADA
 * - Within deadline: CONFIRMADA (green)
 * - 1-2 days overdue: PENDENTE (yellow/warning)
 * - 2+ days overdue: CANCELADA (not shown in dashboard)
 * - Only CONFIRMADA and PENDENTE are displayed
 */

export const STATUS = {
  CONFIRMADA: 'CONFIRMADA',
  PENDENTE: 'PENDENTE',
  CANCELADA: 'CANCELADA'
};

/**
 * Normalizes status to uppercase without accents
 * @param {string} status - Status in any format
 * @returns {string|null} Normalized status or null
 */
export const normalizeStatus = (status) => {
  if (!status) return null;
  
  return status
    .toString()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim();
};

/**
 * Calculates dynamic status based on dtLimite (deadline)
 * Business rules:
 * - Within deadline: CONFIRMADA
 * - 1-2 days overdue: PENDENTE
 * - 2+ days overdue: CANCELADA (should be hidden)
 * 
 * @param {string|Date} dtLimite - Deadline date
 * @param {string} currentStatus - Current status from backend
 * @returns {string} Calculated status
 */
export const calculateStatusByDeadline = (dtLimite, currentStatus = 'CONFIRMADA') => {
  const normalizedStatus = normalizeStatus(currentStatus);
  if (normalizedStatus === STATUS.PENDENTE || normalizedStatus === STATUS.CANCELADA) {
    return normalizedStatus;
  }
  // Só reclassifica CONFIRMADA conforme o prazo
  if (!dtLimite) return normalizedStatus;

  const now = new Date();
  const deadline = new Date(dtLimite);

  // Calculate difference in days
  const diffTime = now - deadline;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Within deadline
  if (diffDays <= 0) {
    return STATUS.CONFIRMADA;
  }

  // 1-2 days overdue
  if (diffDays <= 2) {
    return STATUS.PENDENTE;
  }

  // 2+ days overdue
  return STATUS.CANCELADA;
};

/**
 * Checks if reservation should be displayed (not cancelled by time)
 * @param {string|Date} dtLimite - Deadline date
 * @returns {boolean} True if should be displayed
 */
export const shouldDisplayReservation = (dtLimite) => {
  const status = calculateStatusByDeadline(dtLimite);
  return status !== STATUS.CANCELADA;
};

/**
 * Gets display-friendly status text (Portuguese with proper capitalization)
 * @param {string} status - Status in any format
 * @param {string|Date} dtLimite - Optional deadline to calculate dynamic status
 * @returns {string} Display-friendly status
 */
export const getStatusDisplay = (status, dtLimite = null) => {
  // Calculate dynamic status if dtLimite provided
  const effectiveStatus = dtLimite 
    ? calculateStatusByDeadline(dtLimite, status)
    : normalizeStatus(status);
  
  const displayMap = {
    'CONFIRMADA': 'Confirmada',
    'PENDENTE': 'Pendente',
    'CANCELADA': 'Cancelada'
  };
  
  return displayMap[effectiveStatus] || status || 'Desconhecido';
};

/**
 * Gets CSS class for status badge
 * @param {string} status - Status in any format
 * @param {string|Date} dtLimite - Optional deadline to calculate dynamic status
 * @returns {string} CSS class name
 */
export const getStatusClass = (status, dtLimite = null) => {
  // Calculate dynamic status if dtLimite provided
  const effectiveStatus = dtLimite 
    ? calculateStatusByDeadline(dtLimite, status)
    : normalizeStatus(status);
  
  const classMap = {
    'CONFIRMADA': 'status-ok',           // Verde - dentro do prazo
    'PENDENTE': 'status-inconsistente',  // Amarelo/Aviso - atrasado 1-2 dias
    'CANCELADA': 'status-cancelada'      // Vermelho - não deve aparecer
  };
  
  return classMap[effectiveStatus] || 'status-ok';
};

/**
 * Checks if two statuses are equal (case and accent insensitive)
 * @param {string} status1 
 * @param {string} status2 
 * @returns {boolean}
 */
export const isStatusEqual = (status1, status2) => {
  return normalizeStatus(status1) === normalizeStatus(status2);
};

/**
 * Checks if status is cancelled
 * @param {string} status 
 * @param {string|Date} dtLimite - Optional deadline to calculate dynamic status
 * @returns {boolean}
 */
export const isCancelled = (status, dtLimite = null) => {
  const effectiveStatus = dtLimite 
    ? calculateStatusByDeadline(dtLimite, status)
    : normalizeStatus(status);
  return effectiveStatus === STATUS.CANCELADA;
};

/**
 * Checks if status is pending (1-2 days overdue)
 * @param {string} status 
 * @param {string|Date} dtLimite - Optional deadline to calculate dynamic status
 * @returns {boolean}
 */
export const isPending = (status, dtLimite = null) => {
  const effectiveStatus = dtLimite 
    ? calculateStatusByDeadline(dtLimite, status)
    : normalizeStatus(status);
  return effectiveStatus === STATUS.PENDENTE;
};

/**
 * Checks if status is confirmed (within deadline)
 * @param {string} status 
 * @param {string|Date} dtLimite - Optional deadline to calculate dynamic status
 * @returns {boolean}
 */
export const isConfirmed = (status, dtLimite = null) => {
  const effectiveStatus = dtLimite 
    ? calculateStatusByDeadline(dtLimite, status)
    : normalizeStatus(status);
  return effectiveStatus === STATUS.CONFIRMADA;
};
