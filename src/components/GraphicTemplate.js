import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const GraphicTemplate = ({ children, title, subtitle }) => {
  return (
    <View style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>NKOROI{'\n'}FC</Text>
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
        <Text style={styles.footerText}>🌍 Nkoroi to the World 🌍</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth - 30,
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#87CEEB',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a472a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    paddingVertical: 20,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#87CEEB',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#87CEEB',
    fontWeight: 'bold',
  },
});

export default GraphicTemplate;
