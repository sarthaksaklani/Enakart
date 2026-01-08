import { UserRole } from '@/types';

export const roleGuard = (userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

export const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'seller':
      return '/seller/catalog';
    case 'reseller':
      return '/reseller/bulk-orders';
    case 'customer':
    default:
      return '/account';
  }
};

export const getHomePath = (role: UserRole): string => {
  switch (role) {
    case 'seller':
      return '/seller/catalog';
    case 'reseller':
      return '/reseller/bulk-orders';
    case 'customer':
    default:
      return '/';
  }
};
