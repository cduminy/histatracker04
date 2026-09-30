import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { typography } from '@/styles/typography';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && { color: theme.accent },
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm, fontWeight: '500' },
  smallBold: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm, fontWeight: '700' },
  default: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.md, lineHeight: typography.lineHeight.md },
  title: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xxl, lineHeight: typography.lineHeight.xxl, fontWeight: '700' },
  subtitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl, lineHeight: typography.lineHeight.xl, fontWeight: '700' },
  link: { fontFamily: typography.fontFamily.medium, lineHeight: typography.lineHeight.lg, fontSize: typography.size.sm },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
