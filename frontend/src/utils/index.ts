import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatDate(date: Date): string {
  return format(date, 'MMM dd, yyyy HH:mm:ss');
}

export function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return 'text-green-600';
  if (status >= 300 && status < 400) return 'text-blue-600';
  if (status >= 400 && status < 500) return 'text-orange-600';
  if (status >= 500) return 'text-red-600';
  return 'text-gray-600';
}

export function getMethodColor(method: string): string {
  switch (method.toUpperCase()) {
    case 'GET': return 'text-green-600 bg-green-50';
    case 'POST': return 'text-blue-600 bg-blue-50';
    case 'PUT': return 'text-orange-600 bg-orange-50';
    case 'DELETE': return 'text-red-600 bg-red-50';
    case 'PATCH': return 'text-purple-600 bg-purple-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    // Check for relative URLs or placeholder variables
    const variableRegex = /\{\{[\w\s]+\}\}/g;
    const urlWithoutVariables = url.replace(variableRegex, 'placeholder');
    
    // Allow URLs without protocol
    if (urlWithoutVariables.startsWith('/') || urlWithoutVariables.includes('.')) {
      return true;
    }
    
    return false;
  }
}

export function parseJsonSafely(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function formatJson(text: string): string {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return text;
  }
}

export function downloadFile(content: string, filename: string, contentType = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = undefined;
      func(...args);
    };
    
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}