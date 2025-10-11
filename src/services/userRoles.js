// User Role Management System
import AsyncStorage from '@react-native-async-storage/async-storage';

// Role levels
export const USER_ROLES = {
  FAN: 'fan',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

// Role permissions
export const PERMISSIONS = {
  // Super Admin only
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_USERS: 'manage_users',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_ADMINS: 'manage_admins',
  
  // Admin and Super Admin
  CREATE_MATCH: 'create_match',
  UPDATE_MATCH: 'update_match',
  DELETE_MATCH: 'delete_match',
  CREATE_UPDATE: 'create_update',
  MANAGE_EVENTS: 'manage_events',
  
  // All users
  VIEW_MATCHES: 'view_matches',
  MAKE_PREDICTIONS: 'make_predictions',
  FAVORITE_MATCHES: 'favorite_matches',
};

// Get user role
export const getUserRole = async (userEmail) => {
  try {
    // Check if super admin
    const superAdminData = await AsyncStorage.getItem('superAdmins');
    const superAdmins = superAdminData ? JSON.parse(superAdminData) : [];
    if (superAdmins.includes(userEmail)) {
      return USER_ROLES.SUPER_ADMIN;
    }

    // Check if admin
    const adminData = await AsyncStorage.getItem('adminUsers');
    const admins = adminData ? JSON.parse(adminData) : [];
    if (admins.includes(userEmail)) {
      return USER_ROLES.ADMIN;
    }

    // Default to fan
    return USER_ROLES.FAN;
  } catch (error) {
    console.error('Error getting user role:', error);
    return USER_ROLES.FAN;
  }
};

// Check if user has permission
export const hasPermission = async (userEmail, permission) => {
  const role = await getUserRole(userEmail);
  
  const rolePermissions = {
    [USER_ROLES.SUPER_ADMIN]: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.MANAGE_ADMINS,
      PERMISSIONS.CREATE_MATCH,
      PERMISSIONS.UPDATE_MATCH,
      PERMISSIONS.DELETE_MATCH,
      PERMISSIONS.CREATE_UPDATE,
      PERMISSIONS.MANAGE_EVENTS,
      PERMISSIONS.VIEW_MATCHES,
      PERMISSIONS.MAKE_PREDICTIONS,
      PERMISSIONS.FAVORITE_MATCHES,
    ],
    [USER_ROLES.ADMIN]: [
      PERMISSIONS.CREATE_MATCH,
      PERMISSIONS.UPDATE_MATCH,
      PERMISSIONS.DELETE_MATCH,
      PERMISSIONS.CREATE_UPDATE,
      PERMISSIONS.MANAGE_EVENTS,
      PERMISSIONS.VIEW_MATCHES,
      PERMISSIONS.MAKE_PREDICTIONS,
      PERMISSIONS.FAVORITE_MATCHES,
    ],
    [USER_ROLES.FAN]: [
      PERMISSIONS.VIEW_MATCHES,
      PERMISSIONS.MAKE_PREDICTIONS,
      PERMISSIONS.FAVORITE_MATCHES,
    ],
  };

  return rolePermissions[role]?.includes(permission) || false;
};

// Check if user is super admin
export const isSuperAdmin = async (userEmail) => {
  const role = await getUserRole(userEmail);
  return role === USER_ROLES.SUPER_ADMIN;
};

// Check if user is admin or super admin
export const isAdminOrAbove = async (userEmail) => {
  const role = await getUserRole(userEmail);
  return role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN;
};

// Make user super admin
export const makeSuperAdmin = async (userEmail) => {
  try {
    const superAdminData = await AsyncStorage.getItem('superAdmins');
    const superAdmins = superAdminData ? JSON.parse(superAdminData) : [];
    
    if (!superAdmins.includes(userEmail)) {
      superAdmins.push(userEmail);
      await AsyncStorage.setItem('superAdmins', JSON.stringify(superAdmins));
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to make super admin' };
  }
};

// Remove super admin
export const removeSuperAdmin = async (userEmail) => {
  try {
    const superAdminData = await AsyncStorage.getItem('superAdmins');
    const superAdmins = superAdminData ? JSON.parse(superAdminData) : [];
    
    const updated = superAdmins.filter(email => email !== userEmail);
    await AsyncStorage.setItem('superAdmins', JSON.stringify(updated));
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to remove super admin' };
  }
};

// Make user admin
export const makeAdmin = async (userEmail) => {
  try {
    const adminData = await AsyncStorage.getItem('adminUsers');
    const admins = adminData ? JSON.parse(adminData) : [];
    
    if (!admins.includes(userEmail)) {
      admins.push(userEmail);
      await AsyncStorage.setItem('adminUsers', JSON.stringify(admins));
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to make admin' };
  }
};

// Remove admin
export const removeAdmin = async (userEmail) => {
  try {
    const adminData = await AsyncStorage.getItem('adminUsers');
    const admins = adminData ? JSON.parse(adminData) : [];
    
    const updated = admins.filter(email => email !== userEmail);
    await AsyncStorage.setItem('adminUsers', JSON.stringify(updated));
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to remove admin' };
  }
};

// Get role display name
export const getRoleDisplayName = (role) => {
  const names = {
    [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
    [USER_ROLES.ADMIN]: 'Admin',
    [USER_ROLES.FAN]: 'Fan',
  };
  return names[role] || 'Fan';
};

// Get role color
export const getRoleColor = (role) => {
  const colors = {
    [USER_ROLES.SUPER_ADMIN]: '#f44336', // Red
    [USER_ROLES.ADMIN]: '#ff9800', // Orange
    [USER_ROLES.FAN]: '#4FC3F7', // Blue
  };
  return colors[role] || '#4FC3F7';
};

// Get role icon
export const getRoleIcon = (role) => {
  const icons = {
    [USER_ROLES.SUPER_ADMIN]: 'shield-crown',
    [USER_ROLES.ADMIN]: 'shield-account',
    [USER_ROLES.FAN]: 'account',
  };
  return icons[role] || 'account';
};

// Initialize first user as super admin
export const initializeSuperAdmin = async (userEmail) => {
  try {
    const superAdminData = await AsyncStorage.getItem('superAdmins');
    const superAdmins = superAdminData ? JSON.parse(superAdminData) : [];
    
    // If no super admins exist, make this user super admin
    if (superAdmins.length === 0) {
      await makeSuperAdmin(userEmail);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error initializing super admin:', error);
    return false;
  }
};
