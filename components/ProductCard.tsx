import React from 'react';
import { Link } from 'expo-router';
import tw from "tailwind-react-native-classnames";
import {View, Text, Image, Button} from 'react-native';

function ProductCard(props:string)  {
    return (
        <View style={tw``}>
            <Image
              source={{
                uri: props//.service_logo_uri
                ,
              }}
              style={tw``}
            />

            <Text style={tw``}>{props//.service_name
            }Produktnamn</Text>

            <Text style={tw``}>{props//.cost/price
            }Pris</Text>

            <Link style={tw``} href={{ pathname: "/", params: { slug: props } }}>
                <Button title="Hantera" />            
            </Link>
        </View>
      );
        };

export default ProductCard;