/**
 * Helper function for logging array to table
 * @param array The array to log in table
 * @param breakString The string to seperate the console information
 */
export const tableLogData = (array: any, breakString: string) => {
    console.log(`----------------${breakString}------------`);
    console.table(array);
};

/**
 * Format the number to two decimal places
 * @param val number to format
 */
export const formatNumber = (val: number): number => {
    return Number.parseFloat(val.toFixed(2));
};
