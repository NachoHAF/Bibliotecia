import * as React from "react";
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
} from "react-native";
const { width, height } = Dimensions.get("window");
import { getBooks } from "../api";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import colors from "../assets/colors/colors";
import FastImage from "react-native-fast-image";
import AsyncStorage from "@react-native-async-storage/async-storage";

Icon.loadFont();

const SPACING = 10;
const ITEM_SIZE = Platform.OS === "ios" ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;

const Loading = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.paragraph}>Loading...</Text>
  </View>
);

const Backdrop = ({ books, scrollX }) => {
  return (
    <View style={{ height: BACKDROP_HEIGHT, width, position: "absolute" }}>
      <FlatList
        data={books.reverse()}
        keyExtractor={(item) => item.key + "-backdrop"}
        removeClippedSubviews={false}
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        renderItem={({ item, index }) => {
          if (!item.backdrop) {
            return null;
          }
          const translateX = scrollX.interpolate({
            inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
            outputRange: [0, width],
          });
          return (
            <Animated.View
              removeClippedSubviews={false}
              style={{
                position: "absolute",
                width: translateX,
                height,
                overflow: "hidden",
              }}
            >
              <FastImage
                source={{ uri: item.backdrop }}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                  position: "absolute",
                }}
              />
            </Animated.View>
          );
        }}
      />
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "white"]}
        style={{
          height: BACKDROP_HEIGHT,
          width,
          position: "absolute",
          bottom: 0,
        }}
      />
    </View>
  );
};

export default App = ({ navigation, route }) => {
  const { item } = route.params;

  this.categoryName = item.category;

  const [books, setBooks] = React.useState([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const fetchData = async () => {
      const books = await getBooks(categoryName);

      for (let i = 0; i < books.length; i++) {
        const existeYaDeAntes = await AsyncStorage.getItem(books[i].key);
        if (existeYaDeAntes != null) {
          books[i].status = true;
        }
      }
      setBooks([{ key: "empty-left" }, ...books, { key: "empty-right" }]);
    };

    if (books.length === 0) {
      fetchData(books);
    }
  }, [books]);

  if (books.length === 0) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Backdrop books={books} scrollX={scrollX} />

      <StatusBar hidden />
      <View style={styles.header}>
        <Icon
          name="arrow-back-ios"
          size={28}
          color={colors.black}
          onPress={navigation.goBack}
        />
      </View>
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={books}
        keyExtractor={(item) => item.key}
        removeClippedSubviews={false}
        horizontal
        bounces={false}
        decelerationRate={Platform.OS === "ios" ? 0 : 0.98}
        renderToHardwareTextureAndroid
        contentContainerStyle={{ alignItems: "center" }}
        snapToInterval={ITEM_SIZE}
        snapToAlignment="start"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (!item.poster) {
            return <View style={{ width: EMPTY_ITEM_SIZE }} />;
          }

          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
            extrapolate: "clamp",
          });

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                navigation.navigate("BookDetail", { item: item });
              }}
            >
              <View style={{ width: ITEM_SIZE }}>
                <Animated.View
                  style={{
                    marginHorizontal: SPACING,
                    padding: SPACING * 2,
                    alignItems: "center",
                    transform: [{ translateY }],
                    backgroundColor: "white",
                    borderRadius: 34,
                    marginTop: -60,
                  }}
                >
                  <FastImage
                    source={{ uri: item.poster }}
                    style={styles.posterImage}
                  />

                  <Text style={{ fontSize: 24 }} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.author}>
                    <Text style={styles.authorText}>{item.author}</Text>
                  </View>
                  <Text style={{ fontSize: 12 }} numberOfLines={3}>
                    {item.description}
                  </Text>
                </Animated.View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

 
 const styles = StyleSheet.create({
   loadingContainer: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
   },
   container: {
     flex: 1,
   },
   paragraph: {
     margin: 24,
     fontSize: 18,
     fontWeight: 'bold',
     textAlign: 'center',
   },
   posterImage: {
     width: '100%',
     height: ITEM_SIZE * 1.2,
     resizeMode: 'cover',
     borderRadius: 24,
     //margin: 0,
     marginBottom: 10,
   },
   author: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: '#ccc',
    marginRight: 4,
    marginBottom: 6,
    marginTop: 6,
  },
  authorText: {
    fontSize: 9, 
    opacity: 0.8
  },
  header: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
 });
 