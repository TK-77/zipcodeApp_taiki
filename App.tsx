import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  SafeAreaView,
} from "react-native";
import axios from "axios";

const apiBaseURL = "https://zipcloud.ibsnet.co.jp/api/search";

export default function App() {
  // const [isLoading, setIsLoading] = useState(false);
  // constloadingView = <Text>now loading</Text>;
  const [zipcode, setZipcode] = useState<string>("");
  const [addressList, setAddress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateAdressList = async () => {
    setIsLoading(true);
    try {
      const gottenZipcode = await getAdressListAsync(zipcode);
      setAddress(gottenZipcode);
    } catch (error) {
      alert(error);
    }

    setIsLoading(false);
  };

  //住所の情報を取ってくる処理
  const getAdressListAsync = async (zipcode: string) => {
    const requestConfig = {
      baseURL: apiBaseURL,
      params: {zipcode: zipcode},
    };

    const responce = await axios(requestConfig);
    const data = responce.data.results;
    console.log(data);

    return data;
  };

  const loadingView = <Text>Loading...</Text>
  const renderAddressItem = ({ item }: ListRenderItemInfo<any>) => {
    return (
      <Text style={styles.addressText}>
        {item.address1}
        {item.address2}
        {item.address3}
      </Text>
    );
  }

  const addressView = (
    <View>
      <FlatList
        data={addressList}
        renderItem={renderAddressItem}
        keyExtractor={(item, index: any) => `${index}`}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.inputs}>
          <TextInput
            style={styles.inputText}
            onChangeText={(text) => setZipcode(text)}
            keyboardType="numeric"
          />
          <Pressable onPress={updateAdressList} style={styles.buttons}>
            <Text style={styles.buttonText}>住所を取得</Text>
          </Pressable>
        </View>
        <Text style={styles.List}>
          {isLoading ? loadingView : addressView}
        </Text>
        <StatusBar style="auto" />
    </SafeAreaView>
  );
  }

  const screenWidth = Dimensions.get("screen").width;
  const screenHeight = Dimensions.get("screen").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputs: {
    flexDirection: "row",
    marginBottom: 20,
  },
  inputText: {
    width: 150,
    height: 50,
    textAlign: "right",
    padding: 10,
    fontSize: 30,
    backgroundColor: "#0000",
    color: "#000",
    borderWidth: 2,
  },
  buttons: {
    textAlign: "right",
    padding: 10,
    fontSize: 30,
    backgroundColor: "#9999FF",
    color: "#000",
    borderWidth: 2,
    borderRadius: 50,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 25,
  },
  addressText: {
    fontSize: 25,
    padding: 5,
  },
  List: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.5,
    borderWidth: 2,
    fontSize: 30,
    padding: 3,
  },

});
