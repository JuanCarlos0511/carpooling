import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { useAppTheme } from '@/constants/theme';

export function GradientFill() {
  const theme = useAppTheme();
  const gradient = theme.gradients.primary;

  return (
    <Svg
      pointerEvents="none"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}
      viewBox="0 0 100 100"
    >
      <Defs>
        <LinearGradient id="hopn-primary-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <Stop offset="0%" stopColor={gradient.start} />
          <Stop offset="100%" stopColor={gradient.end} />
        </LinearGradient>
      </Defs>
      <Rect fill="url(#hopn-primary-gradient)" height="100" width="100" />
      {gradient.overlay !== 'transparent'
        ? <Rect fill={gradient.overlay} height="100" width="100" />
        : null}
    </Svg>
  );
}
