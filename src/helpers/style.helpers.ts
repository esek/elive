/**
 * Converts an object of styles to inline css.
 * Ex: `{width: '10px', height: '10px'}` converts to 'width: 10px; height: 10px;'
 * @param styles Object of styles to inline
 * @returns CSS stringified version of the object
 */

export const toInlineStyles = (styles: Record<string, string>) => {
	return Object.entries(styles).reduce((prev, [key, value]) => {
		return `${prev} ${key}: ${value};`;
	}, '');
};
