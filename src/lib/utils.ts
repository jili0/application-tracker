/**
 * Convert date string to sort value
 */
export const getDateSortValue = (dateStr: string): number => {
  if (!dateStr) return Infinity;
  const match = dateStr.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (match) {
    const [_, day, month, year] = match;
    return parseInt(`${year}${month}${day}`);
  }
  return Infinity;
};

/**
 * Sort applications by status first, then by date
 * Order: answered -> no-answer -> rejected
 */
export const sortApplications = (applications: any[]): any[] => {
  const statusOrder = {
    'answered': 0,
    'no-answer': 1,
    'rejected': 2
  };

  return [...applications].sort((a, b) => {
    // First sort by status
    const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 1;
    const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 1;
    
    if (statusA !== statusB) {
      return statusA - statusB;
    }

    // Then sort by date
    const dateA = getDateSortValue(a.date);
    const dateB = getDateSortValue(b.date);
    
    return dateB - dateA; // Newest first within each status group
  });
};

/**
 * Format date from various input formats
 * Supports:
 * - "08" (day only) -> "08.04.2025"
 * - "0804" (day and month) -> "08.04.2025"
 * - "080425" (day, month, year) -> "08.04.2025"
 * - "08042025" (day, month, year) -> "08.04.2025"
 */
export const formatDate = (inputDate: string): string => {
  const today = new Date();
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const currentYear = today.getFullYear();
  
  // Remove any non-numeric characters
  const cleanInput = inputDate.replace(/\D/g, '');
  
  // Format day only ("08")
  if (cleanInput.match(/^\d{2}$/)) {
    const day = cleanInput;
    return `${day}.${currentMonth}.${currentYear}`;
  }
  
  // Format day and month ("0804")
  if (cleanInput.match(/^\d{4}$/)) {
    const day = cleanInput.substring(0, 2);
    const month = cleanInput.substring(2, 4);
    return `${day}.${month}.${currentYear}`;
  }
  
  // Format day, month, year (2-digit) ("080425")
  if (cleanInput.match(/^\d{6}$/)) {
    const day = cleanInput.substring(0, 2);
    const month = cleanInput.substring(2, 4);
    const year = 2000 + parseInt(cleanInput.substring(4, 6));
    return `${day}.${month}.${year}`;
  }
  
  // Format day, month, year (4-digit) ("08042025")
  if (cleanInput.match(/^\d{8}$/)) {
    const day = cleanInput.substring(0, 2);
    const month = cleanInput.substring(2, 4);
    const year = cleanInput.substring(4, 8);
    return `${day}.${month}.${year}`;
  }
  
  return inputDate;
};

/**
 * Create a standard HTTP request handler
 */
export const createApiHandler = (handler: Function) => {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';
      
      return { error: errorMessage, status: 500 };
    }
  };
};

/**
 * Highlight search text in content
 */
export const highlightText = (text: string, searchTerm: string): string => {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="highlight">$1</mark>');
};