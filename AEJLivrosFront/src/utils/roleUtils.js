export const ROLES = {
  ADMIN: 'admin',
  CLIENTE: 'cliente'
};

const ROLE_DISPLAY_NAMES = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.CLIENTE]: 'Cliente'
};

const ROLE_FULL_NAMES = {
  [ROLES.ADMIN]: 'Administrador do Sistema',
  [ROLES.CLIENTE]: 'Cliente do Sistema'
};

export const normalizeRole = (role) => {
  if (!role) return ROLES.CLIENTE;
  
  const normalized = role.toString().toLowerCase().trim();
  
  if (normalized === ROLES.ADMIN || normalized === ROLES.CLIENTE) {
    return normalized;
  }
  
  return ROLES.CLIENTE;
};

export const extractRole = (data) => {
  if (!data) return ROLES.CLIENTE;
  
  const role = data.cargo || data.tipoUsuario || data.tipo_usuario || data.role;
  
  return normalizeRole(role);
};

export const isAdmin = (role) => {
  return normalizeRole(role) === ROLES.ADMIN;
};

export const isCliente = (role) => {
  return normalizeRole(role) === ROLES.CLIENTE;
};

export const getRoleDisplayName = (role) => {
  const normalized = normalizeRole(role);
  return ROLE_DISPLAY_NAMES[normalized] || ROLE_DISPLAY_NAMES[ROLES.CLIENTE];
};

export const getRoleFullName = (role) => {
  const normalized = normalizeRole(role);
  return ROLE_FULL_NAMES[normalized] || ROLE_FULL_NAMES[ROLES.CLIENTE];
};

export const getRedirectRoute = (role) => {
  return isAdmin(role) ? '/dashboard' : '/catalogo';
};
