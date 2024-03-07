import React from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Header({...props}) {
  const {locationPermissionStatus, timezone, localTime} = props;

  console.log('tz.value:', timezone.value);
  console.log('tz.status:', timezone.status);
  console.log('ijin:', locationPermissionStatus);
  console.log('localTime:', localTime);

  const statusGranted = locationPermissionStatus === 'granted';
  const statusPanding = locationPermissionStatus === 'pending';

  const hideNotification =
    statusGranted || statusPanding || timezone.status === 'available';

  return (
    <View style={styles.headerWrapper}>
      <View>
        <Text style={styles.textHeadline}>Today's tasks</Text>
        <Text style={styles.textFormatDate}>
          {statusGranted
            ? localTime
              ? localTime
              : 'Obtaining the date...'
            : "Can't access date"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.btnNotification}
        onPress={() => {
          if (!hideNotification) {
            Alert.alert(
              'Location access permission is required',
              'The app requires location access permission to optimize features. You must manually enable location access permissions in device settings.',
              [
                {
                  text: 'open settings',
                  onPress: async () => await Linking.openSettings(),
                },
                {text: 'Cancle', style: 'cancel'},
              ],
            );
          }
        }}>
        <Icon
          name={hideNotification ? 'bell-outline' : 'bell-badge-outline'}
          size={25}
          color="#1d1f21"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textHeadline: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    color: '#1d1f21',
  },
  textFormatDate: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444648',
  },
  btnNotification: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    backgroundColor: '#f5f5f5',
  },
});
