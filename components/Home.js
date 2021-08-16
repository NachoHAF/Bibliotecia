import React, {useState}from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    ImageBackground,
    Dimensions,
  } from 'react-native';
  import StickyParallaxHeader from 'react-native-sticky-parallax-header';
  import colors from '../assets/colors/colors';
  import categoriesData from '../assets/data/categoriesData';
  import Feather from 'react-native-vector-icons/Feather';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { useFocusEffect } from '@react-navigation/native';
  const {width} = Dimensions.get('screen');

  Icon.loadFont();
  Feather.loadFont();

  export default Home = ({ navigation }) => {
    const [estado, setEstado] = useState([]);
  
    useFocusEffect(
      React.useCallback(() => {
        fetchAllItems();
        return () => {};
      }, []),
    );
  
    const fetchAllItems = async () => {
      try {
        const todosDatos = await AsyncStorage.getAllKeys();
        if (todosDatos.length == 0) {
          const state = null;
          setEstado(state);
        } else {
          await AsyncStorage.getAllKeys().then(async (keys) => {
            await AsyncStorage.multiGet(keys).then((key) => {
              const result = [];
              key.forEach((data) => {
                result.push(data[1]);
                str = JSON.parse(JSON.stringify(result));
                const value = "[" + str + "]";
                const state = JSON.parse(value);
                setEstado(state);
              });
            });
          });
        }
      } catch (error) {
        //Alert.alert("Couldn't load data", error);
      }
    };
    
  
    const renderCategoryItem = ({ item }) => {
      return (
        <TouchableOpacity
          key={item.id}
          onPress={() => navigation.navigate("BooksList", { item: item })}
        >
          <View
            style={[
              styles.categoryItemWrapper,
              {
                backgroundColor: colors.white,
                marginLeft: item.id == 1 ? 20 : 0,
              },
            ]}
          >
            <Image source={item.image} style={styles.categoryItemImage} />
            <Text style={styles.categoryItemTitle}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      );
    };
  
    const PopularItemCard = ({ item }) => {
      return (
        <View style={styles.popularItemCard}>
          <View style={styles.iconContainer}>
            <Icon name="favorite" color={colors.red} size={25} />
          </View>
          <Image
            source={{ uri: item.backdrop }}
            style={{
              width: 100,
              height: "100%",
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              marginRight: 10,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.cardName}>{item.title}</Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 20,
                  marginTop: 90,
                  justifyContent: "center",
                }}
              >
                <Icon name="person" color={colors.black} size={18} />
                <Text numberOfLines={1} style={{width:100}}>{item.author}</Text>
              </View>
            </View>
          </View>
        </View>
      );
    };
  
    return (
      <>
        <ImageBackground
          style={{ flex: 1 }}
          source={require("../assets/images/biblioteca-angelica.jpg")}
          blurRadius={6}
        >
          <StickyParallaxHeader
            headerType="TabbedHeader"
            logo={require("../assets/images/logo.png")}
            backgroundColor="transparent"
            backgroundImage={{
              uri: "https://",
            }}
            title={"Ready for reading a book?"}
            /*titleStyle={{ color: 'white',
            fontWeight: 'bold',
            fontSize: 40,
            }}*/
            tabsContainerStyle={styles.tabsContainerStyle}
            tabs={[
              {
                title: "LETS MOVE!",
                content: (
                  <>
                    {/* Categories */}
                    <View style={styles.categoriesWrapper}>
                      <Text style={styles.categoriesTitle}>Categories</Text>
                      <View style={styles.categoriesListWrapper}>

                        <FlatList
                          data={categoriesData}
                          renderItem={renderCategoryItem}
                          keyExtractor={(item) => {
                            return item.id;
                          }}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                        />
                      </View>
                    </View>
  
                    {/* Favorites */}
                    <View style={styles.popularWrapper}>
                      <Text style={styles.popularTitle}>Favorites</Text>
  
                      <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 20 }}
                        data={estado}
                        keyExtractor={(item) => {
                          return item.key;
                        }}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                              navigation.navigate("BookDetail", { item: item });
                            }}
                          >
                            <PopularItemCard item={item} />
                          </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                          <View
                            style={{
                              flexDirection: "column",
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              height: 150,
                            }}
                          >
                            <Image
                              source={require("../assets/images/nodata.png")}
                              style={{ width: 60, height: 60, right: 40 }}
                            />
                            <Text
                              style={{
                                color: colors.white,
                                fontSize: 15,
                                fontWeight: "bold",
                                width: Dimensions.get("window").width,
                                textAlignVertical: "center",
                                textAlign: "center",
                                right: 40,
                              }}
                            >
                              There are currently no books in collection！
                            </Text>
                          </View>
                        }
                      />
                    </View>
                  </>
                ),
              },
            ]}
          />
        </ImageBackground>
      </>
    );
  };

const styles = StyleSheet.create({
  categoriesWrapper: {
    marginTop: 27,
  },
  categoriesTitle: {
    fontSize: 23,
    fontWeight: "bold",
    width: "55%",
    lineHeight: 30,
    paddingHorizontal: 20,
    color: colors.white,
  },
  categoriesListWrapper: {
    paddingTop: 15,
    paddingBottom: 20,
  },
  categoryItemWrapper: {
    marginRight: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    borderRadius: 20,
  },
  categoryItemImage: {
    width: 100,
    height: 150,
    alignSelf: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  categoryItemTitle: {
    textAlign: "center",
    fontSize: 13,
    marginTop: 15,
    fontWeight: "bold",
    paddingBottom: 15,
    color: '#191919',
  },
  popularWrapper: {
    paddingHorizontal: 20,
  },
  popularTitle: {
    fontSize: 23,
    fontWeight: "bold",
    width: "55%",
    lineHeight: 30,
    color: colors.white,
  },
  iconContainer: {
    height: 25,
    width: 25,
    backgroundColor: colors.white,
    position: "absolute",
    elevation: 2,
    right: 5,
    top: 5,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  popularItemCard: {
    height: 150,
    width: width - 100,
    backgroundColor: colors.white,
    elevation: 10,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 10,
    flexDirection: "row",
  },
  cardName: {
    marginTop: 10,
    height: 100,
    fontSize: 16,
    color: colors.orange,
    fontWeight: "bold",
    width: width - 240,
    position: "absolute",
    left: 5,
  },
  tabsContainerStyle: {
    display: "none",
  },
});
