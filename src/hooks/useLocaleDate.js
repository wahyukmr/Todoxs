import {API_KEY} from '@env';
import {DateTime} from 'luxon';
import {useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export default function useDate() {
  const [locationPermissionStatus, setLocationPermissionStatus] =
    useState('pending');
  const [timezone, setTimezone] = useState({
    value: '',
    status: '',
  });
  const [localTime, setLocalTime] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        const grantedAccess = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (!grantedAccess) {
          const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Todox App Location Access Permission',
              message:
                'To provide you with the best features, ' +
                "Todox app requires access to your location's time and date.",
              buttonPositive: 'OK',
            },
          );
          console.log('status:', status);
          setLocationPermissionStatus(status);
          if (status !== 'granted') {
            setTimezone(prevState => ({...prevState, status: 'not_found'}));
          }
        }
        if (grantedAccess || locationPermissionStatus === 'granted') {
          setLocationPermissionStatus('granted');
          watchLocation();
        }
      } else {
        watchLocation();
      }
    } catch (error) {
      Alert.alert(
        'Warning!',
        'Your device does not support location features.',
      );
    }
  };

  const watchLocation = () => {
    const id = Geolocation.watchPosition(
      position => {
        console.log('position:', position);
        getTimezone(position);
      },
      error => {
        Alert.alert(
          'Warning!',
          'Unable to get user location: ' + error.message,
        );
        setTimezone(prevState => ({...prevState, status: 'not_found'}));
      },
      {distanceFilter: 1000, interval: 86400000},
    );
    setWatchId(id);
  };

  const getTimezone = async position => {
    try {
      const fetchTimeonedb = await fetch(
        `http://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${position.coords.latitude}&lng=${position.coords.longitude}`,
      );
      const resTimezonedb = await fetchTimeonedb.json();
      console.log('result:', resTimezonedb);
      setTimezone({status: 'available', value: resTimezonedb.zoneName});
      getLocalTime(resTimezonedb.zoneName);
    } catch (error) {
      Alert.alert('Warning!', 'Unable to get user location: ' + error.message);
      setTimezone(prevState => ({...prevState, status: 'not_found'}));
    }
  };

  const getLocalTime = timezone => {
    console.log('local:', timezone);
    const localTime = DateTime.now()
      .setZone(timezone)
      .toFormat('EEE, dd MMMM yyyy ZZZZ');
    setLocalTime(localTime);
  };

  const updateDateAtMidnight = timezone => {
    const now = DateTime.local();
    const tomorrow = now.plus({days: 1}).startOf('day');
    const msUntilMidnight = tomorrow.diff(now).as('milliseconds');

    setTimeout(() => {
      getLocalTime(timezone);
      updateDateAtMidnight();
    }, msUntilMidnight);
  };

  useEffect(() => {
    updateDateAtMidnight(timezone.value);
  }, [timezone.value]);

  return {
    locationPermissionStatus,
    requestLocationPermission,
    timezone,
    localTime,
    updateDateAtMidnight,
    watchId,
  };
}
