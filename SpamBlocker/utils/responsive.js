import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const scale = width / 320; // Based on iPhone 5/SE

export const responsiveFontSize = (size) => Math.round(size * scale);
export const responsiveHeight = (size) => Math.round((height * size) / 100);
export const responsiveWidth = (size) => Math.round((width * size) / 100);