import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, View, useColorScheme} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useLocaleDate} from './hooks';
import {Banner, Header} from './layouts';

export default function App() {
  const isDarkTheme = useColorScheme() === 'dark';
  const backgroundStyle = isDarkTheme ? '#1D1F21' : '#ffffff';

  const {
    locationPermissionStatus,
    requestLocationPermission,
    watchId,
    timezone,
    localTime,
  } = useLocaleDate();

  useEffect(() => {
    requestLocationPermission();
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [locationPermissionStatus]);
  console.log(locationPermissionStatus);

  return (
    <View style={{...styles.container, backgroundStyle}}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
      />
      <View style={styles.contentWrapper}>
        <Header
          localTime={localTime}
          timezone={timezone}
          locationPermissionStatus={locationPermissionStatus}
        />
        <Banner />
        {/* <TaskList />
        <InputNewTask /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    marginTop: 70,
    paddingHorizontal: 20,
  },
});
