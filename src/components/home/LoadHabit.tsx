import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

export default function LoadHabit() {
  return (
    <View style={styles.loadingContainer}>
      <StatusBar barStyle="light-content" />
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={styles.loadingText}>Loading your space...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
});
