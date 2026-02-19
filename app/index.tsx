import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { SegmentToggle } from '../components/SegmentToggle';
import { PillSelector } from '../components/PillSelector';
import { TextAreaInput } from '../components/TextAreaInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { useEmailForm } from '../hooks/useEmailForm';
import { generateEmailMock } from '../lib/generateEmailMock';
import { colors, spacing, typography } from '../lib/theme';
import type { EmailLength, EmailMode, EmailTone } from '../types/email';

const MODE_OPTIONS = [
  { value: 'new' as EmailMode, label: 'New Email' },
  { value: 'reply' as EmailMode, label: 'Reply' },
] as const;

const TONES: readonly EmailTone[] = [
  'Professional',
  'Friendly',
  'Formal',
  'Casual',
  'Persuasive',
  'Apologetic',
] as const;

const LENGTHS: readonly EmailLength[] = ['Short', 'Medium', 'Long'] as const;

export default function HomeScreen() {
  const {
    form,
    setMode,
    setRecipient,
    setTone,
    setLength,
    setIntent,
    setOriginalEmail,
    isValid,
  } = useEmailForm();

  const [loading, setLoading] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      const result = await generateEmailMock(form);
      router.push({
        pathname: '/result',
        params: {
          subject: result.subject,
          body: result.body,
        },
      });
    } finally {
      setLoading(false);
    }
  }, [form, isValid]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>EmailBuddy</Text>
            <Text style={styles.subtitle}>
              Craft the perfect email in seconds
            </Text>
          </View>

          <View style={styles.form}>
            <SegmentToggle
              options={MODE_OPTIONS}
              selected={form.mode}
              onChange={setMode}
            />

            <TextAreaInput
              label="Recipient"
              placeholder="e.g. John Smith, HR Department, MIT..."
              value={form.recipient}
              onChangeText={setRecipient}
            />

            <PillSelector
              label="Tone"
              options={TONES}
              selected={form.tone}
              onChange={setTone}
            />

            <PillSelector
              label="Length"
              options={LENGTHS}
              selected={form.length}
              onChange={setLength}
            />

            <TextAreaInput
              label="What do you want to say?"
              placeholder="Describe the purpose of your email..."
              value={form.intent}
              onChangeText={setIntent}
              multiline
              numberOfLines={4}
              maxLength={500}
            />

            {form.mode === 'reply' && (
              <TextAreaInput
                label="Original Email"
                placeholder="Paste the email you received..."
                value={form.originalEmail ?? ''}
                onChangeText={setOriginalEmail}
                multiline
                numberOfLines={6}
                maxLength={2000}
              />
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <PrimaryButton
            title="Generate Email"
            onPress={handleGenerate}
            disabled={!isValid}
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  header: {
    paddingTop: spacing['3xl'],
    paddingBottom: spacing['2xl'],
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.subtitle,
  },
  form: {
    gap: spacing['2xl'],
  },
  bottomBar: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
