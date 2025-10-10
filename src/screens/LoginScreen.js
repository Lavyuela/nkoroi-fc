import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, Snackbar, Portal, Dialog } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const { saveUserSession } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    const result = await loginUser(email, password);
    
    if (result.success) {
      // Check if user is in admin list
      const adminUsers = await AsyncStorage.getItem('adminUsers');
      const admins = adminUsers ? JSON.parse(adminUsers) : [];
      const isUserAdmin = admins.includes(email);
      
      // Save session - user stays logged in
      await saveUserSession(result.user, isUserAdmin);
      
      setLoading(false);
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    
    try {
      // Check if user exists
      const usersData = await AsyncStorage.getItem('registeredUsers');
      const users = usersData ? JSON.parse(usersData) : {};
      
      if (!users[resetEmail]) {
        setError('No account found with this email address');
        setLoading(false);
        return;
      }

      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15);
      const resetLink = `nkoroifc://reset-password?token=${resetToken}&email=${resetEmail}`;
      
      // Save reset token
      const resetTokens = await AsyncStorage.getItem('resetTokens') || '{}';
      const tokens = JSON.parse(resetTokens);
      tokens[resetToken] = {
        email: resetEmail,
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      await AsyncStorage.setItem('resetTokens', JSON.stringify(tokens));

      // Send email via Firebase Extension
      // Note: This requires Firestore to be enabled and Trigger Email extension installed
      const emailData = {
        to: resetEmail,
        message: {
          subject: 'Reset Your Nkoroi FC Password',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4FC3F7;">Reset Your Password</h2>
              <p>Hi there,</p>
              <p>You requested to reset your password for Nkoroi FC Live Score app.</p>
              <p>Your temporary password reset code is:</p>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #0277BD; margin: 0;">${resetToken}</h3>
              </div>
              <p>Or click the link below:</p>
              <a href="${resetLink}" style="background: #4FC3F7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
              <p style="margin-top: 20px;">This link expires in 24 hours.</p>
              <p>If you didn't request this, please ignore this email.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 12px;">Nkoroi FC Live Score Team</p>
            </div>
          `,
          text: `Reset your Nkoroi FC password. Your reset code is: ${resetToken}. This code expires in 24 hours.`
        }
      };

      // For demo: Show the reset code directly
      setResetMessage(`Password reset code: ${resetToken}\n\nIn production, this would be sent to ${resetEmail}`);
      setShowResetDialog(false);
      setResetEmail('');
      
      // TODO: When Firestore is enabled, uncomment this:
      // await addDoc(collection(firestore, 'mail'), emailData);
      
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>⚽</Text>
          <Text style={styles.title}>Nkoroi FC</Text>
          <Text style={styles.subtitle}>Live Score</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Login
            </Button>

            <Button
              mode="text"
              onPress={() => setShowResetDialog(true)}
              style={styles.forgotButton}
            >
              Forgot Password?
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              style={styles.registerButton}
            >
              Don't have an account? Register
            </Button>
          </Card.Content>
        </Card>

        <Snackbar
          visible={!!error}
          onDismiss={() => setError('')}
          duration={3000}
          style={styles.snackbar}
        >
          {error}
        </Snackbar>

        <Snackbar
          visible={!!resetMessage}
          onDismiss={() => setResetMessage('')}
          duration={5000}
          style={styles.successSnackbar}
        >
          {resetMessage}
        </Snackbar>

        <Portal>
          <Dialog visible={showResetDialog} onDismiss={() => setShowResetDialog(false)}>
            <Dialog.Title>Reset Password</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogText}>Enter your email address and we'll send you instructions to reset your password.</Text>
              <TextInput
                label="Email"
                value={resetEmail}
                onChangeText={setResetEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.dialogInput}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowResetDialog(false)}>Cancel</Button>
              <Button onPress={handleForgotPassword} loading={loading}>Send Reset Link</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4FC3F7',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#a8d5ba',
  },
  card: {
    elevation: 4,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#0277BD',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  forgotButton: {
    marginTop: 5,
  },
  registerButton: {
    marginTop: 10,
  },
  snackbar: {
    backgroundColor: '#d32f2f',
  },
  successSnackbar: {
    backgroundColor: '#4caf50',
  },
  dialogText: {
    marginBottom: 15,
    fontSize: 14,
  },
  dialogInput: {
    marginTop: 10,
  },
  demoNotice: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
  },
});

export default LoginScreen;
