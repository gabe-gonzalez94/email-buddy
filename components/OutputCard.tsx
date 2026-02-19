import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { colors, radius, spacing, typography } from '../lib/theme';

interface OutputCardProps {
  subject: string;
  body: string;
}

export function OutputCard({ subject, body }: OutputCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    Alert.alert('Copied!', 'Email copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.subjectLabel}>Subject</Text>
        <Text style={styles.subject}>{subject}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.body}>{body}</Text>

      <Pressable
        style={({ pressed }) => [
          styles.copyButton,
          pressed && styles.copyButtonPressed,
        ]}
        onPress={handleCopy}
      >
        <Text style={styles.copyButtonText}>
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  header: {
    padding: spacing.xl,
    gap: spacing.xs,
  },
  subjectLabel: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  subject: {
    ...typography.sectionLabel,
    fontSize: 17,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  body: {
    ...typography.body,
    padding: spacing.xl,
    lineHeight: 24,
  },
  copyButton: {
    margin: spacing.xl,
    marginTop: 0,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  copyButtonPressed: {
    backgroundColor: colors.primaryLight,
  },
  copyButtonText: {
    ...typography.button,
    color: colors.primary,
    fontSize: 14,
  },
});
