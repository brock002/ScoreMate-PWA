// get font color based on background color
const getFontColorBasedOnBGColor = (color: string) => {
	let R = 255,
		G = 255,
		B = 255
	const numbersInHexCode: string = color.split('#').at(1) || ''

	if (numbersInHexCode.length === 3) {
		R = parseInt(numbersInHexCode[0], 16)
		G = parseInt(numbersInHexCode[1], 16)
		B = parseInt(numbersInHexCode[2], 16)
	} else if (numbersInHexCode.length === 6) {
		R = parseInt(numbersInHexCode.slice(0, 2), 16)
		G = parseInt(numbersInHexCode.slice(2, 4), 16)
		B = parseInt(numbersInHexCode.slice(4), 16)
	}

	// Counting the perceptive luminance - human eye favors green color...
	const luminance = (0.299 * R + 0.587 * G + 0.114 * B) / 255

	// bright colors (luminance > 0.5) - black font, else white font
	return luminance > 0.5 ? '#000' : '#fff'
}

export { getFontColorBasedOnBGColor }
