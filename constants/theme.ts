import { Dimensions } from 'react-native';
import { COLORS } from './colors';

const { width, height } = Dimensions.get('window');

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  margin: 20,

  // Font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h3: 18,
  h4: 16,
  h5: 14,
  body1: 16,
  body2: 14,
  body3: 12,
  body4: 10,

  // App dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: { fontFamily: 'Inter-SemiBold', fontSize: SIZES.largeTitle, lineHeight: 55 },
  h1: { fontFamily: 'Inter-SemiBold', fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: 'Inter-SemiBold', fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: 'Inter-SemiBold', fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: 'Inter-SemiBold', fontSize: SIZES.h4, lineHeight: 20 },
  h5: { fontFamily: 'Inter-Medium', fontSize: SIZES.h5, lineHeight: 18 },
  body1: { fontFamily: 'Inter-Regular', fontSize: SIZES.body1, lineHeight: 24 },
  body2: { fontFamily: 'Inter-Regular', fontSize: SIZES.body2, lineHeight: 21 },
  body3: { fontFamily: 'Inter-Regular', fontSize: SIZES.body3, lineHeight: 18 },
  body4: { fontFamily: 'Inter-Regular', fontSize: SIZES.body4, lineHeight: 14 },
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dark: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
};

const appTheme = { COLORS, SIZES, FONTS, SHADOWS };

export default appTheme;