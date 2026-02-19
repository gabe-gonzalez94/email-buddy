import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../lib/theme';

interface PillSelectorProps<T extends string> {
  label: string;
  options: readonly T[];
  selected: T;
  onChange: (value: T) => void;
}

export function PillSelector<T extends string>({
  label,
  options,
  selected,
  onChange,
}: PillSelectorProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pillRow}>
        {options.map((option) => {
          const isActive = option === selected;
          return (
            <Pressable
              key={option}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => onChange(option)}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm + 2,
  },
  label: {
    ...typography.sectionLabel,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  pillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  pillText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  pillTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
