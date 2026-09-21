import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export type AuthMode = 'login' | 'register';

export function AuthCardCarousel({ mode }: { mode: AuthMode }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const progress = useRef(new Animated.Value(mode === 'register' ? 1 : 0)).current;
  const [viewportWidth, setViewportWidth] = useState(0);
  const [loginHeight, setLoginHeight] = useState(0);
  const [registerHeight, setRegisterHeight] = useState(0);

  useEffect(() => {
    Animated.timing(progress, {
      duration: 360,
      easing: Easing.inOut(Easing.cubic),
      toValue: mode === 'register' ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [mode, progress]);

  const ready = viewportWidth > 0 && loginHeight > 0 && registerHeight > 0;
  const animatedHeight = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [loginHeight || 1, registerHeight || 1],
  });
  const loginTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -viewportWidth],
  });
  const registerTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [viewportWidth, 0],
  });
  const measure = (setter: (height: number) => void) => (event: LayoutChangeEvent) => {
    setter(event.nativeEvent.layout.height);
  };

  return (
    <Animated.View
      onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}
      style={[styles.viewport, { height: ready ? animatedHeight : 1, opacity: ready ? 1 : 0 }]}
    >
      <Animated.View
        accessibilityElementsHidden={mode !== 'login'}
        importantForAccessibility={mode === 'login' ? 'yes' : 'no-hide-descendants'}
        pointerEvents={mode === 'login' ? 'auto' : 'none'}
        style={[styles.panel, { transform: [{ translateX: loginTranslateX }] }]}
      >
        <AuthCard onLayout={measure(setLoginHeight)}>
          <LoginForm />
        </AuthCard>
      </Animated.View>
      <Animated.View
        accessibilityElementsHidden={mode !== 'register'}
        importantForAccessibility={mode === 'register' ? 'yes' : 'no-hide-descendants'}
        pointerEvents={mode === 'register' ? 'auto' : 'none'}
        style={[styles.panel, { transform: [{ translateX: registerTranslateX }] }]}
      >
        <AuthCard onLayout={measure(setRegisterHeight)}>
          <RegisterForm />
        </AuthCard>
      </Animated.View>
    </Animated.View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    viewport: {
      alignSelf: 'stretch',
      minHeight: theme.metrics.borderWidth,
      overflow: 'hidden',
      position: 'relative',
    },
    panel: {
      left: theme.spacing.none,
      position: 'absolute',
      right: theme.spacing.none,
      top: theme.spacing.none,
    },
  });
}
