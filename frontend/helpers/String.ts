/**
 * @function Capitalize
 * @access Public
 * @param text: string
 */
export const Capitalize = (text: string) => {
	return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
};
