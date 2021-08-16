import React, {useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Linking} from 'react-native';
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../assets/colors/colors';
import { ImageHeaderScrollView } from 'react-native-image-header-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';


Icon.loadFont();

const DetailsScreen = ({navigation, route}) => {
  const {item} = route.params;
  const [estado, setEstado] = useState(false);

  const agregarFavoritos = () => {
    setEstado(true);
  };

  const eliminarFavoritos = () => {
    setEstado(false);
 };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
        
        <ImageHeaderScrollView showsVerticalScrollIndicator={false}
       
        headerImage={ source={uri: item.poster}}
        maxHeight={300}
        minHeight={100}
        maxOverlayOpacity={0.8}
        minOverlayOpacity={0.1}
        foregroundParallaxRatio={2}
        useNativeDriver={true}
       
        renderForeground={() => ( 
         <View style={styles.imageDetails}>
          <Text
            style={{
              width: '90%',
              fontSize: 30,
              fontWeight: 'bold',
              color: colors.orange,
              marginBottom: 20,
            }}>
            {item.title}
          </Text>
        </View>
          )}
        >
          
      <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
      
   
      <View style={styles.detailsContainer}>
         
        <TouchableOpacity  style={styles.iconContainer} onPress={
            async () => {
              try {
                const existeYaDeAntes = await AsyncStorage.getItem(item.key)
                if (existeYaDeAntes != null)
                {
                    item.status = false

                    await AsyncStorage.removeItem(item.key)
                    agregarFavoritos()
                    eliminarFavoritos()
                }
                else
                {
                    item.status = true
              
                    const jsonValue = JSON.stringify(item) 
                    await AsyncStorage.setItem(item.key, jsonValue)
                  agregarFavoritos()  
                }
              } catch(e) {
                // error reading value
              }
            }           
         }
        >
        <View >
          <Icon name="favorite" color={item.status || estado ? colors.red : colors.gray} size={30} />
        </View>
        </TouchableOpacity>
    

        <View style={{flexDirection: 'row', marginTop: 10}}>
          <Icon name="person" size={28} color={colors.yellow} />
          <Text
            style={{
              marginLeft: 5,
              fontSize: 20,
              fontWeight: 'bold',
              color: colors.authorDetail,
            }}>
            {item.author}
          </Text>
        </View>
       
        <Text style={{marginTop: 20, fontWeight: 'bold', fontSize: 20}}>
          Introduction
        </Text>
        
        <Text style={{marginTop: 20, lineHeight: 22}}>{item.description_long}</Text>
        
      </View>
      </ImageHeaderScrollView>
      <View style={styles.header}>
          <Icon
            name="arrow-back-ios"
            size={28}
            color={colors.white}
            onPress={navigation.goBack}
          />
      </View>

      <View style={styles.footer}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.black,
            }}>
            Wanna read more?
          </Text>
        </View>
        <TouchableOpacity onPress={ ()=>{ Linking.openURL(item.url_download)}}>
          <View style={styles.downloadNowBtn}>
            <Text
              style={{color: colors.authorDetail, fontSize: 16, fontWeight: 'bold'}}>
              Download Now
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  downloadNowBtn: {
    height: 50,
    width: 150,
    backgroundColor: colors.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    height: 60,
    width: 60,
    position: 'absolute',
    top: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius:30,
    borderTopRightRadius:10,
    borderBottomLeftRadius:30,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  detailsContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    flex: 0.3,
  },
  header: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
  },
  imageDetails: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 5,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: colors.yellow,
    height: 70,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});

export default DetailsScreen;