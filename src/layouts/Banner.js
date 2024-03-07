import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function Banner() {
  return (
    <View style={styles.bannerWrapper}>
      <View style={styles.content}>
        <Text style={styles.bannerTextUpper}>Your tasks</Text>
        <Text style={styles.bannerTextLower}>340</Text>
      </View>
      <View style={styles.bannerBorder}></View>
      <View style={styles.content}>
        <Text style={styles.bannerTextUpper}>Finished</Text>
        <Text style={styles.bannerTextLower}>0</Text>
      </View>
      <View style={styles.bannerBorder}></View>
      <View style={styles.content}>
        <Text style={styles.bannerTextUpper}>Unfinished</Text>
        <Text style={styles.bannerTextLower}>0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    backgroundColor: '#FF6600',
    flexDirection: 'row',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginTop: 40,
    marginBottom: 25,
  },
  bannerBorder: {
    marginHorizontal: 10,
    borderRightWidth: 2,
    borderColor: '#ff983f',
  },
  content: {
    flex: 1,
  },
  bannerTextUpper: {
    fontSize: 14,
    lineHeight: 20,
    color: '#ffffa1',
  },
  bannerTextLower: {
    fontSize: 20,
    lineHeight: 28,
    color: '#ffffa1',
  },
});
