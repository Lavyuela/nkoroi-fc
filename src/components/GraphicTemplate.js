import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const GraphicTemplate = ({ children, title, subtitle }) => {
  return (
    <View style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>NKOROI FC</Text>
        </View>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Nkoroi FC • Official</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 1080,
    backgroundColor: '#FFFFFF',
    padding: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#87CEEB',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1a472a',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 28,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingVertical: 30,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#87CEEB',
    marginTop: 30,
  },
  footerText: {
    fontSize: 20,
    color: '#87CEEB',
    fontWeight: 'bold',
  },
});

export default GraphicTemplate;
